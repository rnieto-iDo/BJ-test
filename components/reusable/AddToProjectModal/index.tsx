import { Button } from '@witt-team/athens-component-library';
import cs from 'classnames';
import { useAppDispatch, useAppSelector } from 'hooks/reduxOverwriteHooks';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import {
  addOrEditProductInProject,
  getProjects,
  selectAddedEditedProductProjectStatus,
  selectProjects,
  selectProjectsStatus
} from 'store/reducers/projectsSlice';
import Close from '../../../assets/close.svg';
import Dropdown from '../Dropdown';
import styles from './AddToProjectModal.module.scss';

type AddToProjectModalPropTypes = {
  visible: boolean;
  productsId: string[];
  onClose: () => void;
  onBackDropPress: () => void;
};

const AddToProjectModal: FC<AddToProjectModalPropTypes> = ({
  visible,
  productsId,
  onClose,
  onBackDropPress
}) => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const addingToProjectStatus = useAppSelector(
    selectAddedEditedProductProjectStatus
  );
  const projectsList = projects?.items;
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const errorMessage = 'Error occured while adding product to project';
  const arrayForDropdown = projectsList?.map(item => ({
    id: item?.entity_id,
    label: item?.name,
    value: item?.name
  }));
  const selecteProjectStatus = useAppSelector(selectProjectsStatus);

  useEffect(() => {
    dispatch(getProjects({ filter: {}, sort: { created_at: 'DESC' } }));
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    }
  }, [visible]);

  // eslint-disable-next-line no-return-assign
  const enableScroll = () => (document.body.style.overflow = 'unset');

  const handleAddToProject = () => {
    setError(false);
    const selectedProjectId = projectsList?.find(
      item => item?.name === selectedProject
    );

    dispatch(
      addOrEditProductInProject({
        input: {
          project_id: selectedProjectId?.entity_id,
          productsId
        },
        onFailed: () => setError(true),
        onSuccess: () => {
          enableScroll();
          onClose();
        }
      })
    );
  };

  // eslint-disable-next-line no-constant-condition
  return visible && selecteProjectStatus === 'succeeded' ? (
    <div className={styles.Main}>
      <div
        className={styles.Back}
        onClick={() => {
          enableScroll();
          onBackDropPress();
        }}
      />
      <div className={styles.Modal}>
        <div className={cs(styles.TopNavigation, 'witt-container')}>
          <p className={styles.Title}>Add to Project</p>
          <Image
            src={Close}
            alt="no-image"
            className={styles.Close}
            onClick={() => {
              enableScroll();
              onClose();
            }}
          />
        </div>
        <div className={styles.Body}>
          <Dropdown
            items={arrayForDropdown}
            selectedValue={selectedProject}
            onSelect={value => setSelectedProject(value)}
          />
          <div className={styles.ButtonsContainer}>
            <Button size="full-width">Create new Project</Button>
            <Button
              size="full-width"
              variant={!error ? 'filled' : 'error'}
              disabled={!selectedProject || addingToProjectStatus === 'loading'}
              className={styles.FirstButton}
              onClick={() => handleAddToProject()}
            >
              Add to project
            </Button>
          </div>
          {error && <div className={styles.ErrorMessage}>{errorMessage}</div>}
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

export default AddToProjectModal;
