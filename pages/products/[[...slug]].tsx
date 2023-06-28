import {
  Breadcrumb,
  Card,
  HeadImage,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import HeroBlock from 'blocks/hero-block/HeroBlock';
import cs from 'classnames';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useCallback, useEffect, useMemo } from 'react';
import HubSpotScript from '../../components/globals/HubSpotScript';
import SeoMetaData from '../../components/globals/SeoMetaData';
import {
  EQUAL_OPERATOR,
  INDEX_PAGE_NUMBER,
  PRODUCT_CATEGORY_UID,
  REGULAR_PAGE_SIZE
} from '../../constants/api.consts';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import {
  getProductsPageContent,
  selectProductCMSData
} from '../../store/reducers/pageSlice';
import {
  getInfiniteProducts,
  getProducts,
  resetProductState,
  selectAdditionalDataInfo,
  selectProductsData
} from '../../store/reducers/productSlice';
import styles from '../../styles/pages/Products.module.scss';
import { getKey } from '../../utils';

const Products = () => {
  const router = useRouter();
  const { query, isReady } = router;
  const { slug } = query;
  const dispatch = useAppDispatch();
  const breadcrumbs = useBreadcrumbs();
  const cmsData = useAppSelector(selectProductCMSData);
  const productsData = useAppSelector(selectProductsData);
  const additionalDataInfo = useAppSelector(selectAdditionalDataInfo);
  const magentoUUID = useMemo(() => cmsData?.externalUUID ?? null, [cmsData]);
  const totalCount = useMemo(
    () => additionalDataInfo?.total_count ?? null,
    [additionalDataInfo]
  );
  const noMoreRecords = useMemo(
    () => totalCount <= productsData?.length ?? null,
    [totalCount, productsData]
  );
  const shouldLoadData = useMemo(
    () => !isReady || (slug && !magentoUUID),
    [isReady, slug, magentoUUID]
  );

  const loadPageContent = useCallback(() => {
    if (!slug) return;

    dispatch(getProductsPageContent(slug));
  }, [dispatch, slug]);

  const loadPageData = useCallback(
    (currentPage: number): any => {
      if (shouldLoadData) return null;
      const filters = {
        [PRODUCT_CATEGORY_UID]: { [EQUAL_OPERATOR]: magentoUUID }
      };
      const payload = {
        filter: filters,
        pageSize: REGULAR_PAGE_SIZE,
        currentPage
      };

      return dispatch(
        currentPage <= INDEX_PAGE_NUMBER
          ? getProducts(payload)
          : getInfiniteProducts(payload)
      );
    },

    [dispatch, magentoUUID, shouldLoadData]
  );

  useEffect(() => {
    loadPageContent();
  }, [loadPageContent]);

  const handleProductCardClick = (productSlug: string) => {
    if (productSlug) {
      router.push(`/products/details/${productSlug}`);
      dispatch(resetProductState());
    }
  };

  const { scrollableContentRef, isLoading } = useInfiniteScroll(
    loadPageData,
    noMoreRecords
  );

  return (
    <div className={styles.Products}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
      <Script
        key="hubspot-script-remote"
        id="hubspot-script-remote"
        strategy="beforeInteractive"
        src={process.env.HUBSPOT_FORMS_JS_URL}
      />
      <HubSpotScript formId={cmsData?.hubspotFormId} />

      <HeroBlock
        backgroundImageUrl={cmsData?.cover?.image}
        heroTitle={cmsData?.cover?.title}
        heroText={cmsData?.cover?.additionalText}
        textAlign="left"
        videoUrl={cmsData?.cover?.videoUrl ? cmsData?.cover?.videoUrl : ''}
        size="medium"
      />
      <div className="witt-container">
        <Breadcrumb items={breadcrumbs} />
        <div className={styles.HeaderWrapper}>
          <SectionHeader
            text={`${totalCount ?? 0} Products`}
            titleSize="small"
          />
          {/* <Button className={styles.SortFilterButton} variant="default">
                        FILTER & SORT
                    </Button> */}
        </div>
        <div ref={scrollableContentRef} className={styles.FeaturedProductsGrid}>
          {productsData?.map((product: any, index: number) => (
            <Card
              key={getKey(`product-${product.id}`)}
              imageUrl={product?.image?.url}
              title={product?.name}
              ImageElement={
                <div onClick={() => handleProductCardClick(product?.url_key)}>
                  <img src={product?.image?.url} alt="not-loaded" />
                </div>
              }
              className={cs(
                styles.GridItem,
                styles[`GridItem-Product-${index}`]
              )}
              onClick={() => handleProductCardClick(product?.url_key)}
            />
          )) ?? []}
          {cmsData?.catalogImages?.map((image: any, index: number) => (
            <Card
              key={getKey(`catalog-images-${image?.id}`)}
              imageUrl={image?.url}
              title=""
              className={cs(styles.GridItem, styles[`GridItem-Image-${index}`])}
            />
          )) ?? []}
        </div>

        {isLoading ? <h3 style={{ padding: '2rem' }}>...Loading</h3> : null}

        {cmsData?.exploreCollection ? (
          <HeadImage
            className={styles.ExploreCollection}
            backgroundImage={cmsData?.exploreCollection?.image}
            title={cmsData?.exploreCollection?.title}
            additionalText={
              <WittLink
                className={styles.ExploreCollectionLink}
                active
                href={cmsData?.exploreCollection?.link?.url ?? ''}
              >
                {cmsData?.exploreCollection?.link?.text}
              </WittLink>
            }
          />
        ) : null}
      </div>
    </div>
  );
};

export default Products;
