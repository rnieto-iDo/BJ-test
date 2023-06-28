import { SearchBar, SectionHeader } from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import { PreviewSuspense } from 'next-sanity/preview';
import { FC, lazy, useEffect, useState } from 'react';
import SeoMetaData from '../../components/globals/SeoMetaData';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getTehnicianLocatorPageContent,
  selectTehnicianLocatorCmsData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/support/TehnicianLocator.module.scss';
import { getKey } from '../../utils';

const TehnicianLocatorPagePreview = lazy(
  () => import('../../components/sanity-previews/TehnicianLocatorPagePreview')
);

export const getStaticProps = async ({ preview = false }) => ({
  props: { preview }
});

type TehnicianProps = {
  id: string;
  location: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  fax: string;
  mail: string;
};

type TehnicianLocatorProps = {
  pageProps: {
    preview: boolean;
  };
};

const TechnicianLocator: FC<TehnicianLocatorProps> = ({
  pageProps: { preview }
}) => {
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectTehnicianLocatorCmsData);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');

  useEffect(() => {
    dispatch(getTehnicianLocatorPageContent());
  }, [dispatch]);

  const doFilter = function (item: TehnicianProps) {
    const search: string = searchValue?.toLowerCase() ?? '';
    if (
      search === '' ||
      item?.location?.toLowerCase().includes(search) ||
      item?.name?.toLowerCase().includes(search) ||
      item?.description?.toLowerCase().includes(search) ||
      item?.address?.toLowerCase().includes(search) ||
      item?.mail?.toLowerCase().includes(search)
    ) {
      return item;
    }
    return false;
  };

  const getFormattedTechnicalData = data => {
    const groupedUsData = data
      ?.filter(doFilter)
      .reduce((groups, item: TehnicianProps) => {
        const { location } = item;
        if (!groups[location]) {
          groups[location] = [];
        }
        groups[location].push(item);
        return groups;
      }, {});
    return groupedUsData;
  };

  return preview ? (
    <PreviewSuspense fallback="Loading...">
      <TehnicianLocatorPagePreview
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        setSortValue={setSortValue}
        sortValue={sortValue}
      />
    </PreviewSuspense>
  ) : (
    <div className={styles.TehnicianLocator}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <BigImageTitleDescLinkBlock
        title={cmsData?.introExploreSection?.title}
        backgroundColor={cmsData?.introExploreSection?.backgroundColor}
        description={cmsData?.introExploreSection?.description}
        className={cs(styles.PageCover, styles.ExploreSection)}
        size="medium"
        textColor="#fff"
      />
      <SearchBar
        className={cs('witt-container', styles.SearchBarContainer)}
        searchBarValue={searchValue}
        selectDefaultValue={sortValue}
        onSearchBarChange={text => setSearchValue(text)}
        selectOptions={[]}
        onSelectChange={value => setSortValue(value)}
      />
      <div className={cs('witt-container', styles.TehniciansContainer)}>
        <SectionHeader text="United States" />
        {cmsData?.tehnicians?.us &&
          Object.keys(getFormattedTechnicalData(cmsData?.tehnicians?.us))?.map(
            (region: string) => (
              <div key={getKey('region-')} className={styles.TehnicianGroup}>
                <div className={styles.Region}>{region}</div>
                <div className={styles.TehnicianList}>
                  {getFormattedTechnicalData(cmsData?.tehnicians?.us)[
                    region
                  ]?.map((item: TehnicianProps) => (
                    <div key={item?.id} className={styles.Tehnician}>
                      <div className={styles.Region}>{item?.location}</div>
                      <div className={styles.Info}>
                        <p className={styles.Name}>{item?.name}</p>
                        <p>{item?.description}</p>
                      </div>
                      <div className={styles.Address}>{item?.address}</div>
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
            )
          )}
      </div>
      <div
        className={cs(
          'witt-container',
          styles.TehniciansContainer,
          styles.TehniciansContainerIntenational
        )}
      >
        <SectionHeader text="International" />
        {cmsData?.tehnicians?.international &&
          Object.keys(
            getFormattedTechnicalData(cmsData?.tehnicians?.international)
          )?.map((region: string) => (
            <div key={getKey('region-')} className={styles.TehnicianGroup}>
              <div className={styles.Region}>{region}</div>
              <div className={styles.TehnicianList}>
                {getFormattedTechnicalData(cmsData?.tehnicians?.international)[
                  region
                ]?.map((item: TehnicianProps) => (
                  <div key={item?.id} className={styles.Tehnician}>
                    <div className={styles.Region}>{item?.location}</div>
                    <div className={styles.Info}>
                      <p className={styles.Name}>{item?.name}</p>
                      <p>{item?.description}</p>
                    </div>
                    <div className={styles.Address}>{item?.address}</div>
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
          ))}
      </div>
    </div>
  );
};

export default TechnicianLocator;
