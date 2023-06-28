import {
  Breadcrumb,
  Card,
  SectionFootnote,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { useRouter } from 'next/router';
import { FC, lazy, useEffect } from 'react';

import HeroBlock from 'blocks/hero-block/HeroBlock';

import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import SeoMetaData from '../../components/globals/SeoMetaData';
import Timeline from '../../components/reusable/Timeline/Timeline';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import {
  getDiscoverDesignersPageContent,
  selectDesignersCmsData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/DiscoverDesigners.module.scss';

const DesignersPagePreview = lazy(
  () => import('../../components/sanity-previews/DesignersPagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type DesignersProps = {
  pageProps: {
    preview: boolean;
  };
};

const DiscoverDesigners: FC<DesignersProps> = ({ pageProps: { preview } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const breadcrumbs = useBreadcrumbs();
  const cmsData = useAppSelector(selectDesignersCmsData);

  useEffect(() => {
    dispatch(getDiscoverDesignersPageContent());
  }, [dispatch]);

  const handleClicked = (href: string) => {
    router.push(href);
  };

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      {' '}
      <DesignersPagePreview breadcrumbs={breadcrumbs} />
    </PreviewSuspense>
  ) : (
    <div className={styles.Discover}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <HeroBlock
        heroTitle={cmsData?.cover?.title}
        heroText={cmsData?.cover?.additionalText}
        backgroundImageUrl={cmsData?.cover?.image}
        videoUrl={cmsData?.cover?.videoUrl}
        textAlign="left"
      />

      <Breadcrumb className={cs('witt-container')} items={breadcrumbs} />
      <div className="container-with-separator">
        <div className={styles.MainTitle}>{cmsData?.description}</div>
      </div>

      <div className={cs('container-with-separator', styles.OurDesigners)}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.ourDesigners?.title}
        />

        <div className={styles.OurDesignersGrid}>
          {cmsData?.ourDesigners?.designers.map((item: any) => (
            <Card
              key={`our-designers-${item?.id}`}
              title={item?.title || item?.name}
              description={item?.description}
              imageUrl={item.image}
              isImageVertical
              textLayout="horizontal"
              className={cs(styles.CardGridItem)}
              onClick={() => handleClicked(item?.link?.url || '/#')}
            />
          )) ?? null}
        </div>
      </div>

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
            handleClicked(
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
                onClick={() => handleClicked(collection?.link?.url || '/#')}
              />
            )
          ) ?? []}
        </div>
      </div>

      <div className={cs('container-with-separator')}>
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

      {cmsData?.featuredProducts && cmsData?.featuredProducts?.products && (
        <div
          className={cs('container-with-separator', styles.FeaturedProducts)}
        >
          <SectionHeader text={cmsData?.featuredProducts?.title} />
          <div className={cs(styles.MixedContent)}>
            {cmsData?.featuredProducts?.products.map(
              (product: any, index: number) => (
                <Card
                  key={`featured-products-${product?.id}`}
                  className={cs(
                    styles.CardWithoutOverflow,
                    styles[`GridItem-${index}`]
                  )}
                  imageUrl={product?.image}
                  title={product?.title}
                  onClick={() => handleClicked(product?.link?.url || '/#')}
                />
              )
            ) ?? []}
          </div>
        </div>
      )}

      {cmsData?.showTimeline ? (
        <div className={cs('witt-container', styles.TimelineWrapper)}>
          <SectionHeader
            text={cmsData?.exploreMore?.title}
            className={styles.SectionHeader}
          />
          <Timeline />
        </div>
      ) : null}

      {cmsData?.exploreMore?.mixedContent &&
        cmsData?.exploreMore?.mixedContent?.showSection &&
        cmsData?.exploreMore?.mixedContent?.content && (
          <div className={cs('witt-container')}>
            <div className={cs(styles.MixedContent)}>
              {cmsData?.exploreMore?.mixedContent?.content.map(
                (product: any, index: number) => (
                  <Card
                    key={`mixed-content-${product.id}`}
                    className={cs(
                      styles.CardWithoutOverflow,
                      styles[`GridItem-${index}`]
                    )}
                    imageUrl={product?.image?.asset?.url}
                    title={product?.title}
                    onClick={() => handleClicked(product?.link?.url || '/#')}
                  />
                )
              ) ?? []}
            </div>
          </div>
        )}

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreMore?.firstProject?.title}
        linkText={cmsData?.exploreMore?.firstProject?.link?.text}
        linkUrl={cmsData?.exploreMore?.firstProject?.link?.url}
        backgroundColor={cmsData?.exploreMore?.firstProject?.backgroundColor}
        image={cmsData?.exploreMore?.firstProject?.image}
        description={cmsData?.exploreMore?.firstProject?.description}
        textColor="#fff"
      />
    </div>
  );
};

export default DiscoverDesigners;
