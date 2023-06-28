import cs from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Card, SectionHeader } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import { SanityImage } from '../../components/reusable/SanityImage/SanityImage';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getNewsroomPageContent,
  selectNewsroomCmsData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/Newsroom.module.scss';

import SeoMetaData from '../../components/globals/SeoMetaData';
import { getKey, transformDateFormat } from '../../utils';

const Newsroom = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectNewsroomCmsData);

  useEffect(() => {
    dispatch(getNewsroomPageContent());
  }, [dispatch]);

  const handleCardClick = (href: string) => {
    if (href) router.push(href);
  };

  return (
    <section className={styles.Newsroom}>
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
        textColor="#000000"
        fullsizeImage
        ratio="50-50"
      />

      <div className="container-with-separator" />
      <SectionHeader
        text={cmsData?.newsSectionTitle}
        className={styles.SectionTitle}
      />
      <div className={cs('witt-container', styles.MoreCollections)}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.moreCollections?.title}
        />
        <div className={styles.MoreCollectionsGrid}>
          {cmsData?.newsSection?.map((item: any, index: number) => (
            <Link href={item?.link?.url || '#'}>
              <Card
                key={getKey(index)}
                title={item?.title}
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
                textLayout="vertical"
                className={cs(styles.MoreCollectionsGridItem)}
                date={transformDateFormat(item.date)}
                onClick={() => handleCardClick(item?.link?.url ?? '/#')}
              />
            </Link>
          )) ?? null}
        </div>
      </div>

      <div
        className={cs('container-with-separator', styles.DividerSeparator)}
      />

      <div className={cs('witt-container')}>
        <SectionHeader
          text={cmsData?.exploreMore?.title}
          className={styles.SectionTitle}
        />
        <div className={cs(styles.ExploreMoreGrid)}>
          {cmsData?.exploreMore?.items?.map((product: any, index: number) => (
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
                  onClick={() => handleCardClick(product?.link?.url ?? '/#')}
                >
                  {product?.image?.asset && (
                    <SanityImage image={product?.image} />
                  )}
                </div>
              }
              title={product?.title}
              onClick={() => handleCardClick(product?.link?.url ?? '/#')}
            />
          )) ?? []}
        </div>
      </div>
    </section>
  );
};

export default Newsroom;
