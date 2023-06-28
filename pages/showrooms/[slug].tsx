import {
  Card,
  ExploreSection,
  SectionHeader
} from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import SeoMetaData from '../../components/globals/SeoMetaData';
import Divider from '../../components/reusable/Divider/Divider';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getShowroomPageContent,
  selectShowroomCmsData,
  selectStatus
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/ShowroomDetails.module.scss';
import { getKey } from '../../utils';
import Custom404 from '../404';

const Showroom = () => {
  const {
    query: { slug }
  } = useRouter();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectShowroomCmsData);
  const cmsDataFetchStatus = useAppSelector(selectStatus);

  useEffect(() => {
    if (slug) {
      dispatch(getShowroomPageContent(slug.toString()));
    }
  }, [dispatch, slug]);

  const handleCardClick = (href: string) => {
    if (href) router.push(href);
  };

  if (cmsData === null && cmsDataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  return (
    <div>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.mainExploreSection?.title}
        backgroundColor={cmsData?.mainExploreSection.backgroundColor}
        description={cmsData?.mainExploreSection.description}
        image={cmsData?.mainExploreSection.image}
        textColor="#fff"
        fullsizeImage
      />

      <SectionHeader
        className={styles.ShowroomSubtitle}
        text={cmsData?.showroomSubtitle}
      />

      <div className={styles.InformationAndScheduleAppointmentWrapper}>
        <div className={styles.Left}>
          <p> {cmsData?.address}</p>
          <p> {cmsData?.contact}</p>
          <p> {cmsData?.telephone}</p>
        </div>
        <div className={styles.Right}>
          <Link href={cmsData?.scheduleAppointmentLinkUrl || ''}>
            {' '}
            Schedule Appointment{' '}
          </Link>
        </div>
      </div>

      <Card
        imageUrl={cmsData?.mainImageUrl}
        title=""
        description={cmsData?.mainImageDescription}
        className={styles.MainImageCard}
      />
      <Divider />

      <ExploreSection
        className={styles.FeaturedEventExploreSection}
        title={cmsData?.featuredEventExploreSection.title}
        link={{
          url: cmsData?.featuredEventExploreSection?.link?.url ?? '',
          text: cmsData?.featuredEventExploreSection?.link?.text ?? ''
        }}
        imageUrl={cmsData?.featuredEventExploreSection.imageUrl}
        descriptionTitle={cmsData?.featuredEventExploreSection.descriptionTitle}
        description={cmsData?.featuredEventExploreSection.description}
        backgroundColor="transparent"
      />
      <Divider />

      <div className={styles.FeaturedCornersDisplaysProductsSectionWrapper}>
        <p className={styles.title}>
          {' '}
          {cmsData?.featuredCornersDisplaysProductsSection.title}{' '}
        </p>
        <div className={styles.FeaturedCornersDisplaysProducts}>
          {cmsData?.featuredCornersDisplaysProductsSection.featuredImageObjectsArray.map(
            (
              imgObj: {
                id: string;
                imageUrl: string;
                title: string;
                subtitle: string;
                link: string;
              },
              index: number
            ) => (
              <Card
                key={imgObj.id}
                className={cs(
                  styles.FeaturedCornersDisplaysProductsGridItem,
                  styles[`FeaturedCornersDisplaysProduct-${index}`]
                )}
                imageUrl={imgObj.imageUrl}
                title={imgObj.title}
                description={imgObj.subtitle}
                onClick={() => handleCardClick(imgObj?.link ?? '#')}
              />
            )
          )}
        </div>
      </div>

      <BigImageTitleDescLinkBlock
        title={cmsData?.visitShowroomExploreSection.title}
        backgroundColor={cmsData?.visitShowroomExploreSection.backgroundColor}
        textColor="#fff"
        linkText={cmsData?.visitShowroomExploreSection.link.text}
        linkUrl={cmsData?.visitShowroomExploreSection.link.url}
        size="medium"
      />

      <div>
        <SectionHeader
          text={cmsData?.moreFeaturedShowroomsSection.title}
          className={styles.moreFeaturedShowroomsTitle}
        />
        <div className={cs(styles.MoreCollectionsGrid)}>
          {cmsData?.moreFeaturedShowroomsSection?.showroomsArray?.map(
            (showroom: any, index: number) => (
              <Card
                key={`more-featured-${getKey(index)}`}
                className={cs(styles.GridItem, styles.MoreCollectionsGridItem)}
                imageUrl={showroom?.imageUrl}
                description={showroom?.address}
                title={showroom?.title}
                textLayout="vertical"
                onClick={() => handleCardClick(showroom?.link ?? '/#')}
              />
            )
          ) ?? []}
        </div>
      </div>
    </div>
  );
};

export default Showroom;
