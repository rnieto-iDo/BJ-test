import {
  Breadcrumb,
  SectionHeader,
  Card,
  SectionFootnote,
  WittLink
} from '@witt-team/athens-component-library';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { FC, lazy, useEffect } from 'react';
import Link from 'next/link';

import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';

import HeroBlock from 'blocks/hero-block/HeroBlock';

import DescriptiveSections from '../../components/reusable/DescriptiveSections/DescriptiveSections';
import Timeline from '../../components/reusable/Timeline/Timeline';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import useBreadcrumbs from '../../hooks/useBreadcrumbs';
import {
  getCollectionContent,
  selectCMSData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/Collections.module.scss';
import { SanityImage } from '../../components/reusable/SanityImage/SanityImage';
import { getKey } from '../../utils';
import SeoMetaData from '../../components/globals/SeoMetaData';

const CollectionsPagePreview = lazy(
  () => import('../../components/sanity-previews/CollectionsPagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type CollectionsProps = {
  pageProps: {
    preview: boolean;
  };
};

const Collections: FC<CollectionsProps> = ({ pageProps: { preview } }) => {
  const dispatch = useAppDispatch();
  const breadcrumbs = useBreadcrumbs();
  const cmsData = useAppSelector(selectCMSData);

  useEffect(() => {
    dispatch(getCollectionContent());
  }, [dispatch]);

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <CollectionsPagePreview />
    </PreviewSuspense>
  ) : (
    <div className={styles.Collections}>
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

      <Breadcrumb
        className={cs('witt-container', styles.BreadCrumbs)}
        items={breadcrumbs}
      />
      <SectionHeader
        className={cs('witt-container', styles.MainTitle)}
        text={cmsData?.title}
      />

      <div className="container-with-separator" />
      <DescriptiveSections descriptiveSections={cmsData?.descriptiveSections} />

      <div className={cs('witt-container', styles.MoreCollections)}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.moreCollections?.title}
        />

        <div className={styles.MoreCollectionsGrid}>
          {cmsData?.moreCollections?.collections?.map(
            (item: any, index: number) => (
              <Link href={item?.link?.url ?? '#'}>
                <Card
                  key={getKey(index)}
                  title={item?.title}
                  description={item?.description}
                  imageUrl={item.image}
                  ImageElement={
                    <div className={styles.SanityImageWrapper}>
                      {item?.image?.asset ? (
                        <SanityImage image={item?.image} />
                      ) : null}
                    </div>
                  }
                  isImageVertical
                  textLayout="vertical"
                  className={cs(styles.MoreCollectionsGridItem)}
                />
              </Link>
            )
          ) ?? null}
        </div>
      </div>
      <div className="container-with-separator" />
      <div className={cs('witt-container', styles.OurDesigners)}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.ourDesigners?.title}
        />
        <div className={styles.OurDesignersGrid}>
          {cmsData?.ourDesigners?.designers?.map((item: any, index: number) => (
            <Link key={getKey(index)} href={item?.link?.url ?? '#'}>
              <Card
                key={getKey(index)}
                title={item?.title || item?.name}
                description={item?.description}
                imageUrl={item.image}
                ImageElement={
                  <div className={styles.SanityImageWrapper}>
                    {item?.image?.asset ? (
                      <SanityImage image={item?.image} />
                    ) : null}
                  </div>
                }
                isImageVertical
                textLayout="vertical"
                className={cs(styles.CardGridItem)}
              />
            </Link>
          )) ?? null}
        </div>
        <SectionFootnote size="medium" className={styles.OurDesignersFootnote}>
          <WittLink
            className={styles.SectionLink}
            active
            href={cmsData?.ourDesigners?.footnoteLink?.url ?? '#'}
          >
            {cmsData?.ourDesigners?.footnoteLink?.text || 'Read More'}
          </WittLink>
        </SectionFootnote>
      </div>

      <EmptySeparatorBlock />

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreLocations?.title}
        description=""
        linkText={cmsData?.exploreLocations?.link?.text}
        linkUrl={cmsData?.exploreLocations?.link?.url ?? ''}
        image={cmsData?.exploreLocations?.image}
        backgroundColor={cmsData?.exploreLocations?.backgroundColor}
        textColor="#fff"
        fullsizeImage
        size="medium"
        ratio="55-45"
      />

      {cmsData?.showTimeline ? (
        <div className={cs('witt-container', styles.TimelineWrapper)}>
          <SectionHeader
            text="Explore More on Brown Jordan"
            className={styles.SectionHeader}
          />
          <Timeline />
        </div>
      ) : null}

      <div className="container-with-separator" />

      {cmsData?.mixedContent &&
        cmsData?.mixedContent?.showSection &&
        cmsData?.mixedContent?.content && (
          <div className={cs('witt-container', styles.MixedContent)}>
            <div className={styles.MixedContentGrid}>
              {cmsData?.mixedContent?.content?.map(
                (item: any, index: number) => (
                  <Link key={getKey(index)} href={item?.link?.url ?? '#'}>
                    <Card
                      key={getKey(index)}
                      title={item?.title || item?.name}
                      description={item?.description}
                      imageUrl={item.image}
                      ImageElement={
                        <div className={styles.SanityImageWrapper}>
                          {item?.image?.asset ? (
                            <SanityImage image={item?.image} />
                          ) : null}
                        </div>
                      }
                      isImageVertical
                      textLayout="vertical"
                      className={cs(styles.MixedContentGridItem)}
                    />
                  </Link>
                )
              ) ?? null}
            </div>
          </div>
        )}

      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreFirstProject?.title}
        description={cmsData?.exploreFirstProject?.description}
        linkText={cmsData?.exploreFirstProject?.link?.text}
        linkUrl={cmsData?.exploreFirstProject?.link?.url ?? ''}
        image={cmsData?.exploreFirstProject?.image}
        backgroundColor={cmsData?.exploreFirstProject?.backgroundColor}
        textColor="#fff"
      />
    </div>
  );
};

export default Collections;
