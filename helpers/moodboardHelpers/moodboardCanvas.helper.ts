/* eslint-disable no-unsafe-optional-chaining */
import { fabric } from 'fabric-moodboard';
import JSPDF from 'jspdf';

fabric.Object.prototype.setControlsVisibility({
  bl: true, // bottom-left
  br: true, // bottom-right
  mb: false, // middle-bottom
  ml: false, // middle-left
  mr: false, // middle-right
  mt: false, // middle-top
  tl: true, // top-left
  tr: true, // top-right
  mtr: false // rotate icon
});

// RENDER CUSTOMS ICONS
export const renderIcon = (icon: any, bg: string) =>
  // eslint-disable-next-line no-shadow
  function renderIcon(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    styleOverride: object,
    fabricObject: fabric.Object
  ) {
    const size = 30;

    if (bg === 'bgtrue') {
      // ctx.save();
      // ctx.beginPath();
      // ctx.rect(left -15, top-15, size1, size1);
      // ctx.shadowColor = '#00000055';
      // ctx.shadowBlur = 4;
      // ctx.fillStyle = '#ffffff';
      // ctx.fill();
      // ctx.lineWidth = 2;
      // ctx.restore();
    }
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle!));

    if (bg === 'front') {
      ctx.drawImage(icon, -size / 2, -size / 2, 25, 39);
    } else if (bg === 'wide') ctx.drawImage(icon, -size / 2, -size / 2, 40, 20);
    else {
      ctx.drawImage(icon, -size / 2, -size / 2, size, size);
      ctx.fill();
    }
    ctx.restore();
  };

export const createMoodboardCanvas = ({ id, width, height }) =>
  new fabric.Canvas(id, {
    width,
    height,
    preserveObjectStacking: true
  });

export const getCanvasObjectBySku = (sku: string, canvas: fabric.Canvas) => {
  const canvasObject = canvas.getObjects().find(item => item.data.sku === sku);
  return canvasObject;
};

export const addMoodboardCanvasImage = (
  index: number,
  sku: string,
  url: string,
  left: number | 0,
  top: number | 0,
  canvas: fabric.Canvas,
  itemType: 'Product' | 'Material' | 'Image',
  threekitConfig?: {
    assetId: string;
  }
) =>
  fabric.Image.fromURL(
    url,
    oImg => {
      oImg.scaleToHeight(300);
      oImg.scaleToWidth(300);
      canvas.add(oImg);
    },
    {
      top,
      left,
      fill: 'yellow',
      selectable: true,
      padding: 0,
      borderScaleFactor: 0.5,
      strokeMiterLimit: 1,
      data: { index, sku, itemType, threekitConfig },
      crossOrigin: '*'
    }
  );

const decreaseZIndex = (
  eventData: MouseEvent,
  transform: fabric.Transform
): boolean => {
  const { target } = transform;
  target.sendBackwards();
  return true;
};
const increaseZIndex = (
  eventData: MouseEvent,
  transform: fabric.Transform
): boolean => {
  const { target } = transform;
  target.bringForward();
  return true;
};

const threeDotsClicked = (
  eventData: MouseEvent,
  transform: fabric.Transform,
  customHandler: (t: any) => void
): boolean => {
  const { target } = transform;
  customHandler(target);
  return true;
};

export const reWriteControlMoodboard = (
  deleteImg: HTMLImageElement,
  arrowDownImg: HTMLImageElement,
  arrowUpImg: HTMLImageElement,
  rotateImg: HTMLImageElement,
  threeDotObject: {
    threeDotImage: HTMLImageElement;
    threeDotClickedHandler: any;
  }
) => {
  // Z-INDEX CONTROLLS //
  fabric.Object.prototype.controls.incrementZIndex = new fabric.Control({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: -0,
    withConnection: true,
    actionName: 'incrementZIndex',
    cursorStyle: 'pointer',
    mouseUpHandler: increaseZIndex,
    render: renderIcon(arrowUpImg, '')
  });
  fabric.Object.prototype.controls.decrementZIndex = new fabric.Control({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 30,
    withConnection: true,
    actionName: 'decrementZIndex',
    cursorStyle: 'pointer',
    mouseUpHandler: decreaseZIndex,
    render: renderIcon(arrowDownImg, '')
  });
  // Z-INDEX CONTROLLS END //

  fabric.Object.prototype.controls.rotate = new fabric.Control({
    x: 0.5,
    y: 0.5,
    offsetX: 20,
    offsetY: 20,
    actionName: 'rotate',
    cursorStyle: 'pointer',
    render: renderIcon(rotateImg, ''),
    actionHandler: fabric.Object.prototype.controls.mtr.actionHandler
  });

  fabric.Object.prototype.controls.threeDotOptions = new fabric.Control({
    x: 0.4,
    y: -0.4,
    offsetX: 0,
    offsetY: 0,
    actionName: 'threeDotMenu',
    cursorStyle: 'pointer',
    sizeX: 100,
    sizeY: 50,
    render: renderIcon(threeDotObject.threeDotImage, 'wide'),
    mouseUpHandler: (e: MouseEvent, t: fabric.Transform) =>
      threeDotsClicked(e, t, threeDotObject.threeDotClickedHandler)
  });
};
export const setCanvasEventListeners = (canvas: fabric.Canvas) => {
  canvas.on('object:moving', e => {
    const obj: any = e.target;
    // if object is too big ignore
    if (
      obj.currentHeight > obj.canvas.height ||
      obj.currentWidth > obj.canvas.width
    ) {
      return;
    }
    obj.setCoords();
    // top-left  corner
    if (obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0) {
      obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top + 7);
      obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left + 7);
    }
    // bot-right corner
    if (
      obj.getBoundingRect().top + obj.getBoundingRect().height >
        obj.canvas.height ||
      obj.getBoundingRect().left + obj.getBoundingRect().width >
        obj.canvas.width
    ) {
      obj.top = Math.min(
        obj.top,
        obj.canvas.height -
          obj.getBoundingRect().height +
          obj.top -
          obj.getBoundingRect().top -
          7
      );
      obj.left = Math.min(
        obj.left,
        obj.canvas.width -
          obj.getBoundingRect().width +
          obj.left -
          obj.getBoundingRect().left -
          7
      );
    }
  });

  let left1 = 0;
  let top1 = 0;
  let scale1x = 0;
  let scale1y = 0;
  let width1 = 0;
  let height1 = 0;
  canvas.on('object:scaling', e => {
    const obj: any = e.target;
    obj.setCoords();
    const brNew = obj.getBoundingRect();

    if (
      brNew.width + brNew.left >= obj.canvas.width ||
      brNew.height + brNew.top >= obj.canvas.height ||
      brNew.left < 0 ||
      brNew.top < 0
    ) {
      obj.left = left1;
      obj.top = top1;
      obj.scaleX = scale1x;
      obj.scaleY = scale1y;
      obj.width = width1;
      obj.height = height1;
    } else {
      left1 = obj.left;
      top1 = obj.top;
      scale1x = obj.scaleX;
      scale1y = obj.scaleY;
      width1 = obj.width;
      height1 = obj.height;
    }
  });
};

const addFooters = doc => {
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(15);
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      'For more information please visit:',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 30,
      {
        align: 'center'
      }
    );
    doc.text(
      'brownjordan.com',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 15,
      {
        align: 'center'
      }
    );
  }
};
const addHeaderAndFootersPortrait = doc => {
  const pageCount = doc.internal.getNumberOfPages();
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const abcArizona = '../../assets/fonts/ABCArizonaFlare-Light.otf';
    const pageWidth = doc.internal.pageSize.getWidth();
    const fontSize = 50;
    const titleText = 'Brown Jordan';
    doc.addFileToVFS('ABCArizonaFlare-Light.otf', abcArizona);
    doc.addFont(
      'ABCArizonaFlare-Light.otf',
      'ABC Arizona Flare Light',
      'normal'
    );
    doc.setFontSize(fontSize);
    doc.text(titleText, pageWidth / 2, 45, {
      align: 'center'
    });
    doc.setFontSize(15);
    doc.text(
      'For more information please visit:',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 30,
      {
        align: 'center'
      }
    );
    doc.text(
      'brownjordan.com',
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 15,
      {
        align: 'center'
      }
    );
  }
};

export const downloadMoodboardPdf = (canvas: fabric.Canvas) => {
  if (!canvas) return;
  if (!canvas.width || !canvas.height) return;

  const abcArizona = '../../assets/fonts/ABCArizonaFlare-Light.otf';

  const fontSize = 50;
  const titleText = 'Brown Jordan';
  const image = canvas.toDataURL();

  const doc = new JSPDF('l', 'px', 'a4');

  doc.addFileToVFS('ABCArizonaFlare-Light.otf', abcArizona);
  doc.addFont('ABCArizonaFlare-Light.otf', 'ABC Arizona Flare Light', 'normal');

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const widthRatio = pageWidth / canvas?.width;
  const heightRatio = pageHeight / canvas?.height;
  const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

  const canvasWidth = canvas?.width * ratio * 0.8;
  const canvasHeight = canvas?.height * ratio * 0.8;

  const marginX = (pageWidth - canvasWidth) / 2;
  const marginY = (pageHeight - canvasHeight) / 2;

  doc.setFontSize(fontSize);
  doc.text(titleText, pageWidth / 2, 35, {
    align: 'center'
  });
  addFooters(doc);
  doc.addImage(image, 'JPEG', marginX, marginY, canvasWidth, canvasHeight);

  doc.save('download.pdf');
};

export const handleDownloadChecklistPDF = () => {
  // eslint-disable-next-line new-cap
  const doc = new JSPDF('p', 'pt', 'a4');

  const source = window.document.getElementById('checklist-wrapper');
  if (!source) return;

  doc.html(source, {
    callback: filledDoc => {
      addHeaderAndFootersPortrait(filledDoc);
      filledDoc.save();
    },
    x: (doc.internal.pageSize.width - 400) / 2,
    y: 0,
    image: { type: 'png', quality: 100 },
    margin: [70, 0, 70, 0],
    autoPaging: 'text',
    width: 400, // target width in the PDF document
    windowWidth: 650, // window width in CSS pixels
    html2canvas: {
      height: 400,
      windowHeight: 650,
      removeContainer: true
    }
  });
};
