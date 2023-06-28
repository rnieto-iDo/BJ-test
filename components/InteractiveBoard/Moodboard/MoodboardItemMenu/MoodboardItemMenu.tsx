import { FC, useEffect, useRef } from 'react';
import { removeItemMoodboard } from 'store/reducers/moodBoardMenuSlice';
import { getProducts } from 'store/reducers/productSlice';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../hooks/reduxOverwriteHooks';
import { selectMoodBoardCanvas } from '../../../../store/reducers/moodboardCanvasSlice';

import styles from './MoodboardItemMenu.module.scss';

const HEIGHT_OFFSET = 20;

type MoodboardItemMenuProps = {
  menuCoordinates: {
    x: number | null;
    y: number | null;
  };
  target: any;
  setIsOpen: (value: boolean) => void;
  setTarget: (value: any) => void;
  setLoaded: (value: boolean) => void;
  setIsConfiguratorOpen: (value: boolean) => void;
};

const MoodboardItemMenu: FC<MoodboardItemMenuProps> = ({
  target,
  setIsOpen,
  setTarget,
  menuCoordinates,
  setLoaded,
  setIsConfiguratorOpen
}) => {
  const moodboardCanvas = useAppSelector(selectMoodBoardCanvas);
  const dispatch = useAppDispatch();
  const menuRef = useRef<any>(null);

  const handleTargetConfigre = () => {
    // target.setSrc(
    //   'https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg',
    //   () => {
    //     moodboardCanvas.requestRenderAll();
    //   }
    // );
    dispatch(
      getProducts({
        filter: {
          sku: {
            eq: target?.data?.sku
          }
        }
      })
    );
    setIsConfiguratorOpen(true);
    //  if (!target) return;
  };
  const handleTargetDelete = () => {
    if (!target) return;
    moodboardCanvas?.remove(target);
    moodboardCanvas?.requestRenderAll();
    dispatch(removeItemMoodboard(target.data));

    setIsOpen(false);
    // setTarget(null);
  };

  useEffect(() => {
    // only add the event listener when the dropdown is opened
    setTimeout(() => {
      const handleClick = event => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
          // setTarget(null);
        }
      };
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }, 50);
  }, [menuRef, setIsOpen, setTarget]);

  useEffect(() => {
    setLoaded(true);

    return () => setLoaded(false);
  }, [setLoaded]);

  return (
    <div
      ref={menuRef}
      className={styles.MoodboardItemMenu}
      style={{
        top: (menuCoordinates?.y ?? 0) + HEIGHT_OFFSET,
        left: menuCoordinates?.x ?? 0
      }}
    >
      {target.data.itemType === 'Product' ? (
        <button
          className={styles.MenuItem}
          type="button"
          onClick={handleTargetConfigre}
        >
          Configure
        </button>
      ) : null}
      <button
        className={styles.MenuItem}
        onClick={handleTargetDelete}
        type="button"
      >
        Delete
      </button>
    </div>
  );
};

export default MoodboardItemMenu;
