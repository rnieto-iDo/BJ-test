/* eslint-disable no-unused-expressions */
/* eslint-disable operator-assignment */
/* eslint-disable radix */
import { fabric } from 'fabric';
import {
  ICanvasOptions,
  ILineOptions,
  IObjectOptions,
  ITextOptions,
  TextOptions
} from 'fabric/fabric-impl';
import { promises } from 'dns';
import {
  angleOrientation,
  lineSegmentLength,
  measureText,
  midPointSegment
} from './mathHelper';
import {
  ICanvas,
  LineCoords,
  PathCoords,
  SizeRoom
} from '../interfaces/canvasInterfaces';
import { createFloor3Kit } from './canvasHelper';
import { addModel } from './threekitHelper';
import { IProductExtended } from '../interfaces/productInterfaces';

const PixelM = 40;
const dimensionDistance = 22;

// eslint-disable-next-line no-undef
//  RESiZE FLOOR
export const resizeFloor = (
  width: number,
  height: number,
  canvas: fabric.Canvas,
  unitMeasure: string,
  addRoomSizeRedux: (size: SizeRoom) => void
) => {
  if (canvas) {
    let w = parseInt(width.toString()) * PixelM;
    let h = parseInt(height.toString()) * PixelM;
    let getFloor2: fabric.Object = canvas.getObjects('floor')[0];
    if (!getFloor2) return;
    getFloor2.set({
      width: w,
      height: h
    });
    getFloor2.setCoords();
    canvas.renderAll();
    addRoomSizeRedux({
      left: getFloor2.left,
      top: getFloor2.top,
      width: width,
      height: height,
      large: width,
      deep: height
    });
    showDimensions(unitMeasure, canvas);
    localStorage.setItem('floorPath', createFloor3Kit(canvas));
  }
};

// SHOW DIMENSIONS
export const showDimensions = (unitMeasure: string, canvas: fabric.Canvas) => {
  if (canvas) {
    // eslint-disable-next-line prefer-const
    const getFloor: fabric.Object = canvas.getObjects('floor')[0];
    if (!getFloor) return;
    const Line3 = {
      x1: getFloor.aCoords?.br.x,
      y1: getFloor.aCoords?.br.y,
      x2: getFloor.aCoords?.bl.x,
      y2: getFloor.aCoords?.bl.y
    };

    // LINE 3 ----->🧎
    const angleLine3 = angleOrientation({
      x1: Line3.x1!,
      y1: Line3.y1!,
      x2: Line3.x2!,
      y2: Line3.y2!
    });

    // Maths to calculate the distance to draw the dimension line
    const dir3 = 359.7 - angleLine3 * (Math.PI / 180);
    const distanceX3 = Math.cos(dir3) * dimensionDistance - 1.23;
    const distanceY3 = Math.sin(dir3) * dimensionDistance - 0.23;

    // eslint-disable-next-line no-use-before-define
    const newDistance3 = increaseMeasurementTextMargin(
      distanceX3,
      distanceY3,
      0
    );

    // eslint-disable-next-line no-use-before-define
    const { connector, text } = makeLineDimension(
      {
        x1: Line3.x1! + newDistance3.distanceX,
        y1: Line3.y1! - newDistance3.distanceY,
        x2: Line3.x2! + newDistance3.distanceX,
        y2: Line3.y2! - newDistance3.distanceY
      },
      18,
      unitMeasure
    );
    canvas.add(connector);
    canvas.add(text);

    // LINE 4 ----->🧎
    const Line4 = {
      x1: getFloor.aCoords?.bl.x,
      y1: getFloor.aCoords?.bl.y,
      x2: getFloor.aCoords?.tl.x,
      y2: getFloor.aCoords?.tl.y
    };

    const angleLine4 = angleOrientation({
      x1: Line4.x1!,
      y1: Line4.y1!,
      x2: Line4.x2!,
      y2: Line4.y2!
    });
    // Maths to calculate the distance to draw the dimension line
    const dir4 = 359.7 - angleLine4 * (Math.PI / 180);
    const distanceX4 = Math.cos(dir4) * dimensionDistance - 1.23;
    const distanceY4 = Math.sin(dir4) * dimensionDistance - 0.23;

    // eslint-disable-next-line no-use-before-define
    const newDistance4 = increaseMeasurementTextMargin(
      distanceX4,
      distanceY4,
      0
    );

    // eslint-disable-next-line no-use-before-define
    const conectors = makeLineDimension(
      {
        x1: Line4.x1! + newDistance4.distanceX,
        y1: Line4.y1! - newDistance4.distanceY,
        x2: Line4.x2! + newDistance4.distanceX,
        y2: Line4.y2! - newDistance4.distanceY
      },
      18,
      unitMeasure
    );
    canvas.add(conectors.connector);
    canvas.add(conectors.text);
    canvas.renderAll();
  }
};

export const increaseMeasurementTextMargin = (
  distanceX: number,
  distanceY: number,
  marginMeasureText: number
) => {
  if (Math.abs(distanceY) > Math.abs(distanceX)) {
    // eslint-disable-next-line no-unused-expressions
    distanceY < 0
      ? (distanceY = distanceY - marginMeasureText)
      : (distanceY += marginMeasureText);
  } else {
    distanceX < 0
      ? (distanceX = distanceX - marginMeasureText)
      : (distanceX += marginMeasureText);
  }

  return { distanceX, distanceY };
};

// CREATE FLOOR
export const createFloor = (
  width: number,
  height: number,
  canvas: fabric.Canvas,
  addRoomSizeRedux: (size: SizeRoom) => void,
  unitMeasure: string,
  isRebuild = false
) => {
  if (!isRebuild) {
    (width = width * PixelM), (height = height * PixelM);
  }
  const floor = new fabric.Rect({
    left: -200,
    top: -200,
    width,
    height,
    hasControls: false,
    selectable: false,
    lockMovementX: false,
    lockMovementY: false,
    type: 'floor',
    fill: '#CCC8C2',
    stroke: 'black',
    strokeWidth: 2
  });
  canvas.add(floor);
  canvas.requestRenderAll();
  showDimensions(unitMeasure, canvas);
  addRoomSizeRedux({
    left: floor.left,
    top: floor.top,
    width: floor.width,
    height: floor.height
  });
  localStorage.setItem('floorPath', createFloor3Kit(canvas));
};

// OBJECT IMG CANVAS USING FABRIC
export const makeFabricImage = (
  index: number,
  idFabric: string,
  url: string,
  left: number | undefined,
  top: number | undefined,
  canvas: fabric.Canvas,
  angle: number | undefined,
  location: number | undefined,
  typeAdd: string | undefined,
  generatedId: string
) => {
  fabric.Image.fromURL(
    `${url}`,
    img => {
      img.hasControls = true;
      img.hasBorders = false;
      img.top = top;
      img.left = left;
      img.name = `Item${index}`;
      img.type = 'Item';
      img.selectable = true;
      img.cornerSize = 25;
      img.data = {
        Index: index,
        IdFabric: idFabric,
        location,
        typeAdd,
        generatedId,
        lastpositionValid: { x: 0, y: 0 }
      };
      const currentAngle = angle;
      img.angle = currentAngle;
      canvas.add(img);
    },
    {
      crossOrigin: 'Anonymous'
    }
  );
};

// TEXT DIMENSIONS
const textDefaults: ITextOptions = {
  selectable: false,
  scaleX: 0.7,
  scaleY: 0.7,
  originX: 'center',
  originY: 'center',
  textBackgroundColor: 'white',
  hoverCursor: 'pointer',
  name: 'TextDimension',
  borderColor: 'transparent',
  cornerStrokeColor: 'transparent'
};

export const makeFabricText = (
  text: string,
  fontSizeOfMeasureText: number,
  coords: Pick<TextOptions, 'top' | 'left'>,
  options?: Omit<TextOptions, 'top' | 'left'>
): fabric.Text =>
  new fabric.Text(text, {
    ...textDefaults,
    ...options,
    ...coords,
    fontSize: fontSizeOfMeasureText
  });

// Line Dimensions
const dimensionDefaults: ILineOptions = {
  stroke: 'black',
  strokeWidth: 2,
  selectable: false,
  scaleX: 1,
  scaleY: 1,
  originX: 'center',
  originY: 'center',
  name: 'Dimension',
  borderColor: 'transparent',
  cornerStrokeColor: 'transparent'
};

const lineDefaults: ILineOptions = {
  stroke: '#273f8e',
  strokeWidth: 6,
  selectable: false,
  lockMovementX: false,
  lockMovementY: false,
  lockScalingX: true,
  lockScalingY: false,
  lockRotation: true,
  perPixelTargetFind: true,
  scaleX: 1,
  scaleY: 1,
  hoverCursor: 'pointer',
  borderColor: 'transparent',
  cornerStrokeColor: 'transparent',
  absolutePositioned: true,
  originX: 'center',
  originY: 'center',
  hasControls: false
};

export const makeFabricLine = (
  coords: LineCoords,
  options?: ILineOptions
): fabric.Line => {
  const lineProperties = lineDefaults;
  lineProperties.stroke =
    options?.data?.stroke !== undefined
      ? options?.data?.stroke
      : lineDefaults.stroke;
  return new fabric.Line([coords.x1, coords.y1, coords.x2, coords.y2], {
    ...lineProperties,
    ...options
  });
};

export const makeLineDimension = (
  coords: LineCoords,
  fontSizeOfMeasureText: number,
  unitMeasure: string,
  pointCurve?: string
): { connector: fabric.Line; text: fabric.Text } => {
  const { x: left, y: top } = midPointSegment(coords);
  const dimensionLine: number = parseFloat(
    lineSegmentLength(coords).toFixed(2)
  );
  let dimensionFeet: number = dimensionLine / PixelM;
  let getDecimal = `0.${dimensionFeet.toString().split('.')[1]}`;
  dimensionFeet = Math.trunc(dimensionFeet);
  if (unitMeasure === 'inch') {
    dimensionFeet = dimensionFeet / 12;
    getDecimal = `0.${dimensionFeet.toString().split('.')[1]}`;
    if (dimensionFeet < 1) {
      dimensionFeet = 0;
    } else {
      dimensionFeet = Math.trunc(dimensionFeet);
    }
  }
  const dimensionInches: number = parseFloat(
    (Number(getDecimal) * 12).toFixed(0)
  );
  let dimensionText = measureText(dimensionFeet, dimensionInches);
  if (unitMeasure === 'inch') {
    dimensionText = `${Math.trunc(dimensionLine / PixelM).toString()}"`;
  }

  if (pointCurve !== undefined) {
    dimensionDefaults.data = pointCurve;
  } else {
    dimensionDefaults.data = '';
  }
  return {
    connector: makeFabricLine(coords, dimensionDefaults),
    // add dynamic measure text
    text: makeFabricText(dimensionText, fontSizeOfMeasureText, {
      left,
      top
    })
  };
};

export const clearLineDimensions = (
  canvas: fabric.Canvas | undefined
): void => {
  if (!canvas) return;
  canvas.getObjects().forEach(obj => {
    if (obj.name === 'Dimension' || obj.name === 'TextDimension') {
      canvas.remove(obj);
    }
  });
  canvas.discardActiveObject().renderAll();
};

const pathDefaults = {
  fill: '',
  stroke: '#273f8e',
  paintFirst: 'fill',
  backgroundColor: 'transparent',
  strokeWidth: 10,
  objectCaching: false,
  perPixelTargetFind: true,
  padding: 10000,
  type: 'Curve',
  hoverCursor: 'pointer'
};

export const makeFabricPath = (stringPath: string, pathConfig: any) => {
  let pathProperties = pathDefaults;
  pathProperties.stroke = pathConfig.stroke;
  return new fabric.Path(stringPath, {
    ...pathProperties,
    data: pathConfig
  });
};

export const createStringPath = ({
  x1,
  x2,
  y1,
  y2,
  curveX,
  curveY
}: PathCoords): string =>
  `M ${x1} ${y1} C ${curveX ?? x2} ${curveY ?? y2},${x2} ${
    curveY ?? y2
  } ${x2} ${y2}`;

export const reBuildRoom = (
  room: SizeRoom,
  products: Array<IProductExtended> | undefined,
  canvas: fabric.Canvas | undefined,
  saveItems: (itemsCopy: Array<IProductExtended>) => void,
  addRoomSizeRedux: (size: SizeRoom) => void,
  unitMeasure: string
) => {
  if (!products) return false;
  createFloor(
    room.width!,
    room.height!,
    canvas!,
    addRoomSizeRedux,
    unitMeasure,
    true
  );
  const tempProducts: Array<IProductExtended> = [];
  products.map((product: IProductExtended) => {
    let coord = normalizeCoor(product.offsetX, 0, product.offsetY);
    let generatedId = addModel(
      product.threekit_webgl_asset_id,
      'ModelAdd',
      coord,
      { x: 0, y: 0 - product.angle!, z: 0 },
      { x: 1, y: 1, z: 1 },
      1
    );
    makeFabricImage(
      1,
      product?.id!,
      product.topView!,
      product.offsetX,
      product.offsetY,
      canvas!,
      product.angle,
      0,
      'Drag',
      generatedId
    );
    product.nodeId = generatedId;
    tempProducts.push(product);
  });
  saveItems(tempProducts);
  return true;
};

const constMoved = 0.0255 * 0.3047;

const normalizeCoor = (x: any, y: any, z: any) => {
  let coord = { x: x! * constMoved, y: -y, z: z! * constMoved };
  return coord;
};

//SPECIFY WHICH CONTROLS WE WILL USE TO POSITION ICONS
fabric.Object.prototype.setControlsVisibility({
  bl: false, // bottom-left
  br: true, // bottom-right
  mb: false, // middle-bottom
  ml: false, // middle-left
  mr: true, // middle-right
  mt: false, // middle-top
  tl: false, // top-left
  tr: true, // top-right
  mtr: false // rotate icon
});
