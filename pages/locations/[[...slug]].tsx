import {
  Button,
  Card,
  SearchBar,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import cs from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SeoMetaData from '../../components/globals/SeoMetaData';
import Divider from '../../components/reusable/Divider/Divider';
import Map from '../../components/reusable/Map/Map';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getLocationsPageContent,
  selectCMSData
} from '../../store/reducers/pageSlice';
import styles from '../../styles/pages/Locations.module.scss';
import { getKey } from '../../utils';

const MAP_ID = 'map-container';

const Locations = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);
  const { slug } = router.query;

  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');
  useEffect(() => {
    dispatch(getLocationsPageContent());
  }, [dispatch]);

  useEffect(() => {
    if (
      cmsData?.mapSection?.useStoremapper === true &&
      slug &&
      slug[0] === 'map'
    ) {
      document.getElementById(MAP_ID)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [cmsData?.mapSection?.useStoremapper, slug]);

  const handleClicked = (href: string) => {
    router.push(href);
  };

  const doFilter = (item: any) => {
    const search = searchValue?.toLowerCase();
    if (
      search === '' ||
      item?.title?.toLowerCase().includes(search) ||
      item?.type?.toLowerCase().includes(search) ||
      item?.address?.toLowerCase().includes(search) ||
      item?.contact?.toLowerCase().includes(search) ||
      item?.tel?.toLowerCase().includes(search) ||
      item?.email?.toLowerCase().includes(search)
    ) {
      return item;
    }
    return false;
  };

  const createStoremapperScriptElement = (id, start) => {
    if (!document.getElementById('storemapper-script-element')) {
      const script = document.createElement('script');
      script.setAttribute('id', 'storemapper-script-element');
      script.setAttribute('data-storemapper-start', start);
      script.setAttribute('data-storemapper-id', id);

      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://www.storemapper.co/js/widget.js';

      const container = document.getElementById('storemapper');
      container?.parentNode?.insertBefore(script, container);
    }
  };

  useEffect(() => {
    if (
      cmsData &&
      cmsData?.mapSection?.useStoremapper &&
      cmsData?.mapSection?.storemapperId
    ) {
      createStoremapperScriptElement(
        cmsData?.mapSection?.storemapperId,
        cmsData?.mapSection?.storemapperStart
      );
    }
  }, [cmsData]);

  return (
    <div className={styles.Location}>
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
        fullsizeImage
      />
      <div className={cs('container-with-separator', styles.DividerSeparator)}>
        <SectionHeader
          className={cs(styles.MainSectionHeader)}
          text={cmsData?.locationsSubtitle}
        />
      </div>

      <div className={styles.ShowroomsContainer}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.showroomsSection?.title}
        />
        <div className={styles.FeaturedShowrooms}>
          {cmsData?.showroomsSection?.showrooms.length > 0 &&
            cmsData?.showroomsSection?.showrooms.map(
              (item: any, index: number) => (
                <Card
                  key={getKey(item?.id)}
                  className={cs(
                    styles.CardGridItem,
                    styles[`FeaturedShowroom-${index}`]
                  )}
                  imageUrl={item?.image}
                  title={item?.city}
                  description={item?.description}
                  onClick={() => handleClicked(item?.slug || '#')}
                  textLayout="horizontal"
                />
              )
            )}
        </div>
        <Divider className={styles.ShowroomsDivider} />
      </div>
      <div id="map-container" className={styles.MapContainer}>
        <div className={styles.MapSection}>
          <SectionHeader
            className={styles.SectionHeader}
            text={cmsData?.mapSection?.title}
          />
          {cmsData?.mapSection?.useStoremapper ? (
            <div id="storemapper" className={styles.MapSection}>
              <p>
                Store Locator is loading from{' '}
                <a href="https://www.storemapper.com">Storemapper plugin</a>...
              </p>
            </div>
          ) : (
            <>
              <Map locations={cmsData?.locationsSection} />

              <SearchBar
                onSelectChange={value => setSortValue(value)}
                searchBarValue={searchValue}
                selectDefaultValue={sortValue}
                placeholder="Enter zip code or city"
                selectOptions={[]}
                onSearchBarChange={text => setSearchValue(text)}
                className={styles.SearchBarMap}
              />
            </>
          )}
        </div>
      </div>

      {!cmsData?.mapSection?.useStoremapper && (
        <div className={styles.LocationCardSection}>
          <div className={styles.LocationCardHeader}>
            {cmsData?.locationsSection ? (
              <p className={styles.LocationsNumber}>
                {cmsData?.locationsSection?.filter(doFilter).length} Locations
              </p>
            ) : (
              <p className={styles.LocationsNumber}>0 Locations</p>
            )}
          </div>
          <Divider className={styles.LocationGridDivider} />
          <div className={styles.LocationCardWrapper}>
            {cmsData?.locationsSection &&
              cmsData?.locationsSection.filter(doFilter).map((data: any) => (
                <div className={styles.LocationCard} key={getKey(data?.id)}>
                  <div>
                    <p className={styles.LocationCardTitle}>{data?.title}</p>
                    <p className={styles.LocationCardSubtitle}>
                      {' '}
                      {data?.type}{' '}
                    </p>
                  </div>
                  <div>
                    <div className={styles.LocationCardDescription}>
                      <p className={styles.Adress}> {data?.address}</p>
                      <p className={styles.Contact}>
                        {' '}
                        Contact: {data?.contact}{' '}
                      </p>
                      <p className={styles.Tel}> Tel: {data?.tel} </p>
                      <p className={styles.Email}> Email: {data?.email} </p>
                    </div>
                    <div className={styles.LocationCardButtons}>
                      <Button variant="outlined"> Directions </Button>
                      <Button variant="outlined"> Schedule Appointment </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <Link href="/representatives">
            <Button
              variant="outlined"
              className={styles.FindRepresentativesNearbyButton}
            >
              Find representatives nearby
            </Button>
          </Link>
          <Divider />
        </div>
      )}

      <div className={styles.ExploreMoreSectionContainer}>
        <SectionHeader
          className={styles.SectionHeader}
          text={cmsData?.exploreMoreSection?.title}
        />
        <BigImageTitleDescLinkBlock
          title={cmsData?.exploreMoreSection?.exploreMoreExploreSection?.title}
          linkText={
            cmsData?.exploreMoreSection?.exploreMoreExploreSection?.link?.text
          }
          linkUrl={
            cmsData?.exploreMoreSection?.exploreMoreExploreSection?.link?.url
          }
          backgroundColor={
            cmsData?.exploreMoreSection?.exploreMoreExploreSection
              ?.backgroundColor
          }
          image={cmsData?.exploreMoreSection?.exploreMoreExploreSection?.image}
          description={
            cmsData?.exploreMoreSection?.exploreMoreExploreSection?.description
          }
          textColor="#fff"
        />
      </div>
      <div className={styles.Lookbooks}>
        <div
          className={cs(
            styles.SectionHeaderWithLink,
            styles.LookBooksHeaderWrapper
          )}
        >
          <SectionHeader
            text={cmsData?.lookbooks?.title}
            className={styles.SectionHeader}
          />
          <WittLink active href={cmsData?.lookbooks?.titleLink?.url ?? ''}>
            {cmsData?.lookbooks?.titleLink?.text}
          </WittLink>
        </div>
        <div className={styles.LookbooksGrid}>
          {cmsData?.lookbooks?.selectedLookbooks.map((item: any) => (
            <Link href={item.link.url} key={getKey(item?.id)}>
              <Card
                key={getKey(item?.id)}
                title={item?.title || item?.name}
                description={item?.description}
                imageUrl={item?.image}
                isImageVertical
                textLayout="vertical"
                className={cs(styles.CardGridItem)}
                onClick={() => {
                  /**/
                }}
              />
            </Link>
          )) ?? null}
        </div>
      </div>
    </div>
  );
};

export default Locations;
