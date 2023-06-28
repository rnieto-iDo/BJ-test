import MoodboardConfiguratorControls from '@/components/InteractiveBoard/Moodboard/MoodboardConfiguratorControls/MoodboardConfiguratorControls';
import { getThreekitImageUrlForMoodboard } from 'api/routes/products';
import { useEffect, useRef, useState } from 'react';
import { setMoodboardItems } from 'store/reducers/moodBoardMenuSlice';
import { selectSingleProject } from 'store/reducers/projectsSlice';
import { generateServerSideImageLink } from 'utils';

import {
  arrowDownIcon,
  arrowUpIcon,
  deleteIcon,
  MOODBOARD_CANVAS_DIV_ID,
  MOODBOARD_CANVAS_HEIGHT,
  MOODBOARD_CANVAS_WIDTH,
  threeDotIcon,
  transparentRotateIcon
} from '../../../constants/fabric.constants';
import {
  createMoodboardCanvas,
  reWriteControlMoodboard,
  setCanvasEventListeners
} from '../../../helpers/moodboardHelpers/moodboardCanvas.helper';
import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';
import {
  selectMoodBoardCanvas,
  setMoodboardCanvas
} from '../../../store/reducers/moodboardCanvasSlice';
import MoodboardItemMenu from '../../InteractiveBoard/Moodboard/MoodboardItemMenu/MoodboardItemMenu';
import ProductConfigurator from '../../reusable/ProductConfigurator/ProductConfigurator';
import styles from './MoodboardCanvas.module.scss';

type Coordinates = { x: number | null; y: number | null };

const removeProp = (obj, propToDelete) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const property in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(property)) {
      if (typeof obj[property] === 'object') {
        removeProp(obj[property], propToDelete);
      } else if (property === propToDelete) {
        delete obj[property];
      }
    }
  }
};

const MoodboardCanvas = () => {
  const dispatch = useAppDispatch();
  const canvas = useAppSelector(selectMoodBoardCanvas);
  const selectedProject = useAppSelector(selectSingleProject);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isItemMenuDisplayed, setIsItemMenuDisplayed] =
    useState<boolean>(false);
  const [isMenuLoaded, setIsMenuLoaded] = useState<boolean>(false);
  const [currentItemTarget, setCurrentItemTarget] = useState<any>();
  const [coordinates, setCoordinates] = useState<Coordinates>({
    x: null,
    y: null
  });
  const [isConfiguratorOpen, setIsConfiguratorOpen] = useState(false);

  const handleThreeDotsClicked = (target: any) => {
    setIsItemMenuDisplayed(true);
    setCurrentItemTarget(target);
  };

  const handleGetClickCoordinate = e => {
    if (isMenuLoaded) return;
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoordinates({ x, y });
  };

  const handleConfiguratorDialogClose = () => setIsConfiguratorOpen(false);
  const capturePlayerSnapshoot = async () => {
    const { player }: { player: any } = window.threekit;
    const configurator = await player.getConfigurator();

    const currentVariant = await configurator.getFullConfiguration();
    removeProp(currentVariant, 'type');

    const newImage = generateServerSideImageLink(
      await getThreekitImageUrlForMoodboard(
        currentItemTarget?.data?.threekitConfig?.assetId,
        JSON.stringify(currentVariant)
      )
    );

    currentItemTarget.data = {
      ...currentItemTarget.data,
      productImage: newImage,
      threekitConfig: {
        ...currentItemTarget.data.threekitConfig,
        variant: currentVariant
      }
    };

    currentItemTarget.setSrc(newImage, () => {
      canvas.requestRenderAll();
      canvas.fire('object:modified', {
        target: currentItemTarget,
        type: 'productConfigured'
      });
    });

    handleConfiguratorDialogClose();
  };

  useEffect(() => {
    dispatch(
      setMoodboardCanvas(
        createMoodboardCanvas({
          id: MOODBOARD_CANVAS_DIV_ID,
          width: MOODBOARD_CANVAS_WIDTH,
          height: MOODBOARD_CANVAS_HEIGHT
        })
      )
    );
  }, [dispatch]);

  // Loading canvas data from Magento
  useEffect(() => {
    if (!canvas || !selectedProject) return;

    const json = selectedProject.moodboard_canvas_json;

    console.log(json);

    canvas?.loadFromJSON(json, () => {
      // making sure to render canvas at the end
      canvas.renderAll();

      const canvasItems = canvas.getObjects();

      const seletecCanvasItems = canvasItems.map(item => item.data);

      dispatch(setMoodboardItems(seletecCanvasItems));
    });
  }, [canvas, selectedProject, dispatch]);

  useEffect(() => {
    if (isConfiguratorOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isConfiguratorOpen]);

  useEffect(() => {
    if (canvas) setCanvasEventListeners(canvas);
  }, [canvas]);

  useEffect(() => {
    if (canvas) {
      const tempDeleteIcon: HTMLImageElement = document.createElement('img');
      tempDeleteIcon.src = deleteIcon;
      // const deleteImg = tempDeleteIcon;

      const arrowUpImg: HTMLImageElement = document.createElement('img');
      arrowUpImg.src = arrowUpIcon;

      const arrowDownImg: HTMLImageElement = document.createElement('img');
      arrowDownImg.src = arrowDownIcon;

      const rotateImg: HTMLImageElement = document.createElement('img');
      rotateImg.src = transparentRotateIcon;
      rotateImg.id = 'rotate';

      const threeDotImg: HTMLImageElement = document.createElement('img');
      threeDotImg.src = threeDotIcon;
      threeDotImg.id = 'rotate';

      reWriteControlMoodboard(
        tempDeleteIcon,
        arrowDownImg,
        arrowUpImg,
        rotateImg,
        {
          threeDotImage: threeDotImg,
          threeDotClickedHandler: handleThreeDotsClicked
        }
      );
    }
  }, [canvas]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      onClick={handleGetClickCoordinate}
      style={{ position: 'relative' }}
      className={styles.MoodboardCanvas}
    >
      <canvas id={MOODBOARD_CANVAS_DIV_ID} className="" ref={canvasRef} />
      {isItemMenuDisplayed ? (
        <MoodboardItemMenu
          target={currentItemTarget}
          setIsOpen={setIsItemMenuDisplayed}
          setTarget={setCurrentItemTarget}
          menuCoordinates={coordinates}
          setLoaded={setIsMenuLoaded}
          setIsConfiguratorOpen={setIsConfiguratorOpen}
        />
      ) : null}

      {isConfiguratorOpen ? (
        <div style={{ position: 'fixed', top: 0, left: 0, zIndex: 100 }}>
          <ProductConfigurator
            customClassName={styles.MoodboardProductConfigurator}
            assetId={currentItemTarget?.data?.threekitConfig?.assetId}
            controls={
              <MoodboardConfiguratorControls
                onCancelClicked={handleConfiguratorDialogClose}
                onDoneClicked={capturePlayerSnapshoot}
              />
            }
          />
        </div>
      ) : null}
    </div>
  );
};

export default MoodboardCanvas;
