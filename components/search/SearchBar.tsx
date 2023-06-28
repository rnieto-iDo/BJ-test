import React, { useEffect, useState, FC } from 'react';
import { useRouter } from 'next/router';
import cs from 'classnames';
import Image from 'next/image';
import { Input } from '@witt-team/athens-component-library';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getSearchBarContent,
  selectSearchBarCmsData
} from '../../store/reducers/pageSlice';
import {
  getSearchAll,
  selectSearchAllData
} from '../../store/reducers/productSlice';
import Close from '../../assets/close.svg';
import FourImageTwoImageGrid from '../../blocks/image-blocks/four-image-two-image-grid/FourImageTwoImageGrid';
import type { CardType } from '../../types/component.types';
import styles from './SearchBar.module.scss';

export type SearchBarProps = {
  navbarEventListener: any;
};

const SearchBar: FC<SearchBarProps> = ({ navbarEventListener }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectSearchBarCmsData);
  const searchResults = useAppSelector(selectSearchAllData);

  const [isOpened, setIsOpened] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any | undefined>();

  const [searchTermPending, setSearchTermPending] = useState('');

  const [windowWidth, setWindowWidth] = useState(835);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    dispatch(getSearchBarContent());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 3) {
      const timeOutId = setTimeout(() => {
        setResults(null);
        setSearchTermPending(searchTerm);
        dispatch(getSearchAll(searchTerm));
      }, 500);

      return () => clearTimeout(timeOutId);
    }
    return undefined;
  }, [searchTerm]);

  useEffect(() => {
    if (searchTermPending === searchResults.searchTerm) {
      setSearchTermPending('');
    }
    setResults(searchResults.data);
  }, [searchResults]);

  navbarEventListener(event => {
    if (event === 'searchBarClicked') {
      setIsOpened(!isOpened);
    }
  });

  const handleSearchBarClose = () => {
    setIsOpened(false);
    setResults(null);
    setSearchTerm('');
  };

  const setInputQuery = e => {
    setSearchTerm(e.target.value);
  };

  const handlePopularSearchTermSelected = item => {
    setSearchTerm(item);
  };

  const handleCardClick = (href: string) => {
    if (href) {
      setIsOpened(false);
      router.push(href);
    }
  };

  const getItemImageUrl = item => {
    if (!item) return '#';

    if (item.type === 'Product' || item.type === 'Material') {
      return item.image?.url;
    }

    return item.image;
  };

  const getItemLink = item => {
    if (!item) return '#';

    if (item.type === 'Product') {
      return `/products/details/${item.url_key}`;
    }

    if (item.type === 'Material') {
      return `/materials/details/${item.url_key}`;
    }

    if (item.type === 'Collection') {
      return `/collections/${item.url_key}`;
    }

    if (item.type === 'Designer') {
      return `/designers/${item.url_key}`;
    }

    return '#';
  };

  const formatResultForGrid = (array: any) => {
    const newArray: CardType[] = array?.map(item => ({
      id: item?.id,
      title: item?.name,
      imageComponent: (
        <div
          className={styles.Image}
          onClick={() => handleCardClick(getItemLink(item))}
        >
          <Image src={getItemImageUrl(item)} alt="no-image" fill />
        </div>
      ),
      onClick: () => handleCardClick(getItemLink(item))
    }));

    return newArray;
  };

  return (
    <div className={cs(styles.Overlay, isOpened ? styles.Opened : '')}>
      <div
        className={cs(styles.SearchBarContainer, isOpened ? styles.Opened : '')}
      >
        <div className={cs(styles.SearchBar)}>
          <div className={cs(styles.SearchBarInput)}>
            <Input
              value={searchTerm}
              onChange={e => setInputQuery(e)}
              bordered={false}
              placeholder={cmsData?.searchHintText}
              allowClear={{ clearIcon: <Image src={Close} alt="no-image" /> }}
              className={cs(styles.SearchBarInput)}
            />
          </div>
          <div
            className={cs(styles.SearchBarClose)}
            onClick={() => handleSearchBarClose()}
          >
            {windowWidth < 835 ? (
              <Image src={Close} alt="no-image" />
            ) : (
              <a>Close</a>
            )}
          </div>
        </div>

        {searchTerm ? (
          <div
            className={cs(styles.SearchResults, isOpened ? styles.Opened : '')}
          >
            <div className={cs(styles.SearchResultTitle, 'witt-container')}>
              <p>
                {searchTermPending !== ''
                  ? `Searching "${searchTermPending}"`
                  : `"${searchTerm}" ${
                      results?.length ? results?.length : 0
                    } Results`}
              </p>
            </div>
            <FourImageTwoImageGrid
              title=""
              cardArray={formatResultForGrid(results)}
            />
          </div>
        ) : (
          <div
            className={cs(
              styles.PopularSearches,
              isOpened ? styles.Opened : ''
            )}
          >
            <div className={cs(styles.PopularSearchesTitle)}>
              {cmsData?.popularSearchTitle && (
                <p>{cmsData?.popularSearchTitle}</p>
              )}
            </div>
            <div className={cs(styles.PopularSearchesItems)}>
              {cmsData?.popularSearchTerms?.map((item: any) => (
                <button
                  className={cs(styles.PopularSearchesItem)}
                  type="button"
                  key={`popular-terms-${item}`}
                  onClick={() => handlePopularSearchTermSelected(item)}
                >
                  {item}
                </button>
              )) ?? null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
