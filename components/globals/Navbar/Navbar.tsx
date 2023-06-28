import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { AppBar } from '@witt-team/athens-component-library';
import sanityClient from '../../../api/sanityClient';

import styles from './Navbar.module.scss';
import logo from '../../../assets/Logo.svg';
import useScrolledPast from '../../../hooks/useScrolledPast';
import { getKey } from '../../../utils';

import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';

import {
  getNavigationContent,
  selectNavigationData
} from '../../../store/reducers/pageSlice';

const homePageUrl = '/';

export const NavigationBar = eventEmiter => {
  const { pathname } = useRouter();
  const hasScrolledPastHeader = useScrolledPast('head-image-title');

  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectNavigationData);

  const [navigation, setNavigation] = useState(cmsData);

  useEffect(() => {
    dispatch(getNavigationContent());
  }, [dispatch]);

  useEffect(() => {
    if (cmsData != null) {
      const value = JSON.parse(JSON.stringify(cmsData));

      value?.header?.forEach(header => {
        if (header.categories) {
          header.categories.forEach(category => {
            if (
              category.navigationCategoryContent &&
              category.navigationCategoryContent.columns
            ) {
              if (category.navigationCategoryContent.columns.length < 3) {
                const start = category.navigationCategoryContent.columns.length;
                for (let i = start; i < 3; i += 1) {
                  category.navigationCategoryContent.columns?.unshift({
                    _type: 'empty_column',
                    _key: `empty_column-${i}`,
                    columnItems: []
                  });
                }
              }
            }
          });
        }
      });

      setNavigation(value);
    }
  }, [cmsData]);

  const isHomePageAndNotScrolledPastHeader =
    pathname === homePageUrl && !hasScrolledPastHeader;

  return (
    <AppBar
      key={getKey('navbar-item-')}
      className={
        isHomePageAndNotScrolledPastHeader
          ? styles.HomePageAppBar
          : styles.OtherPageAppBar
      }
      navigation={navigation}
      currDirectory={pathname}
      imageUrl={logo.src}
      isLogoHidden={isHomePageAndNotScrolledPastHeader}
      eventEmiter={eventEmiter}
      sanityClient={sanityClient}
    />
  );
};
