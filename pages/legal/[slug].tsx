import cs from 'classnames';
import { GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import SeoMetaData from '../../components/globals/SeoMetaData';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getLegalPageTypeContent,
  selectLegalCmsData,
  selectStatus
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/Legal.module.scss';
import { getKey } from '../../utils';
import Custom404 from '../404';

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => ({
  paths: [],
  fallback: 'blocking'
});

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

const IndividualLegal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectLegalCmsData);
  const cmsDataFetchStatus = useAppSelector(selectStatus);
  const { slug } = router.query;

  useEffect(() => {
    dispatch(getLegalPageTypeContent(slug?.toString() ?? ''));
  }, [dispatch, slug]);

  if (cmsData === null && cmsDataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  return (
    <div className={cs(styles.Legal)}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />

      <BigImageTitleDescLinkBlock
        title={cmsData?.title ?? ''}
        description={cmsData?.description ?? ''}
        backgroundColor={cmsData?.backgroundColor ?? '#fff'}
        size="medium"
      />

      <div className={cs('content-section')}>
        {cmsData?.pageSections.map((section: any, index: number) => (
          <div className={styles.ItemContainer} key={getKey(index)}>
            <div className={styles.ItemElement}>
              <div className={styles.ItemTitle}>
                <p>{section?.showTitle ? section?.sectionTitle : ''}</p>
              </div>
              <div className={styles.ItemContent}>
                <p>{section?.sectionContent}</p>
                {section?.link ? (
                  <div className={styles.ItemLink}>
                    <a href={section?.link?.url}>{section?.link?.text}</a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )) ?? []}
      </div>
    </div>
  );
};

export default IndividualLegal;
