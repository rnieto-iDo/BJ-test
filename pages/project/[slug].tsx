import SeoMetaData from '@/components/globals/SeoMetaData';
import {
  Button,
  Card,
  Input,
  Modal,
  SearchBar
} from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import emptyProduct from '../../assets/empty-state.svg';
import InteractiveBoard from '../../components/InteractiveBoard/InteractiveBoard';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  editProject,
  getSingleProject,
  getSingleProjectImages,
  getSingleProjectMaterials,
  getSingleProjectProducts,
  selectProjectsStatus,
  selectSingleProject,
  selectSingleProjectProducts
} from '../../store/reducers/projectsSlice';
import {
  getCurrentUser,
  selectCurrentUser
} from '../../store/reducers/userSlice';
import styles from '../../styles/pages/Project.module.scss';
import { getProjectsData } from '../../types/data.types';

const Project = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const projectId = router.query.slug as string;

  const currentUser = useAppSelector(selectCurrentUser);
  const selectedProject = useAppSelector(selectSingleProject);
  const selectedProjectProducts = useAppSelector(selectSingleProjectProducts);
  // const selectedProjectImages = useAppSelector(selectSingleProjectImages);
  // const selectedProjectMaterials = useAppSelector(selectSingleProjectMaterials);

  const inProgress = useAppSelector(selectProjectsStatus);

  const sortData = [
    { value: 'ASC', label: 'RECENT ASC' },
    { value: 'DESC', label: 'RECENT DESC' }
  ];

  const [showModal, setShowModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>(sortData[0]?.value);

  const [newProjectName, setNewProjectName] = useState<string>(
    selectedProject?.name
  );
  const [editProjectError, setEditProjectError] = useState<string>('');

  const projectDataVariables: getProjectsData = {
    filter: { project_id: { eq: projectId } },
    sort: {}
  };

  const singleProjectVariables: getProjectsData = {
    filter: { entity_id: { eq: projectId } },
    sort: {}
  };

  const parseImageUrl = (image: string) =>
    `${process.env.API_ENDPOINT}/media/catalog/product${image}`;

  const renderItems = (items: any[], isMaterial?: boolean) => {
    const sortCopy = items && [...items];

    const sortedArray =
      sortValue === 'ASC'
        ? items
        : sortCopy.sort((a, b) => {
            const date2 = new Date(a?.created_at);
            const date1 = new Date(b?.created_at);
            return +date1 - +date2;
          });

    return sortedArray?.map(({ product_attributes }: any) => (
      <Card
        title={product_attributes?.name}
        imageUrl={parseImageUrl(product_attributes?.image)}
        className={styles.SectionItem}
        onClick={() =>
          isMaterial
            ? router.push(`/materials/details/${product_attributes?.url_key}`)
            : router.push(`/products/details/${product_attributes?.url_key}`)
        }
      />
    ));
  };

  const searchItems = (items: any[], isMaterial?: boolean) => {
    const newItemArray = items?.filter(({ product_attributes }) =>
      product_attributes?.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    return renderItems(newItemArray, isMaterial);
  };

  const isEmpty = (data: any) => data?.items?.length === 0;

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(getSingleProject(singleProjectVariables));
    dispatch(getSingleProjectProducts(projectDataVariables));
    dispatch(getSingleProjectMaterials(projectDataVariables));
    dispatch(getSingleProjectImages(projectDataVariables));

    setNewProjectName(selectedProject?.name);
  }, [dispatch, projectId, selectedProject?.name]);

  const submit = () => {
    setEditProjectError('');
    dispatch(
      editProject({
        input: {
          name: newProjectName,
          entity_id: projectId
        },
        onSuccess: () => {
          dispatch(
            getSingleProject({
              filter: { entity_id: { eq: projectId } },
              sort: {}
            })
          );
          setShowModal(false);
        },
        onFailed: () =>
          setEditProjectError('Error occured while renaming project')
      })
    );
  };

  return (
    <>
      <SeoMetaData />
      <div className={styles.IndividualProject}>
        <Modal
          title="Rename project"
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditProjectError('');
          }}
        >
          <Input
            onChange={e => setNewProjectName(e.target.value)}
            value={newProjectName}
          />
          {!!editProjectError && (
            <div className={styles.EditProjectError}>{editProjectError}</div>
          )}
          <div className={styles.ModalBody}>
            <Button
              onClick={() => submit()}
              disabled={!newProjectName || inProgress === 'loading'}
              variant="filled"
              size="large"
            >
              Rename Project
            </Button>
          </div>
        </Modal>
        <BigImageTitleDescLinkBlock
          title={`Hi ${currentUser?.firstname}`}
          backgroundColor="#111827"
          textColor="#fff"
          size="medium"
        />
        <SearchBar
          className={styles.SearchBarConainer}
          searchBarValue={searchValue}
          selectDefaultValue={sortData[0].value}
          onSearchBarChange={text => setSearchValue(text)}
          selectOptions={sortData}
          onSelectChange={value => setSortValue(value)}
        />
        <div className={styles.ProjectTitleContainer}>
          <div className={styles.ProjectTitleAndButton}>
            <div className={styles.ProjectTitleText}>
              {selectedProject?.name}
            </div>
            <div
              role="presentation"
              className={styles.ProjectRenameLabel}
              onClick={() => setShowModal(true)}
            >
              Rename
            </div>
          </div>
        </div>
        <div className={styles.SectionTitleContainer}>
          <div className={styles.SectionTitleText}>Products</div>
          <div>
            {/* <Button
              className={styles.SectionButton}
              disabled={isEmpty(selectedProjectProducts)}
              variant="filled"
            >
              Add to Cart
            </Button> */}
          </div>
        </div>
        <div className={styles.SectionContent}>
          <div
            className={styles.SectionQuantity}
          >{`${selectedProjectProducts?.items?.length} items`}</div>
          {isEmpty(selectedProjectProducts) ? (
            <div className={styles.EmptyImage}>
              <Image src={emptyProduct.src} fill alt="no-image" />
            </div>
          ) : (
            <div className={styles.SectionContainer}>
              {!searchValue
                ? renderItems(selectedProjectProducts?.items)
                : searchItems(selectedProjectProducts?.items)}
            </div>
          )}
        </div>
        {/* <div className={styles.SectionTitleContainer}>
          <div className={styles.SectionTitleText}>Materials</div>
          <div>
            <Button
              className={styles.SectionButton}
              disabled={isEmpty(selectedProjectMaterials)}
              variant="filled"
              onClick={() => console.log('Add to Cart')}
            >
              Add to Cart
            </Button>
          </div>
        </div> */}
        {/* <div className={styles.SectionContent}>
          <div
            className={styles.SectionQuantity}
          >{`${selectedProjectMaterials?.items?.length} items`}</div>
          {isEmpty(selectedProjectMaterials) ? (
            <div className={styles.EmptyImage}>
              <Image src={emptyMaterial.src} fill alt="no-image" />
            </div>
          ) : (
            <div className={styles.SectionContainer}>
              {!searchValue
                ? renderItems(selectedProjectMaterials?.items, true)
                : searchItems(selectedProjectMaterials?.items, true)}
            </div>
          )}
        </div> */}
        {/* <div className={styles.SectionTitleContainer}>
          <div className={styles.SectionTitleText}>Images</div>
          <div>
            <Button
              className={styles.SectionButton}
              onClick={() => console.log('Upload Image')}
            >
              Upload Image
            </Button>
          </div>
        </div> */}
        {/* <div className={styles.SectionContent}>
          <div
            className={styles.SectionQuantity}
          >{`${selectedProjectImages?.items?.length} items`}</div>
          {isEmpty(selectedProjectImages) ? (
            <div className={styles.EmptyImage}>
              <Image src={emptyImage.src} fill alt="no-image" />
            </div>
          ) : (
            <div className={styles.SectionContainer}>
              {selectedProjectImages?.items?.map((item: any) => (
                <Card
                  title=""
                  imageUrl={parseImageUrl(item?.url)}
                  className={styles.SectionImage}
                />
              ))}
            </div>
          )}
        </div> */}
        <div className={styles.InteractiveBoardContainer}>
          <InteractiveBoard />
        </div>
      </div>
    </>
  );
};

export default Project;
