import React, { FC, lazy, useEffect } from 'react';
import {
  Button,
  Card,
  SectionHeader
} from '@witt-team/athens-component-library';
import { useRouter } from 'next/router';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { GetStaticPaths } from 'next';

import { SanityImage } from '@/components/reusable/SanityImage/SanityImage';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import FourImageBlock from 'blocks/image-blocks/four-image-row/FourImageBlock';
import { ItemProp } from 'blocks/image-blocks/four-image-row/FourImageBlock.types';

import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getIndividualLookbookPageContent,
  selectIndividualLookbookCmsData,
  selectStatus
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/IndividualLookbook.module.scss';
import Divider from '../../components/reusable/Divider/Divider';
import SeoMetaData from '../../components/globals/SeoMetaData';
import Custom404 from '../404';

const IndividualLookbookPagePreview = lazy(
  () => import('../../components/sanity-previews/IndividualLookbookPagePreview')
);

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

function prepareImageItem(collection: Array<any>, index: number): ItemProp {
  const item = {
    title: '',
    description: '',
    imageUrl: '',
    image: null,
    itemUrl: ''
  };

  if (collection && collection.length >= index) {
    const obj = collection[index];
    item.title = obj.title || obj.name;
    item.description = obj.description;
    item.image = obj.image?.asset ? obj.image : null;
    item.imageUrl = obj.image;
    item.itemUrl = obj.link?.url;
  }
  return item;
}

type IndividualLookbookProps = {
  pageProps: {
    preview: boolean;
  };
};

const IndividualLookbook: FC<IndividualLookbookProps> = ({
  pageProps: { preview }
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectIndividualLookbookCmsData);
  const cmsDataFetchStatus = useAppSelector(selectStatus);
  const { query } = router;
  const { slug } = query;

  const handleDownload = async (url: string) => {
    const response = await fetch(`${url}?dl=`);
    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = 'lookbook.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClicked = (href: string) => {
    if (!href) {
      href = '#';
    }
    router.push(href);
  };

  useEffect(() => {
    if (!slug) return;

    dispatch(getIndividualLookbookPageContent(slug));
  }, [dispatch, slug]);

  if (cmsData === null && cmsDataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <IndividualLookbookPagePreview
        handleDownload={handleDownload}
        slug={slug ?? ''}
      />
    </PreviewSuspense>
  ) : (
    <div className={cs(styles.IndividualLookbook, 'full-width-element')}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <div className={cs(styles.GreenBackgroundWrapper)}>
        <div className={styles.TopSection}>
          <h1 className={styles.LookbookName}>{cmsData?.lookbookName} </h1>
          <p className={styles.LookbookDescription}>
            {cmsData?.lookbookDescription}{' '}
          </p>
        </div>
        <Divider />
        <Button
          onClick={() => handleDownload(cmsData?.lookbookFileUrl)}
          className={styles.DownloadButton}
          variant="outlined"
        >
          Download PDF
        </Button>
        <h2 className={styles.MainTitle}>{cmsData?.mainTitle}</h2>
        <div className={styles.VideoSection}>
          {/* eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element */}
          <img
            className={styles.Media}
            src={cmsData?.videoSection?.videoUrl}
            alt="not-loaded"
          />
          <p className={styles.VideoDescription}>
            {cmsData?.videoSection?.description}
          </p>
        </div>
        <p className={styles.VideoText}>{cmsData?.videoSection?.text}</p>
        <div className={styles.SubSection}>
          <h2 className={styles.SubTitle}>{cmsData?.subSection?.title}</h2>
          <p className={styles.SubText}>{cmsData?.subSection?.text}</p>
        </div>
        <div className={styles.HighlightedProductsGrid}>
          {cmsData?.highlightedProducts?.map((item: any) => (
            <Card
              className={styles.HighLightedGridItem}
              imageUrl={item?.image ?? ''}
              ImageElement={
                <div className={styles.SanityImageWrapper}>
                  {item?.image?.asset ? (
                    <SanityImage image={item?.image} />
                  ) : null}
                </div>
              }
              title={item?.title}
              onClick={() => handleClicked(item?.link?.url)}
            />
          ))}
        </div>

        <Divider className={styles.LookbookSeparator} />
      </div>

      <div className={styles.ProductsSection}>
        <SectionHeader
          text={cmsData?.prodcutsSection?.title}
          className={cs(styles.SectionTitle, styles.Divider)}
        />
        <div className={styles.ProductsGrid}>
          {cmsData?.prodcutsSection?.products?.map((item: any) => (
            <Card
              className={styles.ProductGridItem}
              imageUrl={item?.image ?? ''}
              ImageElement={
                <div className={styles.SanityImageWrapper}>
                  {item?.image?.asset ? (
                    <SanityImage image={item?.image} />
                  ) : null}
                </div>
              }
              title={item?.title}
              onClick={() => handleClicked(item?.link?.url)}
            />
          ))}
        </div>
      </div>

      <LineSeparatorBlock />

      {cmsData?.exploreMore && (
        <FourImageBlock
          title={cmsData?.exploreMore?.title}
          firstItem={prepareImageItem(cmsData?.exploreMore?.items, 0)}
          secondItem={prepareImageItem(cmsData?.exploreMore?.items, 1)}
          thirdItem={prepareImageItem(cmsData?.exploreMore?.items, 2)}
          forthItem={prepareImageItem(cmsData?.exploreMore?.items, 3)}
        />
      )}
    </div>
  );
};

export default IndividualLookbook;
