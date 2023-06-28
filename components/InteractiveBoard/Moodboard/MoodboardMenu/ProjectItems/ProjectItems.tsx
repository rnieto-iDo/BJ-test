import { SearchBar } from '@witt-team/athens-component-library';
import { useState } from 'react';
import uuid from 'react-uuid';
import {
  addMoodboardCanvasImage,
  getCanvasObjectBySku
} from '../../../../../helpers/moodboardHelpers/moodboardCanvas.helper';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../../hooks/reduxOverwriteHooks';
import { IProjectProduct } from '../../../../../interfaces/productInterfaces';
import { selectMoodBoardCanvas } from '../../../../../store/reducers/moodboardCanvasSlice';
import {
  addItemMoodboard,
  removeItemMoodboard,
  selectedProjectItems
} from '../../../../../store/reducers/moodBoardMenuSlice';
import {
  selectSingleProjectImages,
  selectSingleProjectMaterials,
  selectSingleProjectProducts
} from '../../../../../store/reducers/projectsSlice';
import { generateServerSideImageLink } from '../../../../../utils';
import ProductItem from '../ProductItem';
import styles from './ProjectItems.module.scss';

const ProjectItems = () => {
  const dispatch = useAppDispatch();
  const selectedProjectProducts = useAppSelector(selectSingleProjectProducts);
  const selectedProjectImages = useAppSelector(selectSingleProjectImages);
  const selectedProjectMaterials = useAppSelector(selectSingleProjectMaterials);
  const moodboardCanvas = useAppSelector(selectMoodBoardCanvas);
  const selectedProductsList = useAppSelector(selectedProjectItems);
  const [searchValue, setSearchValue] = useState<string>('');
  const [sortValue, setSortValue] = useState<string>('');

  const isSelectedProduct = sku =>
    !!selectedProductsList.find(item => item?.sku === sku);

  const handleProjectItemClicked = (item: any) => {
    const position = selectedProductsList.map(el => el.sku).indexOf(item.sku);
    const doesExist = position >= 0;

    if (doesExist) {
      dispatch(removeItemMoodboard(item));
      const target = getCanvasObjectBySku(item.sku, moodboardCanvas);
      moodboardCanvas?.remove(target);
      moodboardCanvas?.requestRenderAll();
    } else {
      dispatch(addItemMoodboard(item));
      if (moodboardCanvas)
        addMoodboardCanvasImage(
          0,
          item.sku,
          generateServerSideImageLink(item.image.url),
          0,
          50,
          moodboardCanvas,
          item.type,
          { assetId: item.assetId }
        );
    }
  };
  const renderItems = () => {
    const products = selectedProjectProducts?.items?.map(item => ({
      sku: item?.product_attributes?.sku,
      image: {
        url: `${process.env.API_ENDPOINT}/media/catalog/product${item?.product_attributes?.image}`
      },
      name: item?.product_attributes?.name,
      type: 'Product',
      assetId: item?.product_attributes.threekit_asset_id
    }));

    const materials = selectedProjectMaterials?.items?.map(item => ({
      sku: item?.product_attributes?.sku,
      image: {
        url: `${process.env.API_ENDPOINT}/media/catalog/product${item?.product_attributes?.image}`
      },
      name: item?.product_attributes?.name,
      type: 'Material'
    }));

    const images = selectedProjectImages?.items?.map(item => ({
      image: { url: item?.url },
      sku: item?.entity_id
    }));

    const productItems = [products, materials, images]?.flat();

    return productItems
      ?.filter(
        (product: IProjectProduct) =>
          (!searchValue && !product?.name) ||
          product?.name?.toLowerCase()?.includes(searchValue)
      )
      ?.map((item: IProjectProduct) => (
        <ProductItem
          key={uuid()}
          product={item}
          onClick={() => handleProjectItemClicked(item)}
          selected={isSelectedProduct(item?.sku)}
        />
      ));
  };

  return (
    <div className={styles.MainContainer}>
      <SearchBar
        searchBarValue={searchValue}
        onSearchBarChange={text => setSearchValue(text)}
        selectOptions={[]}
        onSelectChange={value => setSortValue(value)}
        selectDefaultValue={sortValue}
        className={styles.SearchBar}
      />
      <div className={styles.Line} />
      <div className={styles.GridContainer}> {renderItems()}</div>
    </div>
  );
};

export default ProjectItems;
