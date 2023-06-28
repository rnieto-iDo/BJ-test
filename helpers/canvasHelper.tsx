/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { fabric } from 'fabric';
import uuid from 'react-uuid';
import { IProductExtended } from 'interfaces/productInterfaces';
import {
  createStringPath,
  makeFabricImage,
  makeFabricPath
} from './fabricHelper';
import {
  ICanvas,
  MidPoint,
  PathCoords,
  options
} from '../interfaces/canvasInterfaces';
import { ICanvasOptions, IEvent, Point } from 'fabric/fabric-impl';
import { angleOrientation, midPointSegment } from './mathHelper';
import { addModel, updatePositionModel } from './threekitHelper';
import { CANVAS_DIV_ID } from 'constants/fabric.constants';

//  sort items alphabet
export const sortAlphabeticalOrder = products => {
  const sortedProducts = [...products];
  sortedProducts.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return sortedProducts;
};
const canvasDefaultOptions: ICanvasOptions = {
  preserveObjectStacking: true,
  perPixelTargetFind: true,
  targetFindTolerance: 10,
  selection: false
};

const getViewPortCanvas = () => {
  return window.innerWidth < 500
    ? [0.669, 0, 0, 0.669, 214, 50]
    : [1, 0, 0, 1, 347, 228]; //: [1, 0, 0, 1, 349, 25];
};
// CREATE CANVAS
export const createCanvas = ({ id, width, height }: ICanvas) =>
  new fabric.Canvas(id, {
    width,
    height,
    viewportTransform: getViewPortCanvas(),
    ...canvasDefaultOptions
  });

let floorObject: fabric.Path;
let isDragging = false;
let lastPosX: any = 0;
let lastPosY: any = 0;
const PixelM: number = 40;
const dimensionDistance: number = 22;
const DeepWall: number = 15;

// RENDER ICON IN CONTROLS
export const reWriteControl = (
  contextParam: any,
  canvas: string,
  deleteImg: HTMLImageElement,
  editImg: HTMLImageElement,
  rotateImg: HTMLImageElement,
  editObject: (eventData: MouseEvent, transform: fabric.Transform) => boolean
) => {
  // Define the renderIcon function
  const showIconPlanner = (ctx: any, icon: any, bg: string) => {
    return function renderIcon(
      ctx: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: object,
      fabricObject: fabric.Object
    ) {
      ctx = contextParam;
      const size = 30;
      ctx.save();
      ctx.translate(left, top);
      ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));
      if (bg === 'front') {
        ctx.drawImage(icon, -size / 2, -size / 2, 25, 39);
      } else {
        ctx.drawImage(icon, -size / 2, -size / 2, size, size);
        ctx.fill();
      }
      ctx.restore();
    };
  };

  fabric.Object.prototype.controls.tr = new fabric.Control({
    x: fabric.Object.prototype.getScaledWidth() / 2,
    y: 0,
    offsetX: 20,
    offsetY: -30,
    withConnection: true,
    actionName: 'delete',
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    //render: renderIcon2(context, deleteImg, ''),
    render: function (
      context: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: fabric.Object
    ) {
      if (canvas === CANVAS_DIV_ID && context.canvas.id === CANVAS_DIV_ID) {
        showIconPlanner(context, deleteImg, '')(
          context,
          left,
          top,
          styleOverride,
          fabricObject
        );
      }
    }
  });

  fabric.Object.prototype.controls.mr = new fabric.Control({
    x: fabric.Object.prototype.getScaledWidth() / 2,
    y: 0,
    offsetX: 20,
    actionName: 'edit',
    cursorStyle: 'pointer',
    render: function (
      context: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: fabric.Object
    ) {
      if (canvas === CANVAS_DIV_ID && context.canvas.id === CANVAS_DIV_ID) {
        showIconPlanner(context, editImg, '')(
          context,
          left,
          top,
          styleOverride,
          fabricObject
        );
      }
    },
    mouseUpHandler: editObject
  });

  fabric.Object.prototype.controls.br = new fabric.Control({
    x: fabric.Object.prototype.getScaledWidth() / 2,
    y: 0,
    offsetX: 20,
    offsetY: 30,
    actionName: 'rotate',
    cursorStyle: 'pointer',
    render: function (
      context: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: fabric.Object
    ) {
      if (canvas === CANVAS_DIV_ID && context.canvas.id === CANVAS_DIV_ID) {
        showIconPlanner(context, rotateImg, '')(
          context,
          left,
          top,
          styleOverride,
          fabricObject
        );
      }
    },
    actionHandler: fabric.Object.prototype.controls.mtr.actionHandler
  });
};

// CANVAS LISTENERS
export const canvasListenersDetected = (
  canvas: fabric.Canvas,
  addProductData: (data: IProductExtended) => void,
  deleteProductRedux: (id: string, transform: fabric.Object) => void,
  hideSidebar: () => void,
  updatePositionProductRedux: (
    idProduct: string,
    offsetX: number,
    offsetY: number,
    angle: number
  ) => void
) => {
  // object removed
  canvas.on('object:removed', options => {
    const { target } = options;
    if (target?.type === 'Item') {
      deleteProductRedux(target.data.IdFabric, target);
    }
  });

  let getFloor: fabric.Object = canvas.getObjects('floor')[0];

  canvas.on('drop', (opt: any) => {
    const newId = uuid();
    let generatedId: any;
    const copyProduct = JSON.parse(opt.e.dataTransfer.getData('productRedux'));
    const newIdProd = {
      id: newId,
      ...copyProduct,
      offsetX: opt.e.offsetX,
      offsetY: opt.e.offsetY,
      topView: opt.e.dataTransfer.getData('product'),
      nodeId: '',
      angle: 0
    };
    let vp = canvas.viewportTransform;
    let zoom = vp![0];
    let xVp = vp![4];
    let yVp = vp![5];
    let lx = opt.e.layerX;
    let ly = opt.e.layerY;
    let lxresult = lx - xVp;
    let lyresult = ly - yVp;
    let missingValueX = lxresult * zoom;
    let missingValueY = lyresult * zoom;
    let diferentePercentX = lxresult / missingValueX;
    let diferentePercentY = lyresult / missingValueY;
    let newX = lxresult * diferentePercentX;
    let newY = lyresult * diferentePercentY;
    // if (opt.target?.type === 'floor')
    // {
    const urlProduct: string = opt.e.dataTransfer.getData('product');
    let coord = normalizeCoor(newX, 0, newY);
    generatedId = addModel(
      newIdProd.threekit_webgl_asset_id,
      'ModelAdd',
      coord,
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
      1
    );
    makeFabricImage(
      1,
      newIdProd.id,
      urlProduct,
      newX,
      newY,
      canvas,
      0,
      0,
      'Drag',
      generatedId
    );
    // }
    // else {
    //   const setToTop = getFloor.height! / 2;
    //   const setToLeft = getFloor.width! / 2;
    //   const urlProduct: string = opt.e.dataTransfer.getData('product');
    //   let coord = normalizeCoor(setToLeft, 0, setToTop);
    //   generatedId = addModel(newIdProd.assetId, 'ModelAdd', coord, { x: 0, y: 0, z: 180 }, { x: 1, y: 1, z: 1 }, 1)
    //   makeFabricImage(1, newIdProd.id, urlProduct, setToLeft, setToTop, canvas, 0, 0, 'Drag',generatedId);
    // }
    newIdProd.nodeId = generatedId;
    addProductData(newIdProd);
  });

  const constMoved = 0.0255 * 0.3047;

  const normalizeCoor = (x: any, y: any, z: any) => {
    let coord = { x: x! * constMoved, y: -y, z: z! * constMoved };
    return coord;
  };

  // Set the object's movement restriction within the rectangular area

  let finePoint: {
    x: number | undefined;
    y: number| undefined;
};

finePoint = {
    x: 10,
    y: 20,
};
  // // Set the object's movement restriction within the rectangular area
  canvas.on('object:modified', options => {
    // // Set the object's coordinates to be within the rectangular area
    const { target } = options;
    if (!target) return;
    if (
      !target.isContainedWithinRect(
        getFloor.aCoords?.tl,
        getFloor.aCoords?.br,
        true,
        true
      )
    ) {
      console.log(finePoint);
      //     // Update the position of the moving object
      target.set({
        left: finePoint.x,
        top: finePoint.y
      });

      //     // Update the coordinates of the moving object
      target.setCoords();

      // Render the canvas to reflect the updated position
      canvas.requestRenderAll();
    }
  });

  canvas.on('object:moving', options => {
    // Set the object's coordinates to be within the rectangular area
    const { target } = options;
    if (!target) return;
    target.setCoords();

    console.log(`Angle ${target.angle}`);
    console.log(`left ${target.left}`);
    console.log(`Top ${target.top}`);
    if(target.angle! != 0 && target.isContainedWithinRect(getFloor.aCoords?.tl, getFloor.aCoords?.br, true, true)){
        finePoint.x = target.left;
        finePoint.y = target.top;
    }
    if (target.angle! == 0 && !target.isContainedWithinRect(getFloor.aCoords?.tl, getFloor.aCoords?.br, true, true)) {
        // If the object's center point is outside the rectangular area, restrict its movement
        target.top = Math.min(Math.max(target.top!, getFloor.top!), getFloor.top! + getFloor.height! - target.height!);
        target.left = Math.min(Math.max(target.left!, getFloor.left!), getFloor.left! + getFloor.width! - target.width!);
        target.setCoords();
        canvas.renderAll();
    }
});
  let lastPosX: any = null;
  let lastPosY: any = null;

  // Enable moving the canvas viewport
  canvas.on('mouse:down', (opt: any) => {
    const evt = opt.e;

    if (opt.target === null || opt.target?.type === 'floor') {
      isDragging = true;
      canvas.selection = false;
      if (opt.e.type === 'touchstart') {
        const event: any = opt.e;
        lastPosX = event.touches[0].clientX;
        lastPosY = event.touches[0].clientY;
        return;
      }
      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
      return;
    }
  });

  canvas.on('mouse:move', event => {
    if (lastPosX !== null && lastPosY !== null) {
      const deltaX = event.e.clientX - lastPosX;
      const deltaY = event.e.clientY - lastPosY;
      canvas.relativePan({ x: deltaX, y: deltaY });
      lastPosX = event.e.clientX;
      lastPosY = event.e.clientY;
    }
  });

  canvas.on('mouse:up', event => {
    lastPosX = null;
    lastPosY = null;
    let target = event.target as fabric.Object;
    if (target?.type == 'Item') {
      let coord = normalizeCoor(target.left, 0, target.top);
      let rotate = { x: 0, y: 0 - target.angle!, z: 0 };
      updatePositionModel(target.data.generatedId, coord, rotate);
      updatePositionProductRedux(
        target.data.IdFabric,
        target.left!,
        target.top!,
        target.angle!
      );
      return;
    }
    if (target?.type !== 'Item') {
      hideSidebar();
      return;
    }
  });

  canvas.on('mouse:wheel', (event: fabric.IEvent<WheelEvent>) => {
    // // Prevent scrolling on the page when mouse is over canvas
    event.e.preventDefault();
    event.e.stopPropagation();
    const point: MidPoint = { x: 450, y: 350 };
    let zoom: number = canvas.getZoom();

    zoom *= 0.999 ** event.e.deltaY;

    if (zoom > 20) zoom = 20;
    if (zoom < 0.1) zoom = 0.1;
    canvas.zoomToPoint(point, zoom);
    canvas.setZoom(zoom);
    canvas.requestRenderAll();
  });
  // Set initial zoom level
  let zoomLevel = 1;

  // Set the zoom point (center of the canvas in this example)
  const point = { x: canvas?.width! / 2, y: canvas?.height! / 2 };

  // Add mouse wheel event listener
  canvas.on('mousewheel', function (opt) {
    const evt = opt.e as WheelEvent;
    const delta = evt.deltaY;
    let zoom = canvas.getZoom();

    // Calculate new zoom level
    zoomLevel = zoom + delta / 1000;
    zoomLevel = Math.max(0.1, zoomLevel); // set minimum zoom level
    zoomLevel = Math.min(10, zoomLevel); // set maximum zoom level

    // Set the zoom
    canvas.zoomToPoint(point, zoomLevel);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  });
};

// Functions tooltip
const deleteObject = (
  eventData: MouseEvent,
  transform: fabric.Transform
): boolean => {
  const { target } = transform;
  const { canvas } = target;
  canvas?.remove(target);
  canvas?.requestRenderAll();
  return true;
};

export const makePathWall = (
  coords: PathCoords,
  pathConfig: any
): fabric.Path => {
  return makeFabricPath(createStringPath(coords), pathConfig);
};

export const createSvgOnThreekit = async () => {
  let pathCustom: string = localStorage.getItem('floorPath') ?? '';
  let svgString = [
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg><path stroke="#00b400" d="' +
      pathCustom +
      '"/> </svg>'
  ].join('');
  const config = {
    svg: svgString
  };
  const response = await fetch(
    'https://brown-jordan.herokuapp.com/uploadfile',
    {
      // const response = await fetch('http://localhost:5001/uploadfile', {
      method: 'POST',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      body: JSON.stringify(config)
    }
  )
    .then(res => res.json())
    .then(data => {
      return data;
    })
    .catch(e => {
      console.error(e);
    });
  return response;
};

export const createFloor3Kit = (
  canvas: fabric.Canvas
  //  savePathFloor: any
) => {
  let pathText: any = '';
  let pathTextSecondPath: string = '';
  let floor = canvas.getObjects('floor');
  let points = [
    floor[0]?.aCoords?.tl,
    floor[0]?.aCoords?.tr,
    floor[0]?.aCoords?.br,
    floor[0]?.aCoords?.bl
  ];
  pathTextSecondPath = createPathToSvg(points);
  pathText = 'M ' + pathTextSecondPath + ' z';
  // savePathFloor('M ' + pathTextSecondPath);
  return pathText;
};

const currentFactorConvert = 0.025 * 0.3047;
//  const currentFactorConvert = 1;

export const createPathToSvg = (points: any[]) => {
  let pathText = '';
  let factorConver = currentFactorConvert;
  for (let i = 0; i < points.length; i++) {
    if (i == 0) {
      pathText += factorConver * points[i].x + ' ' + factorConver * points[i].y;
    } else {
      pathText +=
        ' L ' + factorConver * points[i].x + ' ' + factorConver * points[i].y;
    }
    if (i == points.length - 1) {
      pathText +=
        ' L ' + factorConver * points[0].x + ' ' + factorConver * points[0].y;
    }
  }
  return pathText;
};
