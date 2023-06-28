import { MidPoint } from '../../interfaces/canvasInterfaces';

interface ZoomProps {
  // eslint-disable-next-line no-undef
  canvas: fabric.Canvas | undefined;
}

const Zoom = ({ canvas }: ZoomProps) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const point: MidPoint = { x: 450, y: 350 };
  const asignedZoom = (canvasProp: any, zoom: any) => {
    canvasProp?.zoomToPoint(point, zoom);
    canvasProp?.setZoom(zoom);
    canvasProp?.requestRenderAll();
  }
  const handleZoomIn = () => {
    if (canvas) {
      const createNewZoom = parseFloat((canvas.getZoom() + 0.1).toFixed(1));
      asignedZoom(canvas, createNewZoom);
    }
  };
  const handleZoomOut = () => {
    if (canvas && canvas.getZoom() - 0.1 > 0.1) {
      const createNewZoom = parseFloat((canvas.getZoom() - 0.1).toFixed(1));
      asignedZoom(canvas, createNewZoom);
    }
  };
  return (
    <div className="flex justify-center space-x-4">
      <button type="button" title="Zoom In" className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-200 rounded-full" onClick={handleZoomIn}>
        <svg xmlns="http://www.w3.org/2000/svg" height={20} viewBox="0 96 960 960" width={20}>
          <path d="M444 816V612H240v-72h204V336h72v204h204v72H516v204h-72Z" />
        </svg>
      </button>

      <button type="button" title="Zoom Out" className="flex items-center justify-center w-10 h-10 text-gray-600 bg-gray-200 rounded-full" onClick={handleZoomOut}>
        <svg xmlns="http://www.w3.org/2000/svg" height={20} viewBox="0 96 960 960" width={20}>
          <path d="M240 612v-72h480v72H240Z" />
        </svg>
      </button>
    </div>
  );
};

export default Zoom;