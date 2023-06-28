import {
  Breadcrumb,
  Card,
  SectionFootnote,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import cs from 'classnames';
import { GetStaticPaths } from 'next';
import { PreviewSuspense } from 'next-sanity/preview';
import { useRouter } from 'next/router';
import { FC, lazy, useEffect } from 'react';

import VideoBlock from 'blocks/video-block/VideoBlock';

import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import SeoMetaData from '../../components/globals/SeoMetaData';
import { SanityImage } from '../../components/reusable/SanityImage/SanityImage';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import {
  getDiscoverIndividualDesignerPageContent,
  selectIndividualDesignerCmsData,
  selectStatus
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/DiscoverIndividualDesigner.module.scss';
import { transformDateFormat } from '../../utils';
import Custom404 from '../404';

const IndividualDesignerPagePreview = lazy(
  () => import('../../components/sanity-previews/IndividualDesignerPagePreview')
);

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type IndividualDesignerProps = {
  pageProps: {
    preview: boolean;
  };
};

const Designer: FC<IndividualDesignerProps> = ({ pageProps: { preview } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const breadcrumbs = useBreadcrumbs([
    { index: 0, path: '/discover/our-designers' }
  ]);

  const cmsData = useAppSelector(selectIndividualDesignerCmsData);
  const cmsDataFetchStatus = useAppSelector(selectStatus);
  //  const cmsDataFetchError = useAppSelector(selectError);
  const { slug } = router.query;

  const handleCardImageTitleClicked = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    dispatch(getDiscoverIndividualDesignerPageContent(slug?.toString() ?? ''));
  }, [dispatch, slug]);

  if (cmsData === null && cmsDataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <IndividualDesignerPagePreview
        breadcrumbs={breadcrumbs}
        handleCardImageTitleClicked={handleCardImageTitleClicked}
        slug={slug ?? ''}
        transformDateFormat={transformDateFormat}
      />
    </PreviewSuspense>
  ) : (
    <div className={cs(styles.DiscoverIndividualDesigner)}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.title}
        description={cmsData?.description}
        image={cmsData?.headerImage}
        backgroundColor="#414040"
        textColor="#fff"
        fullsizeImage
      />

      <div className={cs('witt-container')}>
        <Breadcrumb items={breadcrumbs} />
      </div>

      <div className={cs('witt-container', styles.MainTitle)}>
        <div className={styles.MainTitleText}>{cmsData?.mainText}</div>
      </div>

      <div className={cs('witt-container', styles.ThreeColumnText)}>
        <div>&nbsp;</div>
        <div>{cmsData?.mainDescription?.col1}</div>
        <div>{cmsData?.mainDescription?.col2}</div>
      </div>

      <div className={styles.Animation}>
        <VideoBlock
          videoUrl={cmsData?.videoSection?.videoUrl}
          fallbackImageUrl={cmsData?.videoSection?.image}
          controls
          sound
          loop
        />

        <div className={cs('witt-container')}>
          <p>{cmsData?.videoSection?.description}</p>
        </div>
      </div>

      <div className={cs('container-with-separator')}>
        <div className={cs(styles.TextBelowAnimation)}>
          {cmsData?.textBelowAnimation}
        </div>
      </div>

      <div className={cs('container-with-separator')}>
        <SectionHeader text={cmsData?.featuredCollections?.title} />
        <div className={styles.FeaturedCollections}>
          {cmsData?.featuredCollections?.collections?.map(
            (collection: any, index: number) => (
              <Card
                key={`collection-${collection?.id || collection?.image}`}
                className={cs(styles[`Collection-${index}`])}
                imageUrl={collection?.image}
                title={collection?.title ?? ''}
                description={collection?.description ?? ''}
                textLayout="horizontal"
                onClick={() =>
                  handleCardImageTitleClicked(collection?.link?.url || '/#')
                }
              />
            )
          )}
        </div>

        <SectionFootnote size="medium" className={styles.OurDesignersFootnote}>
          <WittLink
            className={styles.Link}
            active
            href={cmsData?.featuredCollections?.link?.url ?? ''}
          >
            {cmsData?.featuredCollections?.link?.text}
          </WittLink>
        </SectionFootnote>
      </div>

      <div className={cs('witt-container')}>
        <SectionHeader text={cmsData?.moreCollections?.title} />
        <div className={cs(styles.MoreCollectionsGrid)}>
          {cmsData?.moreCollections?.collections.map(
            (collection: any, index: number) => (
              <Card
                key={`more-collections-${collection?.id}`}
                className={cs(
                  styles.CardWithoutOverflow,
                  styles[`GridItem-${index}`]
                )}
                imageUrl={collection?.image}
                title={collection?.title}
                description={collection?.description}
                ImageElement={
                  <div
                    className={cs(
                      styles.MoreCollectionsGridImage,
                      'SanityImageWrapperLink'
                    )}
                    onClick={() =>
                      handleCardImageTitleClicked(collection?.link?.url || '/#')
                    }
                  >
                    {collection?.image?.asset && (
                      <SanityImage image={collection?.image} />
                    )}
                  </div>
                }
                onClick={() =>
                  handleCardImageTitleClicked(collection?.link?.url || '/#')
                }
              />
            )
          ) ?? []}
        </div>
      </div>

      <div className={cs('witt-container', styles.TextBelowMoreCollections)}>
        <div className={styles.Text}>
          {cmsData?.textBelowMoreCollections?.text}
        </div>

        <WittLink
          className={styles.Link}
          active
          href={cmsData?.textBelowMoreCollections?.link?.url ?? ''}
        >
          {cmsData?.textBelowMoreCollections?.link?.text}
        </WittLink>
      </div>

      <div className={cs('container-with-separator')}>
        <div className={cs(styles.ExploreMoreGrid)}>
          {cmsData?.featuredProducts?.map((item: any, index: number) => (
            <Card
              key={`featured-products-${item?.id}`}
              className={cs(
                styles.CardWithoutOverflow,
                styles[`GridItem-${index}`]
              )}
              imageUrl={item?.image}
              ImageElement={
                <div
                  className={cs(
                    styles.ExploreMoreImage,
                    'SanityImageWrapperLink'
                  )}
                  onClick={() => handleCardImageTitleClicked(item?.link?.url)}
                >
                  <SanityImage image={item?.image} />
                </div>
              }
              title={item?.title}
            />
          )) ?? []}
        </div>
      </div>

      <div className={cs('container-with-separator', styles.OurDesigners)}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.ourDesigners?.title}
        />
        <div className={cs(styles.ExploreMoreGrid)}>
          {cmsData?.ourDesigners?.designers?.map((item: any, index: number) => (
            <Card
              key={`our-designers-${item?.id}`}
              className={cs(
                styles.CardWithoutOverflow,
                styles[`GridItem-${index}`]
              )}
              imageUrl={item?.image}
              ImageElement={
                <div
                  className={cs(
                    styles.ExploreMoreImage,
                    'SanityImageWrapperLink'
                  )}
                  onClick={() => handleCardImageTitleClicked(item?.link?.url)}
                >
                  {item?.image?.asset ? (
                    <SanityImage image={item?.image} />
                  ) : null}
                </div>
              }
              title={item?.name}
              onClick={() => handleCardImageTitleClicked(item?.link?.url)}
            />
          )) ?? []}
        </div>
      </div>

      <div className={cs('witt-container')}>
        <SectionHeader text={cmsData?.exploreMore?.title} />

        {cmsData?.exploreMore?.mixedContent &&
          cmsData?.exploreMore?.mixedContent?.showSection &&
          cmsData?.exploreMore?.mixedContent?.content && (
            <div className={cs(styles.ExploreMoreGrid)}>
              {cmsData?.exploreMore?.mixedContent?.content?.map(
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
                        onClick={() =>
                          handleCardImageTitleClicked(
                            product?.link?.url || '/#'
                          )
                        }
                      >
                        {product?.image?.asset && (
                          <SanityImage image={product?.image} />
                        )}
                      </div>
                    }
                    title={product?.title}
                    onClick={() =>
                      handleCardImageTitleClicked(product?.link?.url || '/#')
                    }
                  />
                )
              ) ?? []}
            </div>
          )}
      </div>

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreMore?.firstProject?.title}
        description={cmsData?.exploreMore?.firstProject?.description}
        image={cmsData?.exploreMore?.firstProject?.image}
        backgroundColor={cmsData?.exploreMore?.firstProject?.backgroundColor}
        textColor="#fff"
        fullsizeImage
        linkText={cmsData?.exploreMore?.firstProject?.link?.text}
        linkUrl={cmsData?.exploreMore?.firstProject?.link?.url}
      />

      <div className={cs(styles.InTheNews)}>
        <div
          className={cs(
            styles.SectionHeaderWithLink,
            styles.InTheNewsHeaderWrapper
          )}
        >
          <SectionHeader
            text={cmsData?.inTheNews?.title}
            className={styles.SectionHeader}
          />
          <WittLink
            className={styles.SectionheaderLink}
            active
            href={cmsData?.inTheNews?.titleLink?.url ?? ''}
          >
            {cmsData?.inTheNews?.titleLink?.text}
          </WittLink>
        </div>
        <div className={cs(styles.InTheNewsGrid)}>
          {cmsData?.inTheNews?.news.map((item: any) => (
            <Card
              key={`news-${item?.id}`}
              title={item?.title || item?.name}
              description={item?.description}
              imageUrl={item.image}
              date={transformDateFormat(item?.date)}
              className={cs(styles.CardGridItem, styles.CardWithoutOverflow)}
              onClick={() => handleCardImageTitleClicked(item.link.url)}
            />
          )) ?? null}
        </div>
      </div>

      <BigImageTitleDescLinkBlock
        title={cmsData?.showRoomSection?.text ?? ''}
        backgroundColor="#414040"
        textColor="#fff"
        linkText={cmsData?.exploreMore?.firstProject?.link?.text}
        linkUrl={cmsData?.exploreMore?.firstProject?.link?.url}
        size="medium"
      />
    </div>
  );
};

export default Designer;
