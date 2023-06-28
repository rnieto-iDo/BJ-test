import { Card, SectionHeader } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { useRouter } from 'next/router';
import { FC, lazy, useEffect } from 'react';
import SeoMetaData from '../../components/globals/SeoMetaData';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getAllLookBookPageContent,
  selectAllLookBooksCmsData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/LookBooks.module.scss';

const LookbooksPagePreview = lazy(
  () => import('../../components/sanity-previews/LookbooksPagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type LookbookProps = {
  pageProps: {
    preview: boolean;
  };
};

const Lookbooks: FC<LookbookProps> = ({ pageProps: { preview } }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectAllLookBooksCmsData);

  useEffect(() => {
    dispatch(getAllLookBookPageContent());
  }, [dispatch]);

  const handleCardClick = (href: string) => {
    if (href) router.push(href);
  };

  return preview ? (
    <PreviewSuspense fallback="...loading">
      <LookbooksPagePreview />
    </PreviewSuspense>
  ) : (
    <div className={styles.LookBooks}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.lookBookHeader?.title}
        description={cmsData?.lookBookHeader?.description}
        image={cmsData?.lookBookHeader?.image}
        backgroundColor="#36603C"
        textColor="#fff"
        fullsizeImage
      />
      <SectionHeader
        text={cmsData?.lookBookSection?.title}
        className={styles.SectionTitle}
      />
      <div className={styles.TitleCardContainer}>
        <Card
          className={styles.TitleCard}
          title={cmsData?.lookBookSection?.lookBook?.title}
          description={cmsData?.lookBookSection?.lookBook?.description}
          imageUrl={cmsData?.lookBookSection?.lookBook?.image}
          textLayout="horizontal"
          onClick={() =>
            handleCardClick(
              cmsData?.lookBookSection?.lookBook?.link?.url ?? '/#'
            )
          }
        />
      </div>
      <SectionHeader
        text={cmsData?.lookBookList?.title}
        className={styles.SectionTitle}
      />
      <div className={styles.GridContainer}>
        {cmsData?.lookBookList?.lookBooks?.map((item: any) => (
          <Card
            key={item?.id}
            title={item?.title}
            description={item?.description}
            imageUrl={item?.image}
            textLayout="horizontal"
            className={styles.GridItem}
            onClick={() => handleCardClick(item?.link?.url ?? '/#')}
          />
        ))}
      </div>
      <SectionHeader
        text={cmsData?.mixedContentList?.title}
        className={cs(styles.SectionTitle, styles.Divider)}
      />
      <div className={styles.MoreCollectionsGrid}>
        {cmsData?.mixedContentList?.mixedContent?.map((item: any) => (
          <Card
            key={item?.id}
            title={item?.title}
            imageUrl={item?.image}
            textLayout="horizontal"
            className={cs(styles.GridItem, styles.MoreCollectionsGridItem)}
            onClick={() => handleCardClick(item?.link?.url ?? '/#')}
          />
        ))}
      </div>
    </div>
  );
};

export default Lookbooks;
