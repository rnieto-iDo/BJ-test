import {
  Breadcrumb,
  Card,
  WittLink,
  SectionFootnote,
  SectionHeader
} from '@witt-team/athens-component-library';
import { useRouter } from 'next/router';
import React, { FC, lazy, useEffect } from 'react';
import { GetStaticPaths } from 'next';
import { PreviewSuspense } from 'next-sanity/preview';
import cs from 'classnames';

import HeroBlock from 'blocks/hero-block/HeroBlock';
import VideoBlock from 'blocks/video-block/VideoBlock';

import {
  getCategoryProducts,
  selectCategoryProducts
} from 'store/reducers/productSlice';
import FourImageWithTwoImageGrid from 'blocks/image-blocks/four-image-two-image-grid/FourImageTwoImageGrid';
import { CardType } from 'types/component.types';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import {
  getCollectionPageContent,
  selectIndividualCollectionsCmsData,
  selectStatus
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/Collection.module.scss';
import { SanityImage } from '../../components/reusable/SanityImage/SanityImage';
import SeoMetaData from '../../components/globals/SeoMetaData';
import Custom404 from '../404';

const CollectionPagePreview = lazy(
  () => import('../../components/sanity-previews/CollectionPagePreview')
);

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type CollectionProps = {
  pageProps: {
    preview: boolean;
  };
};

const LAYOUT_A = 'template-a'; //   large data
const LAYOUT_B = 'template-b'; //   medium data
const LAYOUT_C = 'template-c'; //   small data

const Collection: FC<CollectionProps> = ({ pageProps: { preview } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const breadcrumbs = useBreadcrumbs();
  const cmsData = useAppSelector(selectIndividualCollectionsCmsData);
  const cmsDataFetchStatus = useAppSelector(selectStatus);
  const productsList = useAppSelector(selectCategoryProducts);
  const { slug } = router.query;
  const categoryId = cmsData?.magentoCategoryId;

  useEffect(() => {
    dispatch(getCollectionPageContent(slug?.toString() ?? ''));
  }, [dispatch, slug]);

  useEffect(() => {
    if (categoryId) dispatch(getCategoryProducts(categoryId));
  }, [categoryId, dispatch]);

  if (cmsData === null && cmsDataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  const handleCardClick = (href: string) => {
    if (!href) {
      href = '#';
    }
    router.push(href);
  };

  const getLayout = value => {
    if (!value || value === LAYOUT_A) {
      return LAYOUT_A;
    }

    if (value === LAYOUT_B) {
      return LAYOUT_B;
    }
    return LAYOUT_C;
  };

  const formatArrayForBlock = (array: any) => {
    const newArray: CardType[] = array?.map(item => ({
      id: item?.id,
      title: item?.name,
      image: item?.image?.url,
      onClick: () => handleCardClick(`/products/details/${item?.url_key}`)
    }));

    return newArray;
  };

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <CollectionPagePreview slug={slug ?? ''} />
    </PreviewSuspense>
  ) : (
    <div className={cs(styles.Collection)}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <HeroBlock
        heroTitle={cmsData?.cover?.title}
        heroText={cmsData?.cover?.additionalText}
        heroTextUrl={cmsData?.additionalTextUrl}
        backgroundImageUrl={cmsData?.cover?.image}
        videoUrl={cmsData?.cover?.videoUrl}
        textAlign="left"
      />

      <div className={cs('witt-container')}>
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className={cs('witt-container', styles.MainTitle)}>
        <div className={styles.MainTitleText}>{cmsData?.mainTitle}</div>
        <SectionFootnote size="large" className={styles.MainTitleLink}>
          <WittLink active href={cmsData?.mainTitleLink?.url ?? ''}>
            {cmsData?.mainTitleLink?.text}
          </WittLink>
        </SectionFootnote>
      </div>

      <div className={styles.MainProduct}>
        <Card
          className={cs(styles.CardWithoutOverflow, styles.CardTextWithMargin)}
          imageUrl={cmsData?.mainProduct?.image}
          ImageElement={
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
            <div
              className={cs(styles.MainProductImage, 'SanityImageWrapperLink')}
              onClick={() => handleCardClick(cmsData?.mainProduct?.link?.url)}
            >
              {cmsData?.mainProduct?.image?.asset && (
                <SanityImage image={cmsData?.mainProduct?.image} />
              )}
            </div>
          }
          title={cmsData?.mainProduct?.title}
          description={cmsData?.mainProduct?.description}
          textLayout="horizontal"
          onClick={() => handleCardClick(cmsData?.mainProduct?.link?.url)}
        />
      </div>

      {getLayout(cmsData?.layout) === LAYOUT_A && (
        <>
          <div className="container-with-separator" />
          <div className="witt-container">
            <SectionHeader text={cmsData?.productStory?.title} />
          </div>

          <div className={styles.ProductStory}>
            {cmsData?.productStory?.productImages.map(
              (productImage: any, index: number) => (
                <Card
                  key={`product-story-${
                    productImage?.id || productImage?.image
                  }`}
                  className={cs(styles[`ProductImage-${index}`])}
                  imageUrl={productImage?.image}
                  ImageElement={
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      className={cs(
                        styles[`ProductStoryImage-${index}`],
                        'SanityImageWrapperLink'
                      )}
                      onClick={() => handleCardClick(productImage?.link?.url)}
                    >
                      {productImage?.image?.asset && (
                        <SanityImage image={productImage?.image} />
                      )}
                    </div>
                  }
                  title={productImage?.title ?? ''}
                  description={productImage?.description ?? ''}
                  textLayout="horizontal"
                  onClick={() => handleCardClick(productImage?.link?.url)}
                />
              )
            )}
          </div>

          <div className="witt-container">
            <div className={styles.TextSection}>
              <div className={cs(styles.GridItem_0, styles.LargeText)}>
                {cmsData?.productStory?.textSection?.largeText}
              </div>
              <div className={cs(styles.GridItem_1, styles.SmallTexts)}>
                <p className={styles.FirstParagraph}>
                  {cmsData?.productStory?.textSection?.firstParagraph}
                </p>
                <p className={styles.SecondParagraph}>
                  {cmsData?.productStory?.textSection?.secondParagraph}
                </p>
              </div>
              <div className={cs(styles.GridItem_2, styles.AdjecentSection)}>
                <Card
                  className={cs(styles.CardWithoutOverflow)}
                  imageUrl={
                    cmsData?.productStory?.adjecentSection?.bonusProduct?.image
                  }
                  ImageElement={
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                    <div
                      className={cs(
                        styles.BonusProductImage,
                        'SanityImageWrapperLink'
                      )}
                      onClick={() =>
                        handleCardClick(
                          cmsData?.productStory?.adjecentSection?.bonusProduct
                            ?.link?.url
                        )
                      }
                    >
                      {cmsData?.productStory?.adjecentSection?.bonusProduct
                        ?.image?.asset && (
                        <SanityImage
                          image={
                            cmsData?.productStory?.adjecentSection?.bonusProduct
                              ?.image
                          }
                        />
                      )}
                    </div>
                  }
                  title={
                    cmsData?.productStory?.adjecentSection?.bonusProduct?.title
                  }
                  description={
                    cmsData?.productStory?.adjecentSection?.bonusProduct
                      ?.description
                  }
                  textLayout="horizontal"
                  onClick={() =>
                    handleCardClick(
                      cmsData?.productStory?.adjecentSection?.bonusProduct?.link
                        ?.url
                    )
                  }
                />
              </div>
              <div
                className={cs(styles.GridItem_3, styles.AdjecentSectionText)}
              >
                <p className={styles.AdjecentSectionTextTitle}>
                  {cmsData?.productStory?.adjecentSection?.title}
                </p>
                <p className={styles.AdjecentSectionTextDescirption}>
                  {cmsData?.productStory?.adjecentSection?.description}
                </p>
              </div>
            </div>
          </div>

          {cmsData?.videoSection && (
            <div>
              <VideoBlock
                videoUrl={cmsData?.videoSection?.videoUrl}
                fallbackImageUrl={cmsData?.videoSection?.image}
                controls
                sound
                loop
              />
            </div>
          )}
        </>
      )}

      {getLayout(cmsData?.layout) === LAYOUT_B && (
        <>
          <div className="container-with-separator" />
          <div className={cs('witt-container', styles.FeaturedCollections)}>
            <SectionHeader text={cmsData?.featuredCollections?.title} />
            <Card
              className={styles.FeaturedCollectionMain}
              title={cmsData?.featuredCollections?.mainCollection?.title}
              description={
                cmsData?.featuredCollections?.mainCollection?.description
              }
              textLayout="horizontal"
              imageUrl={cmsData?.featuredCollections?.mainCollection?.image}
              onClick={() =>
                handleCardClick(
                  cmsData?.featuredCollections?.mainCollection.link?.url || '/#'
                )
              }
            />

            <div className={styles.OtherCollections}>
              {cmsData?.featuredCollections?.otherCollections.map(
                (collection: any, index: number) => (
                  <Card
                    key={`other-collections-${collection?.id}`}
                    className={cs(styles[`Collection-${index}`])}
                    title={collection?.title}
                    description={collection?.description}
                    textLayout="horizontal"
                    imageUrl={collection?.image}
                    onClick={() =>
                      handleCardClick(collection?.link?.url || '/#')
                    }
                  />
                )
              ) ?? []}
            </div>

            <SectionHeader
              className={cs(styles.FeaturedCollectionsFootnoteDescription)}
              text={cmsData?.featuredCollections?.description}
            />
            <SectionFootnote
              size="medium"
              className={styles.FeaturedCollectionsFootnoteLink}
            >
              <WittLink
                active
                href={cmsData?.featuredCollections?.footnoteLink?.url ?? ''}
              >
                {cmsData?.featuredCollections?.footnoteLink?.text}
              </WittLink>
            </SectionFootnote>
          </div>
        </>
      )}
      <div className="container-with-separator">
        <span />
      </div>
      <FourImageWithTwoImageGrid
        title="Featured Products"
        cardArray={formatArrayForBlock(productsList)}
      />

      <div className={cs('witt-container')}>
        <div
          className={cs('on-section-header', styles.AuthorSectionHeaderBlock)}
        >
          <div className="header-text large">
            {cmsData?.aboutDesigner?.title}
          </div>
        </div>
      </div>

      <div className={cs('witt-container', styles.AboutDesigner)}>
        <div className={styles.Column}>
          <div className={styles.AboutDesignerDescirptionWrapper}>
            <div
              className={cs('on-section-header', styles.AuthorSectionHeader)}
            >
              <div className="header-text large">
                {cmsData?.aboutDesigner?.title}
              </div>
            </div>
            <p className={styles.AboutDesignerText}>
              {cmsData?.aboutDesigner?.description}
            </p>
            <WittLink
              className={styles.AboutDesignerLink}
              active
              href={cmsData?.aboutDesigner?.link?.url ?? ''}
            >
              {cmsData?.aboutDesigner?.link?.text}
            </WittLink>
          </div>
        </div>
        <div className={styles.Column}>
          <Card
            className={cs(styles.CardWithoutOverflow)}
            imageUrl={cmsData?.aboutDesigner?.designer?.image}
            ImageElement={
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
              <div
                className={cs(
                  styles.AboutDesignerImage,
                  'SanityImageWrapperLink'
                )}
                onClick={() =>
                  handleCardClick(cmsData?.aboutDesigner?.designer?.link?.url)
                }
              >
                {cmsData?.aboutDesigner?.designer?.image?.asset && (
                  <SanityImage
                    image={cmsData?.aboutDesigner?.designer?.image}
                  />
                )}
              </div>
            }
            title={cmsData?.aboutDesigner?.designer?.title}
            description={cmsData?.aboutDesigner?.designer?.description}
            textLayout="horizontal"
            onClick={() =>
              handleCardClick(cmsData?.aboutDesigner?.designer?.link?.url)
            }
          />
        </div>
      </div>

      <div className="container-with-separator" />

      {cmsData?.exploreMore?.products?.length > 0 && (
        <div className={cs('witt-container')}>
          <SectionHeader text={cmsData?.exploreMore?.title} />
          <div className={cs(styles.ExploreMoreGrid)}>
            {cmsData?.exploreMore?.products?.map(
              (product: any, index: number) => (
                <Card
                  key={`explore-more-${product?.id}`}
                  className={cs(
                    styles.CardWithoutOverflow,
                    styles[`GridItem-${index}`]
                  )}
                  imageUrl={product?.image}
                  ImageElement={
                    <div
                      className={cs(
                        styles.ExploreMoreImage,
                        'SanityImageWrapperLink'
                      )}
                      onClick={() => handleCardClick(product?.link?.url)}
                    >
                      {product?.image?.asset && (
                        <SanityImage image={product?.image} />
                      )}
                    </div>
                  }
                  title={product?.title}
                  onClick={() => handleCardClick(product?.link?.url)}
                />
              )
            ) ?? []}
          </div>
        </div>
      )}
    </div>
  );
};

export default Collection;
