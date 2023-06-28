/* eslint-disable radix */
import { useDispatch, useSelector } from 'react-redux';
import { DragEvent, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { setRebuilt } from 'store/reducers/savedProjectSlice';
import { RootState } from '../../types/redux.types';
// custom import
import {
  clearLineDimensions,
  createFloor,
  reBuildRoom,
  resizeFloor
} from '../../helpers/fabricHelper';
import {
  canvasListenersDetected,
  createCanvas,
  reWriteControl
} from '../../helpers/canvasHelper';
import {
  CANVAS_DIV_ID,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  deleteIcon,
  editIcon,
  rotateIcon
} from '../../constants/fabric.constants';
import {
  setItems,
  deleteItemById,
  setIsProductSelected,
  setProductSelectedId,
  updateSelectedItems,
  updatePositionItemById,
  setRoomSize,
  updateSelectedFilterItemByIndex
} from '../../store/reducers/selectedItemsSlice';
import { setTakeScreenShot } from '../../store/reducers/canvasSlice';
import Zoom from '../zoom/Zoom';
import { deleteSceneElements } from '../../helpers/threekitHelper';
import { IProductExtended } from '../../interfaces/productInterfaces';
import { SizeRoom } from '../../interfaces/canvasInterfaces';
import { setDimensions } from '../../store/reducers/setDimensionsSlice';

const Canvas = () => {
  // UseState Sections
  const [canvas, setCanvas] = useState<fabric.Canvas>();
  const [canvasLoaded, setCanvasLoaded] = useState<boolean>(false); // State to identify if Canvas fabricjs loaded
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const dimensionsState = useSelector(
    (state: RootState) => state.setDimensions
  );
  const canvasState = useSelector((state: RootState) => state.canvas);
  const savedProjectState = useSelector(
    (state: RootState) => state.savedProject
  );
  const initCanvas = (): fabric.Canvas =>
    createCanvas({
      id: CANVAS_DIV_ID,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT
    });

  const addProductRedux = (product: IProductExtended) => {
    if (product.isMagento && !product.is2DView) {
      dispatch(updateSelectedFilterItemByIndex(product));
    } else {
      dispatch(setItems(product));
    }
  };

  const deleteProductRedux = (idProduct: string, transform: fabric.Object) => {
    deleteSceneElements(transform.data.generatedId);
    dispatch(deleteItemById(idProduct));
  };

  const updatePositionProductRedux = (
    idProduct: string,
    offsetX: number,
    offsetY: number,
    angle: number
  ) => {
    dispatch(updatePositionItemById({ idProduct, offsetX, offsetY, angle }));
  };

  const addRoomSizeRedux = (size: SizeRoom) => {
    dispatch(setRoomSize(size));
  };

  const editObject = (eventData: MouseEvent, transform: fabric.Transform) => {
    const { target } = transform;
    dispatch(setIsProductSelected(true));
    dispatch(setProductSelectedId(target.data.IdFabric));
    return true;
  };

  const hideSidebar = () => {
    dispatch(setIsProductSelected(false));
    dispatch(setProductSelectedId(null));
  };

  const addRebuildRoom = (itemsCopy: Array<IProductExtended>) => {
    const w = Number.isNaN(
      parseInt(JSON.parse(savedProjectState.dimensions).large)
    )
      ? 15
      : parseInt(JSON.parse(savedProjectState.dimensions).large);
    const l = Number.isNaN(
      parseInt(JSON.parse(savedProjectState.dimensions).deep)
    )
      ? 15
      : parseInt(JSON.parse(savedProjectState.dimensions).deep);
    // alert(parseInt());
    // alert(parseInt(JSON.parse(savedProjectState.dimensions).deep));

    dispatch(
      setDimensions({
        width: w,
        length: l,
        unitMeasure: 'feet'
      })
    );
    dispatch(updateSelectedItems(itemsCopy));
    dispatch(setRebuilt(true));
  };

  // UseEffect Sections

  // Get to TakeScreenShot
  useEffect(() => {
    if (canvas && canvasState.takeScreenShot) {
      localStorage.setItem('snapshot', canvas.toDataURL());
      dispatch(setTakeScreenShot(false));
    }
  }, [canvasState.takeScreenShot, canvas]);

  // Resize floor
  useEffect(() => {
    if (canvas) {
      clearLineDimensions(canvas);
      resizeFloor(
        dimensionsState.width,
        dimensionsState.length,
        canvas,
        dimensionsState.unitMeasure.toString(),
        addRoomSizeRedux
      );
    }
  }, [dimensionsState]);

  // Canvas ready to use
  useEffect(() => {
    if (canvasLoaded) {
      if (savedProjectState.configuration.length === 0) {
        createFloor(
          dimensionsState.width,
          dimensionsState.length,
          canvas!,
          addRoomSizeRedux,
          dimensionsState.unitMeasure
        );
      } else {
        reBuildRoom(
          JSON.parse(savedProjectState.dimensions),
          JSON.parse(savedProjectState.configuration),
          canvas,
          addRebuildRoom,
          addRoomSizeRedux,
          dimensionsState.unitMeasure
        );
      }
      canvasListenersDetected(
        canvas!,
        addProductRedux,
        deleteProductRedux,
        hideSidebar,
        updatePositionProductRedux
      );
    }
  }, [canvasLoaded]);

  // If canvas create set loaded true
  useEffect(() => {
    if (canvas) {
      setCanvasLoaded(true); // Set canvas loaded
      const canvas1: HTMLElement | null =
        document.getElementById('canvasPlanner');
      if (canvas1 instanceof HTMLCanvasElement) {
        const ctx: CanvasRenderingContext2D | null = canvas1.getContext('2d');
        if (ctx) {
          const tempDeleteIcon: HTMLImageElement =
            document.createElement('img');
          tempDeleteIcon.src = deleteIcon;
          const deleteImg = tempDeleteIcon;

          const tempEditIcon: HTMLImageElement = document.createElement('img');
          tempEditIcon.src = editIcon;
          tempEditIcon.id = 'clone';
          const editImg = tempEditIcon;

          const temprotateImg: HTMLImageElement = document.createElement('img');
          temprotateImg.src = rotateIcon;
          temprotateImg.id = 'rotate';
          const rotateImg = temprotateImg;
          reWriteControl(
            ctx,
            CANVAS_DIV_ID,
            deleteImg,
            editImg,
            rotateImg,
            editObject
          );
        }
      }
    }
  }, [canvas]);

  useEffect(() => {
    // Function to create instance canvas fabricJS
    setCanvas(initCanvas);
  }, []);

  function handleDragOver(event: DragEvent<HTMLCanvasElement>) {
    event.preventDefault();
  }

  return (
    <>
      <canvas
        id={CANVAS_DIV_ID}
        className=""
        ref={canvasRef}
        onDragOver={handleDragOver}
      />
      <Zoom canvas={canvas} />
    </>
  );
};

export default Canvas;
