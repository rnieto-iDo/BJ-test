import {
  Breadcrumb,
  Card,
  CardWithAccordion,
  SectionHeader
} from '@witt-team/athens-component-library';
import cs from 'classnames';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import SeoMetaData from '../../components/globals/SeoMetaData';
import {
  EQUAL_OPERATOR,
  INDEX_PAGE_NUMBER,
  MATERIAL_CATEGORY_UID,
  SMALL_PAGE_SIZE
} from '../../constants/api.consts';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import {
  clearMaterialsData,
  getInfiniteMaterials,
  getMaterialCategories,
  getMaterials,
  selectAllCategoriesProductTotalCount,
  selectMaterialCategoryData,
  selectMaterialsData,
  selectMaterialsTotalCount
} from '../../store/reducers/materialSlice';
import {
  getMaterialsPageContent,
  selectCMSData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/Materials.module.scss';
import HeroImage from '../../components/reusable/HeroImage/HeroImage';
import { getKey } from '../../utils';

const Materials = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);
  const [textileData, nonTextileData] = useAppSelector(
    selectMaterialCategoryData
  );
  const selectedMaterials = useAppSelector(selectMaterialsData);
  const materialsTotalCount = useAppSelector(selectMaterialsTotalCount);
  const allCategoriesProductTotalCount = useAppSelector(
    selectAllCategoriesProductTotalCount
  );
  const breadcrumbs = useBreadcrumbs();
  const noMoreRecords = useMemo(
    () => materialsTotalCount <= selectedMaterials?.length ?? null,
    [materialsTotalCount, selectedMaterials]
  );
  const [selectedCategoryUid, setSelectedCategoryUid] = useState<string | null>(
    null
  );

  const loadMaterials = useCallback(
    (currentPage: number) => {
      if (!selectedCategoryUid) return;
      const filters = {
        [MATERIAL_CATEGORY_UID]: {
          [EQUAL_OPERATOR]: selectedCategoryUid
        }
      };
      const payload = {
        filters,
        pageSize: SMALL_PAGE_SIZE,
        currentPage
      };

      dispatch(
        currentPage <= INDEX_PAGE_NUMBER
          ? getMaterials(payload)
          : getInfiniteMaterials(payload)
      );
    },
    [selectedCategoryUid, dispatch]
  );

  const { scrollableContentRef, isLoading, handlePageReset } =
    useInfiniteScroll(loadMaterials, noMoreRecords);

  const handleOnClick = (categoryUid: string) => {
    dispatch(clearMaterialsData());
    handlePageReset();
    setSelectedCategoryUid(prev => (prev === categoryUid ? null : categoryUid));
  };

  const handleOnMaterialClick = (url_key: string) => {
    router.push(`/materials/details/${url_key}`);
  };

  useEffect(() => {
    dispatch(getMaterialsPageContent());
  }, [dispatch]);

  useEffect(() => {
    const filters = {
      [MATERIAL_CATEGORY_UID]: { [EQUAL_OPERATOR]: 'ODAx' }
    };
    const payload = {
      filters
    };
    dispatch(getMaterialCategories(payload));
  }, [dispatch]);

  const accordionBodyElement = (
    <div ref={scrollableContentRef} className={styles.AccordionBodyElement}>
      {selectedMaterials?.map((material: any) => (
        <div
          key={getKey(material.uid)}
          onClick={() => handleOnMaterialClick(material?.url_key)}
        >
          <Card
            className={styles.GridItem}
            title={material?.name}
            imageUrl={material?.image?.url}
          />
        </div>
      )) ?? null}
      {isLoading ? <h3>...Loading</h3> : null}
    </div>
  );

  return (
    <div className={styles.Materials}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <HeroImage
        className={cs(styles.PageCover, 'full-width-element')}
        backgroundImage={cmsData?.pageCover?.image}
        title={cmsData?.pageCover?.title}
        additionalText={cmsData?.pageCover?.additionalText}
      />

      <div className={cs('witt-container')}>
        <Breadcrumb items={breadcrumbs} />
      </div>
      <div className={cs('witt-container', styles.HeaderWrapper)}>
        <SectionHeader
          text={`${allCategoriesProductTotalCount ?? 0} Products`}
          titleSize="small"
        />
      </div>
      <div
        className={cs('container-with-separator', styles.RemovableDivider)}
      />
      <SectionHeader
        className={cs('witt-container', styles.Subtitles)}
        text="Textiles"
      />
      {textileData?.children.map((child: any) => (
        <div key={getKey(child.uid)}>
          <CardWithAccordion
            className="witt-container"
            image={child.image}
            title={child.name}
            description={child?.meta_description}
            isOpen={selectedCategoryUid === child.uid}
            onClick={() => handleOnClick(child.uid)}
            bodyElement={accordionBodyElement}
          />
          <LineSeparatorBlock />
        </div>
      )) ?? null}
      <SectionHeader
        className={cs('witt-container', styles.Subtitles)}
        text="Non Textiles"
      />
      {nonTextileData?.children.map((child: any) => (
        <div key={getKey(child.uid)}>
          <CardWithAccordion
            className="witt-container"
            image={child.image}
            title={child.name}
            description={child?.meta_description}
            isOpen={selectedCategoryUid === child.uid}
            onClick={() => handleOnClick(child.uid)}
            bodyElement={accordionBodyElement}
          />
          <LineSeparatorBlock />
        </div>
      )) ?? null}
    </div>
  );
};

export default Materials;
