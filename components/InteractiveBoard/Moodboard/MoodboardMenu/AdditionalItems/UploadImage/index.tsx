import { Modal } from '@witt-team/athens-component-library';
import { useEffect, useRef, useState } from 'react';
import {
  getProjectSanityGallery,
  selectProjectGallery
} from 'store/reducers/pageSlice';
import { addMoodboardCanvasImage } from '../../../../../../helpers/moodboardHelpers/moodboardCanvas.helper';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../../../hooks/reduxOverwriteHooks';
import { selectMoodBoardCanvas } from '../../../../../../store/reducers/moodboardCanvasSlice';
import {
  addEditProjectMoodboard,
  getProjectMoodboard,
  selectSingleProject
} from '../../../../../../store/reducers/projectsSlice';
import { AddEditProjectMoodboardData } from '../../../../../../types/data.types';
import GalleryDialog from './GalleryDialog/GalleryDialog';
import styles from './UploadImage.module.scss';

const UploadImage = () => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(false);
  const moodboardCanvas = useAppSelector(selectMoodBoardCanvas);
  const selectedSingleProject = useAppSelector(selectSingleProject);
  const selectedGalleryImagaes = useAppSelector(selectProjectGallery);

  const handleToggleGalleryDialog = () => setIsGalleryOpen(prev => !prev);

  const handleGalleryImageSelected = (image: any) => {
    if (!image) return;

    addMoodboardCanvasImage(
      0,
      image.id,
      image?.asset?.url,
      0,
      50,
      moodboardCanvas,
      'Image'
    );

    handleToggleGalleryDialog();
  };

  useEffect(() => {
    dispatch(
      getProjectMoodboard({
        filter: { project_id: { eq: selectedSingleProject?.entity_id } },
        sort: {}
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getProjectSanityGallery());
  }, [dispatch]);

  return (
    <div className={styles.UploadImage}>
      <Modal
        isOpen={isGalleryOpen}
        onClose={handleToggleGalleryDialog}
        title="Gallery"
      >
        <GalleryDialog
          onImageClicked={handleGalleryImageSelected}
          images={selectedGalleryImagaes?.images}
        />
      </Modal>
      {/* {loadImages()} */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        onClick={() => {
          inputRef?.current?.click();
          setError(false);
        }}
        className={styles.UploadButtton}
      >
        Upload Image
      </div>
      <div
        style={{ marginTop: '1rem' }}
        onClick={handleToggleGalleryDialog}
        className={styles.UploadButtton}
      >
        Select From Gallery
      </div>
      <input
        type="file"
        className={styles.Input}
        ref={inputRef}
        onChange={e => {
          e.preventDefault();
          if (e?.target?.files) {
            const image = e?.target?.files[0];
            if (moodboardCanvas)
              addMoodboardCanvasImage(
                0,
                image?.name,
                URL.createObjectURL(image),
                0,
                50,
                moodboardCanvas,
                'Image'
              );

            const imageData = JSON.stringify({
              alt: 'no-image',
              imageUrl: URL.createObjectURL(image)
            });
            const data: AddEditProjectMoodboardData = {
              input: {
                project_id: selectedSingleProject?.entity_id,
                object_type: 'PROJECT_IMAGE',
                object_id: '1',
                object_attributes: imageData
              },
              onFailed: () => setError(true)
            };
            dispatch(addEditProjectMoodboard(data));
          }
        }}
      />
      {error && (
        <div className={styles.ErrorMessageContainer}>
          Sorry your file was too large. We only accept file size XXmb.
        </div>
      )}
      <div className={styles.MessageContainer}>
        Images wider than lorem ipsum work best.
        <br />
        The maximum size per file is Xmb.
      </div>
    </div>
  );
};

export default UploadImage;
