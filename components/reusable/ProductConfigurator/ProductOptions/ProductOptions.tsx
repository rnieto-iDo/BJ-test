/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useConfigurator } from '@threekit-tools/treble/dist';
import { SearchBar } from '@witt-team/athens-component-library';
import cs from 'classnames';
import { useAppDispatch, useAppSelector } from 'hooks/reduxOverwriteHooks';
import Image from 'next/image';
import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  selectProductsData,
  setSelectedOption
} from 'store/reducers/productSlice';
import { FIRST_ELEMENT_INDEX } from '../../../../constants/common';

import styles from './ProductOptions.module.scss';

type Attribute = {
  assetId: string;
  name: string;
  image?: string;
  handleSelect: () => void;
};

type Tab = {
  id?: number | string;
  name?: string;
  values?: Array<Attribute>;
};

type ProductOptionsProps = {
  controls: ReactNode;
};

const ProductOptions: FC<ProductOptionsProps> = ({ controls }) => {
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectProductsData);
  const magentoOptions = product[0]?.options;
  const [activeTab, setActiveTab] = useState<Tab>();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');
  const [attributes] = useConfigurator();

  const magentoActiveTabOptions = magentoOptions?.find(item => {
    if (item?.title === activeTab?.name) {
      const filtered = item.values?.filter(value => {
        try {
          JSON.parse(value);
        } catch (error) {
          return false;
        }
        return true;
      });

      const safeObj = { ...item };
      safeObj.values = filtered;
      return item;
    }
    return null;
  });

  const customOptions = useMemo(
    () =>
      Object.keys(attributes ?? {})
        .filter(
          attr =>
            (attributes ? attributes[attr].name : '') !==
            'Cameras - White Background'
        )
        .map(item => (attributes ? attributes[item] : {})),
    [attributes]
  );

  // eslint-disable-next-line no-underscore-dangle

  const handleTabChange = (tab: Tab) => setActiveTab(tab);

  useEffect(() => {
    if (customOptions && !activeTab)
      setActiveTab(customOptions[FIRST_ELEMENT_INDEX]);
  }, [customOptions, activeTab]);

  const findAndAddSelectedOption = assetId => {
    const optionSKU = magentoActiveTabOptions?.value?.find(item => {
      const threekitData = JSON.parse(item?.threekit_asset_id);
      // invalid object key safe mode
      return (
        activeTab?.name &&
        // eslint-disable-next-line no-prototype-builtins
        threekitData?.hasOwnProperty(activeTab.name) &&
        threekitData[activeTab.name]?.assetId === assetId
      );
    });

    dispatch(
      setSelectedOption(activeTab?.name ? { [activeTab.name]: optionSKU } : {})
    );
  };

  const renderOptions = () => {
    const threeKitOptions =
      activeTab?.values &&
      activeTab?.values?.filter(item =>
        //  invalid JSON / null safe method
        magentoActiveTabOptions?.value
          ?.filter(val => {
            try {
              JSON.parse(val?.threekit_asset_id);
              return true;
            } catch (error) {
              return false;
            }
          })
          .some(val => {
            const threekitData = JSON.parse(val?.threekit_asset_id);
            // invalid object key safe mode
            return (
              activeTab.name &&
              // eslint-disable-next-line no-prototype-builtins
              threekitData?.hasOwnProperty(activeTab.name) &&
              threekitData[activeTab.name]?.assetId === item?.assetId
            );
          })
      );

    const filtered = searchValue
      ? threeKitOptions?.filter((item: Attribute) =>
          item?.name?.toLowerCase().startsWith(searchValue?.toLowerCase())
        )
      : threeKitOptions;

    return filtered?.map((item: Attribute) => (
      <div
        key={item.assetId}
        className={styles.AttributeImage}
        onClick={() => {
          item.handleSelect();
          findAndAddSelectedOption(item?.assetId);
        }}
      >
        <Image
          src={`https://${process.env.NEXT_PUBLIC_THREEKIT_ENV}/api/assets/thumbnail/${item.assetId}?bearer_token=${process.env.NEXT_PUBLIC_THREEKIT_TOKEN}`}
          alt="not-loaded"
          fill
        />
      </div>
    ));
  };

  return (
    <div className={styles.ProductOptions}>
      <div className={styles.Tabs}>
        {customOptions.map(
          (tab: any) =>
            (
              <p
                key={`Tab-${tab.id}`}
                className={cs(
                  styles.Tab,
                  activeTab?.id === tab.id ? styles.ActiveTab : ''
                )}
                onClick={() => handleTabChange(tab)}
              >
                {tab.name}
              </p>
            ) ?? <p>Loading...</p>
        )}
      </div>
      <div className={styles.TabViewerContainer}>
        <SearchBar
          searchBarValue={searchValue}
          onSearchBarChange={text => setSearchValue(text)}
          selectOptions={[]}
          onSelectChange={value => setSortValue(value)}
          selectDefaultValue={sortValue}
          className={styles.SearchBar}
        />
        <div className={styles.AttributesGrid}>{renderOptions()}</div>
      </div>
      {controls}
    </div>
  );
};

export default ProductOptions;
