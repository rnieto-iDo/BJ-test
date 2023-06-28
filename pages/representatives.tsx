import { SearchBar, SectionHeader } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { FC, lazy, useEffect, useState } from 'react';
import SeoMetaData from '../components/globals/SeoMetaData';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import {
  getRepresentativesPageContent,
  selectCMSData
} from '../store/reducers/pageSlice';
import styles from '../styles/pages/Representatives.module.scss';

const RepresentativesPagePreview = lazy(
  () => import('../components/sanity-previews/RepresentativesPagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type RepresentativesProps = {
  pageProps: {
    preview: boolean;
  };
};

const Representatives: FC<RepresentativesProps> = ({
  pageProps: { preview }
}) => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');

  useEffect(() => {
    dispatch(getRepresentativesPageContent());
  }, [dispatch]);

  const doFilter = (item: any) => {
    const search = searchValue?.toLowerCase();
    if (
      search === '' ||
      item?.location?.toLowerCase().includes(search) ||
      item?.name?.toLowerCase().includes(search) ||
      item?.description?.toLowerCase().includes(search) ||
      item?.mail?.toLowerCase().includes(search)
    ) {
      return item;
    }
    return false;
  };

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <RepresentativesPagePreview
        doFilter={doFilter}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSortValue={setSortValue}
        sortValue={sortValue}
      />
    </PreviewSuspense>
  ) : (
    <div className={styles.Representatives}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <BigImageTitleDescLinkBlock
        title={cmsData?.title}
        backgroundColor="#80472e"
        description={cmsData?.description}
        textColor="#fff"
        size="medium"
      />
      <SearchBar
        className={cs('witt-container', styles.SearchBarContainer)}
        searchBarValue={searchValue}
        selectDefaultValue={sortValue}
        onSearchBarChange={text => setSearchValue(text)}
        selectOptions={[]}
        onSelectChange={value => setSortValue(value)}
      />
      <div className={cs('witt-container', styles.RepresentativesContainer)}>
        <SectionHeader text="United States" />
        {cmsData?.representatives?.us.filter(doFilter).map((item: any) => (
          <div key={item?.id} className={styles.Representative}>
            <div className={styles.Location}>{item?.location}</div>
            <div className={styles.Info}>
              <p className={styles.Name}>{item?.name}</p>
              <p className={styles.Description}>{item?.description}</p>
            </div>
            <div className={styles.Contact}>
              {item?.phone ? <p> P: {item?.phone} </p> : null}

              {item?.fax ? <p> F: {item?.fax} </p> : null}

              {item?.mail ? (
                <a href={`mailto: ${item?.mail}`}>{item?.mail}</a>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div
        className={cs(
          'witt-container',
          styles.RepresentativesContainer,
          styles.RepresentativesContainerIntenational
        )}
      >
        <SectionHeader text="International" />
        {cmsData?.representatives?.international
          .filter(doFilter)
          .map((item: any) => (
            <div key={item?.id} className={styles.Representative}>
              <div className={styles.Location}>{item?.location}</div>
              <div className={styles.Info}>
                <p className={styles.Name}>{item?.name}</p>
                <p className={styles.Description}>{item?.description}</p>
              </div>
              <div className={styles.Contact}>
                {item?.phone ? <p> P: {item?.phone} </p> : null}

                {item?.fax ? <p> F: {item?.fax} </p> : null}

                {item?.mail ? (
                  <a href={`mailto: ${item?.mail}`}>{item?.mail}</a>
                ) : null}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Representatives;
