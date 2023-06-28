import { handleDownloadChecklistPDF } from 'helpers/moodboardHelpers/moodboardCanvas.helper';
import { useEffect, useRef } from 'react';
import { roundPrice } from 'helpers/utils';
import {
  useAppDispatch,
  useAppSelector
} from '../../../../../hooks/reduxOverwriteHooks';
import { ICartItems, IItem } from '../../../../../interfaces/cartInterfaces';
import {
  addProductToCart,
  generateCustomerCart,
  selectCartId,
  setShowSideBar
} from '../../../../../store/reducers/cartSlice';
import {
  selectSingleProjectMaterials,
  selectSingleProjectProducts
} from '../../../../../store/reducers/projectsSlice';
import styles from './ProjectReview.module.scss';
import ProjectReviewItem from './ProjectReviewItem';

const ProjectReview = () => {
  const imageRef = useRef(null);
  const dispatch = useAppDispatch();
  // const [loadedImage, setLoadedImage] = useState<boolean>(false);
  const projectProducts = useAppSelector(selectSingleProjectProducts);
  const projectMaterials = useAppSelector(selectSingleProjectMaterials);
  const selectedCartId = useAppSelector(selectCartId);

  useEffect(() => {
    dispatch(generateCustomerCart());
  }, [dispatch]);

  const renderProducts = () =>
    projectProducts?.items?.map((item: any) => (
      <ProjectReviewItem
        key={item?.product_attributes?.sku}
        sku={item?.product_attributes?.sku}
        title={item?.product_attributes?.name}
        imageUrl={`${process.env.API_ENDPOINT}/media/catalog/product${item?.product_attributes?.image}`}
        price={roundPrice(item?.product_attributes?.price)}
        defaultAttributes={item?.product_attributes?.threekit_pdp_1_json}
        imageRef={imageRef}
        // setLoaded={() => setLoadedImage(true)}
      />
    ));

  const renderMaterials = () =>
    projectMaterials?.items?.map((item: any) => (
      <ProjectReviewItem
        key={item?.product_attributes?.sku}
        title={item?.product_attributes?.name}
        imageUrl={`${process.env.API_ENDPOINT}/media/catalog/product${item?.product_attributes?.image}`}
        price={roundPrice(item?.product_attributes?.price)}
      />
    ));

  const addToCartSuccess = () => dispatch(setShowSideBar(true));

  const handleAddToCart = () => {
    const products: IItem[] = projectProducts?.items?.map(item => ({
      quantity: 1,
      selected_options: [],
      sku: item?.product_attributes?.sku
    }));
    const addProductData: ICartItems = {
      cartId: selectedCartId,
      products,
      onSuccess: () => addToCartSuccess()
    };
    dispatch(addProductToCart(addProductData));
  };

  return (
    <div className={styles.MainContainer}>
      <div className={styles.TopContainer}>
        <p className={styles.LeftLabel}>Products</p>
        <button
          type="button"
          className={styles.RightLabel}
          onClick={handleDownloadChecklistPDF}
        >
          Download Checklist
        </button>
      </div>
      <div className={styles.ScrollContainer}>
        <div id="checklist-wrapper">
          {renderProducts()}
          {renderMaterials()}
        </div>
      </div>
      {projectProducts?.items?.length && (
        <div
          onClick={e => {
            e.preventDefault();
            handleAddToCart();
          }}
          className={styles.Button}
        >{`Add ${projectProducts?.items?.length} items to Cart`}</div>
      )}
    </div>
  );
};

export default ProjectReview;
