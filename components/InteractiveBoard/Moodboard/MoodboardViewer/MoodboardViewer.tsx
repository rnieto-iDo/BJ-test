import { Button } from '@witt-team/athens-component-library';
import { useRouter } from 'next/router';
import {
  editProject,
  selectProjectsError,
  selectProjectsStatus,
  selectSingleProject
} from 'store/reducers/projectsSlice';
import { downloadMoodboardPdf } from '../../../../helpers/moodboardHelpers/moodboardCanvas.helper';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../hooks/reduxOverwriteHooks';
import { selectMoodBoardCanvas } from '../../../../store/reducers/moodboardCanvasSlice';
import MoodboardCanvas from '../../../canvas/MoodboardCanvas/MoodboardCanvas';
import styles from './MoodboardViewer.module.scss';

const MoodboardViewer = () => {
  const router = useRouter();
  const projectId = router.query.slug as string;
  const dispatch = useAppDispatch();
  const moodboardCanvas = useAppSelector(selectMoodBoardCanvas);
  const selectedProject = useAppSelector(selectSingleProject);
  const selectProjectStatus = useAppSelector(selectProjectsStatus);
  const selectProjectError = useAppSelector(selectProjectsError);

  const handleSaveClicked = () => {
    const jsonCavnas = JSON.stringify(moodboardCanvas.toJSON(['data']));

    dispatch(
      editProject({
        input: {
          entity_id: projectId,
          moodboard_canvas_json: jsonCavnas,
          name: selectedProject.name
        }
      })
    );
  };

  return (
    <div className={styles.MoodboardViewer}>
      <MoodboardCanvas />
      <Button
        className={styles.DownloadButton}
        variant="outlined"
        onClick={() => downloadMoodboardPdf(moodboardCanvas)}
      >
        Download PDF{' '}
      </Button>
      <Button
        className={styles.SaveMoodboardButton}
        variant="filled"
        onClick={handleSaveClicked}
      >
        {selectProjectStatus === 'loading' ? 'Saving...' : 'Save moodboard'}
      </Button>
      {selectProjectError ? (
        <p className={styles.ErrorMessage}>
          Error occured, please refresh page and try again.
        </p>
      ) : null}
    </div>
  );
};

export default MoodboardViewer;
