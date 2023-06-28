import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal, Input } from '@witt-team/athens-component-library';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import SeoMetaData from '@/components/globals/SeoMetaData';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import { getCurrentUser, selectCurrentUser } from 'store/reducers/userSlice';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';
import FourImageWithTwoImageGrid from 'blocks/image-blocks/four-image-two-image-grid/FourImageTwoImageGrid';
import newProject from '../assets/new-project.png';
import emptyProject from '../assets/empty-project.png';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import {
  createProject,
  getProjects,
  selectProjects
} from '../store/reducers/projectsSlice';
import styles from '../styles/pages/MyProjects.module.scss';

const MyProjects = () => {
  const intl = useIntl();
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [createProjectError, setCreateProjectError] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const loadedProjects = useAppSelector(selectProjects);
  const totalProjects = loadedProjects?.total_count;
  const projectsList = loadedProjects?.items;
  const currentUser = useAppSelector(selectCurrentUser);

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getProjects({ filter: {}, sort: { created_at: 'DESC' } }));
  }, [dispatch]);

  const createProjectModalTitleMsg = intl.formatMessage({
    id: 'my_projects.CREATE_PROJECT_MODAL_TITLE'
  });
  const createProjectModalButtonMsg = intl.formatMessage({
    id: 'my_projects.CREATE_PROJECT_MODAL_BUTTON'
  });
  const createProjectModalErrorMsg = intl.formatMessage({
    id: 'my_projects.CREATE_PROJECT_MODAL_ERROR'
  });

  const submit = async () => {
    setCreateProjectError(false);
    await dispatch(
      createProject({
        input: { name: projectName },
        onSuccess: () => setShowModal(false),
        onFailed: () => setCreateProjectError(true)
      })
    );
    setProjectName('');
  };

  const navigateToProject = (name: string) => {
    router.push(`/project/${name}`);
  };

  const formatDataForCardArray = (data: any) => {
    const projectAdd = {
      title: '',
      description: '',
      id: 'add-project',
      imageComponent: (
        <div
          className={styles.AddProjectImage}
          onClick={() => setShowModal(true)}
        >
          <Image src={newProject} alt="no-image" fill />
        </div>
      )
    };

    const array =
      data?.map(item => ({
        title: item?.name,
        description: '',
        id: item?.entity_id,
        imageComponent: (
          <div
            className={styles.ProjectImage}
            onClick={() => navigateToProject(item?.entity_id)}
          >
            <Image src={emptyProject} alt="no-image" fill />
          </div>
        ),
        onClick: () => navigateToProject(item?.entity_id)
      })) || [];

    return [projectAdd, ...array];
  };

  return (
    <div className={styles.MyProjects}>
      <SeoMetaData />
      <BigImageTitleDescLinkBlock
        title={`Hi ${currentUser?.firstname}`}
        backgroundColor="#111827"
        textColor="#fff"
        size="medium"
      />
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={createProjectModalTitleMsg}
      >
        <Input onChange={e => setProjectName(e.target.value)} />
        {createProjectError && (
          <div className={styles.CreateProjectModalError}>
            {createProjectModalErrorMsg}
          </div>
        )}
        <div className={styles.CreateProjectModalButtonContainer}>
          <Button
            className={styles.CreateProjectModalButton}
            onClick={() => submit()}
            disabled={!projectName}
          >
            <div>{createProjectModalButtonMsg}</div>
          </Button>
        </div>
      </Modal>
      <EmptySeparatorBlock />
      <FourImageWithTwoImageGrid
        title={`${totalProjects} Projects`}
        cardArray={formatDataForCardArray(projectsList)}
      />
    </div>
  );
};

export default MyProjects;
