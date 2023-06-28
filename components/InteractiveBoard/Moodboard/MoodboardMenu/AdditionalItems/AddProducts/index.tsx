import { SearchBar } from '@witt-team/athens-component-library';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';
import {
  addMoodboardCanvasImage,
  getCanvasObjectBySku
} from '../../../../../../helpers/moodboardHelpers/moodboardCanvas.helper';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../../../hooks/reduxOverwriteHooks';
import {
  IProjectProduct,
  IProjectProductExtended
} from '../../../../../../interfaces/productInterfaces';
import {
  addItemMoodboard,
  removeItemMoodboard,
  selectedProjectItems
} from '../../../../../../store/reducers/moodBoardMenuSlice';
import { selectMoodBoardCanvas } from '../../../../../../store/reducers/moodboardCanvasSlice';
import { RootState } from '../../../../../../types/redux.types';
import { generateServerSideImageLink } from '../../../../../../utils';
import ProductItem from '../../ProductItem';
import styles from './AddProducts.module.scss';

const AddProducts = () => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');
  const productsState = useSelector(
    (state: RootState) => state.products.moodboardProducts
  );
  const moodboardCanvas = useAppSelector(selectMoodBoardCanvas);
  const selectedProductsList = useAppSelector(selectedProjectItems);

  const handleProductClick = (item: any) => {
    dispatch(addItemMoodboard(item));
    const position = selectedProductsList.map(el => el.sku).indexOf(item.sku);
    const doesExist = position >= 0;

    if (doesExist) {
      dispatch(removeItemMoodboard(item));
      const target = getCanvasObjectBySku(item.sku, moodboardCanvas);
      moodboardCanvas?.remove(target);
      moodboardCanvas?.requestRenderAll();
    } else {
      dispatch(addItemMoodboard(item));
      if (moodboardCanvas) console.log(item);
      addMoodboardCanvasImage(
        0,
        item.sku,
        generateServerSideImageLink(item.image.url),
        0,
        50,
        moodboardCanvas,
        item.moodboardType,
        { assetId: item.threekit_asset_id }
      );
    }
  };

  const isSelectedProduct = sku =>
    !!selectedProductsList.find(item => item?.sku === sku);

  const renderItems = (productItems: IProjectProductExtended[]) =>
    productItems?.map((product: IProjectProduct) => {
      const productLocal = JSON.parse(JSON.stringify(product));

      productLocal.moodboardType =
        productLocal.categoryId !== 801 ? 'Product' : 'Material';

      return (
        <ProductItem
          key={uuid()}
          product={productLocal}
          selected={isSelectedProduct(productLocal?.sku)}
          onClick={() => handleProductClick(productLocal)}
        />
      );
    });

  const searchItems = () => {
    const filteredProducts = productsState?.filter((product: IProjectProduct) =>
      product?.name?.toLowerCase()?.includes(searchValue)
    );
    return renderItems(filteredProducts);
  };

  return (
    <div className={styles.Main}>
      <SearchBar
        searchBarValue={searchValue}
        onSearchBarChange={value => setSearchValue(value)}
        selectOptions={[]}
        onSelectChange={value => setSortValue(value)}
        selectDefaultValue={sortValue}
        className={styles.SearchBar}
      />
      <div className={styles.Line} />
      <div className={styles.GridContainer}>
        {!searchValue ? renderItems(productsState) : searchItems()}
      </div>{' '}
    </div>
  );
};

export default AddProducts;
