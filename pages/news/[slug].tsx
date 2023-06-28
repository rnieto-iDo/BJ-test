import cs from 'classnames';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import {
  Card,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import SeoMetaData from '../../components/globals/SeoMetaData';
import { SanityImage } from '../../components/reusable/SanityImage/SanityImage';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getIndividualNewsContent,
  selectIndividualNewsCmsData,
  selectStatus
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/News.module.scss';
import { getKey, transformDateFormat } from '../../utils';
import Custom404 from '../404';

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

const IndividualNews = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectIndividualNewsCmsData);
  const cmsDataFetchStatus = useAppSelector(selectStatus);
  const { slug } = router.query;

  useEffect(() => {
    dispatch(getIndividualNewsContent(slug?.toString() ?? ''));
  }, [dispatch, slug]);

  const handleCardClick = (href: string) => {
    if (href) router.push(href);
  };

  if (cmsData === null && cmsDataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  return (
    <div className={cs(styles.News)}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.introExploreSection?.title}
        backgroundColor={cmsData?.introExploreSection?.backgroundColor}
        image={cmsData?.introExploreSection?.image}
        description={cmsData?.introExploreSection?.description}
        textColor="#fff"
        fullsizeImage
      />

      <div
        className={cs(
          styles.SubHeaderSectionNews,
          !cmsData?.pdfUrl ? 'NoDownloadUrl' : ''
        )}
      >
        <div className={cs(styles.DownloadSection)}>
          {cmsData?.pdfUrl && (
            <div className={cs(styles.ItemLink)}>
              <a href={cmsData?.pdfUrl?.url ?? ''}>Download PDF</a>
            </div>
          )}
        </div>
        <div className={cs(styles.DetailsSection)}>
          <div className={cs(styles.AuthorSection)}>
            {cmsData?.author && <p>Text by {cmsData?.author}</p>}
          </div>
          <div className={cs(styles.DateSection)}>
            {cmsData?.date && <p>{cmsData?.date}</p>}
          </div>
        </div>
      </div>

      <div className={cs(styles.SubtitleSectionNews)}>
        {cmsData?.subtitle && <p>{cmsData?.subtitle}</p>}
      </div>

      <div className={cs(styles.ContentContainer)}>
        {cmsData?.pageSections.map((section: any, index: number) => (
          <div className={styles.ContentItemContainer} key={getKey(index)}>
            <Card
              imageUrl=""
              className={styles.ContentCard}
              title={section?.imageTitle}
              description={section?.imageDescription}
              ImageElement={
                <div className={styles.ContentCardImage}>
                  {section?.image?.asset ? (
                    <SanityImage image={section?.image} />
                  ) : null}
                </div>
              }
              // onClick={() => handleClicked(item?.itemUrl ?? '#')}
            />
            {/* {section?.imageUrl && (
              <div className={styles.ContentItemImage}>
                <img src={section?.imageUrl} alt={section?.imageTitle} />
              </div>
            )}
            {(section?.imageTitle || section?.imageDescription) && (
              <div className={styles.ContentDetails}>
                <div className={styles.ContentImageTitle}>
                  <p>{section?.imageTitle}</p>
                </div>
                <div className={styles.ContentImageDescription}>
                  <p>{section?.imageDescription}</p>
                </div>
              </div>
            )} */}
            {section?.sectionTitle && (
              <div className={styles.ContentTitle}>
                <p>{section?.sectionTitle}</p>
              </div>
            )}
            {section?.sectionContent && (
              <div className={styles.ContentText}>
                <p>{section?.sectionContent}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {cmsData?.pdfUrl && (
        <div className={cs(styles.SubContentSectionNews)}>
          <div className={cs(styles.DownloadSection)}>
            {cmsData?.pdfUrl && (
              <div className={cs(styles.ItemLink)}>
                <a href={cmsData?.pdfUrl?.url ?? ''}>Download PDF</a>
              </div>
            )}
          </div>
        </div>
      )}

      <LineSeparatorBlock />

      <div className={cs('witt-container', styles.InTheNews)}>
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
            active
            href={cmsData?.inTheNews?.titleLink?.url ?? ''}
            className={styles.InTheNewsHeaderLink}
          >
            {cmsData?.inTheNews?.titleLink?.text}
          </WittLink>
        </div>
        <div className={styles.InTheNewsGrid}>
          {cmsData?.inTheNews?.news?.map((item: any) => (
            <Card
              key={getKey(item?.id)}
              title={item?.title || item?.name}
              description={item?.description}
              imageUrl={item.image}
              ImageElement={
                <div
                  className={cs(
                    styles.SanityImageWrapper,
                    'SanityImageWrapperLink'
                  )}
                  onClick={() => handleCardClick(item?.link?.url ?? '/#')}
                >
                  {item?.image?.asset ? (
                    <SanityImage image={item?.image} />
                  ) : null}
                </div>
              }
              isImageVertical
              date={transformDateFormat(item?.date)}
              className={cs(styles.CardGridItem, styles.InTheNewsGridItem)}
              onClick={() => handleCardClick(item?.link?.url ?? '/#')}
            />
          )) ?? null}
          <WittLink
            active
            href={cmsData?.inTheNews?.titleLink?.url ?? '/#'}
            className={styles.InTheNewsLink}
          >
            {cmsData?.inTheNews?.titleLink?.text}
          </WittLink>
        </div>
      </div>
    </div>
  );
};

export default IndividualNews;
