import {
  Card,
  DescriptiveSection,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import VideoBlock from 'blocks/video-block/VideoBlock';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { useRouter } from 'next/router';
import { FC, lazy, useEffect } from 'react';

import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import BigImageWithTitleDescLinkBottom from 'blocks/image-blocks/big-image-with-title-desc-link-bottom/BigImageWithTitleDescLinkBottom';
import EmptySeparatorBlock from 'blocks/separator-blocks/empty-separator-block/EmptySeparatorBlock';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import {
  getAboutUsPageContent,
  selectCMSData
} from '../store/reducers/pageSlice';

import SeoMetaData from '../components/globals/SeoMetaData';
import Timeline from '../components/reusable/Timeline/Timeline';
import styles from '../styles/pages/AboutUs.module.scss';
import { transformDateFormat } from '../utils';

const AboutUsPagePreview = lazy(
  () => import('../components/sanity-previews/AboutUsPagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type AboutUsProps = {
  pageProps: {
    preview: boolean;
  };
};

const AboutUs: FC<AboutUsProps> = ({ pageProps: { preview } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);

  const handleCardImageTitleClicked = (href: string) => {
    router.push(href);
  };

  useEffect(() => {
    dispatch(getAboutUsPageContent());
  }, [dispatch]);

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <AboutUsPagePreview
        handleCardImageTitleClicked={handleCardImageTitleClicked}
      />
    </PreviewSuspense>
  ) : (
    <div className={styles.AboutUs}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <div
        className={cs('full-width-element')}
        style={{ backgroundColor: '#111827' }}
      >
        <SectionHeader
          className={cs(styles.MainTitle)}
          text={cmsData?.mainTitle}
        />
        <div className={cs(styles.FirstHouseSectionWrapper)}>
          <Card
            className={styles.FirstHouseSection}
            imageUrl={cmsData?.firstHouseSection?.image}
            title={cmsData?.firstHouseSection?.title}
            description={cmsData?.firstHouseSection?.description}
            textLayout="horizontal"
          />
        </div>
        <div className={cs(styles.SecondHouseSectionWrapper)}>
          <Card
            className={cs(styles.HouseCard, styles.SecondHouseCard)}
            imageUrl={cmsData?.secondHouseSection?.houseCard?.image}
            title={cmsData?.secondHouseSection?.houseCard?.title}
            description={cmsData?.secondHouseSection?.houseCard?.description}
            textLayout="horizontal"
          />
          <div className={cs(styles.TextWrapper)}>
            <h2 className={styles.MainText}>
              {cmsData?.secondHouseSection?.mainText}
            </h2>
            <div className={cs(styles.SubTextWrapper)}>
              <p className={styles.FirstSubText}>
                {cmsData?.secondHouseSection?.firstSubSection}
              </p>
              <p className={styles.SecondSubText}>
                {cmsData?.secondHouseSection?.secondSubSection}
              </p>
            </div>
          </div>
        </div>
      </div>
      {cmsData?.videoSection && (
        <div className={styles.VideoSection}>
          <div className={styles.MediaWrapper}>
            <VideoBlock
              videoUrl={cmsData?.videoSection?.videoUrl}
              fallbackImageUrl={cmsData?.videoSection?.image}
              controls
              sound
              loop
            />
          </div>
          <p className={styles.MediaDescription}>
            {cmsData?.videoSection?.description}
          </p>
        </div>
      )}

      <BigImageTitleDescLinkBlock
        title={cmsData?.readMoreSection?.title}
        description={cmsData?.readMoreSection?.description}
        linkText={cmsData?.readMoreSection?.link?.text}
        linkUrl={cmsData?.readMoreSection?.link?.url}
        image={cmsData?.readMoreSection?.image}
        backgroundColor={cmsData?.readMoreSection?.backgroundColor}
        textColor="#fff"
        className={styles.ReadMoreSection}
      />

      <div className={cs(styles.DescriptiveSections)}>
        <DescriptiveSection
          className={cs(
            styles.DescriptiveSection,
            styles.FirstDescriptiveSection
          )}
          imageUrl={cmsData?.descriptiveSections?.firstSection?.image}
          title={cmsData?.descriptiveSections?.firstSection?.title}
          description={cmsData?.descriptiveSections?.firstSection?.description}
          layout={cmsData?.descriptiveSections?.firstSection?.layout}
          textPosition={
            cmsData?.descriptiveSections?.firstSection?.textPosition
          }
        />
        <DescriptiveSection
          className={cs(
            styles.DescriptiveSection,
            styles.SecondDescriptiveSection
          )}
          imageUrl={cmsData?.descriptiveSections?.secondSection?.image}
          title={cmsData?.descriptiveSections?.secondSection?.title}
          description={cmsData?.descriptiveSections?.secondSection?.description}
          layout={cmsData?.descriptiveSections?.secondSection?.layout}
          textPosition={
            cmsData?.descriptiveSections?.secondSection?.textPosition
          }
        />
      </div>

      <BigImageWithTitleDescLinkBottom
        title={cmsData?.warrantySection?.title}
        description={cmsData?.warrantySection?.description}
        link={{
          text: cmsData?.warrantySection?.link?.text,
          url: cmsData?.warrantySection?.link?.url
        }}
        image={cmsData?.warrantySection?.image}
      />
      <EmptySeparatorBlock />
      {cmsData?.showTimeline ? (
        <div className={styles.TimelineWrapper}>
          <Timeline />
        </div>
      ) : null}

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
              title={item?.title || item?.name}
              description={item?.description}
              imageUrl={item.image}
              date={transformDateFormat(item?.date)}
              className={cs(styles.CardGridItem)}
              onClick={() => handleCardImageTitleClicked(item.link.url)}
            />
          )) ?? null}
        </div>
      </div>
      <BigImageTitleDescLinkBlock
        title={cmsData?.exploreLocations?.title}
        linkText={cmsData?.exploreLocations?.link?.text}
        linkUrl={cmsData?.exploreLocations?.link?.url}
        image={cmsData?.exploreLocations?.image}
        backgroundColor={cmsData?.exploreLocations?.backgroundColor}
        size="medium"
        fullsizeImage
        textColor="#fff"
      />
    </div>
  );
};

export default AboutUs;
