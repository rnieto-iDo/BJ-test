import { useEffect, useState } from 'react';
import cs from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  Button,
  Card,
  SectionHeader,
  WittLink
} from '@witt-team/athens-component-library';
import { IUpdateCart } from 'interfaces/cartInterfaces';
import SeoMetaData from '@/components/globals/SeoMetaData';
import AddToProjectModal from '@/components/reusable/AddToProjectModal';
import { roundPrice } from 'helpers/utils';
import CircleButton from '../../components/reusable/CircleButton';
import styles from '../../styles/pages/Cart.module.scss';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getCartTypePageContent,
  selectCMSData
} from '../../store/reducers/pageSlice';
import { SanityImage } from '../../components/reusable/SanityImage/SanityImage';
import {
  getProductsInCart,
  selectCartItems,
  removeProductFromCart,
  setShowSideBar,
  selectCartItemsUpdateStatus,
  updateProductFromCart,
  selectCartId,
  generateCustomerCart
} from '../../store/reducers/cartSlice';

const TOKEN_KEY = 'token';
const LOGIN_ROUTE = '/login';

const Cart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectCMSData);
  const cartItems = useAppSelector(selectCartItems);
  const products = cartItems?.filter(
    item => !item?.product?.categories?.find(cat => cat?.name === 'Materials')
  );
  const materials = cartItems?.filter(item =>
    item?.product?.categories?.find(cat => cat?.name === 'Materials')
  );
  const cartId = useAppSelector(selectCartId);
  const updateCartStatus = useAppSelector(selectCartItemsUpdateStatus);
  const [selectedUid, setSelectedUid] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const url = `https://${process.env.NEXT_PUBLIC_THREEKIT_ENV}/api/assets/thumbnail/`;
  const token = `?bearer_token=${process.env.NEXT_PUBLIC_THREEKIT_TOKEN}`;

  useEffect(() => {
    dispatch(getCartTypePageContent());
    dispatch(getProductsInCart());
    dispatch(generateCustomerCart());
  }, [dispatch]);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      router.push(LOGIN_ROUTE);
    }
  }, []);

  const changeQuantity = (product: any, quantityChange: number) => {
    const newQuantity = product.quantity + quantityChange;
    if (newQuantity <= 0) return;
    setSelectedUid(product?.uid);
    const updatedProduct: IUpdateCart = {
      input: {
        cart_id: cartId,
        cart_items: [{ cart_item_uid: product?.uid, quantity: newQuantity }]
      }
    };
    dispatch(updateProductFromCart(updatedProduct));
  };

  const isQuantityDisabled = (currentQuantity: number) =>
    currentQuantity - 1 <= 0;
  const quantityChangeInProgress = uid =>
    updateCartStatus === 'loading' && selectedUid === uid;

  const showHideSideBar = (show: boolean) => {
    dispatch(setShowSideBar(show));
  };

  const navigateToUrl = (href: string) => {
    router.push(href);
  };

  const handleNavigateSanity = (link: string) => {
    router.push(link);
  };

  const returnItemsId = () => products?.map(item => item?.product?.id);

  const findAssetId = (item, options) => {
    const optionsArray = item?.product?.options?.find(
      opt => opt?.title === options?.label
    );

    const assetIdObj = optionsArray?.value?.find(
      opt => opt?.uid === options?.values[0]?.customizable_option_value_uid
    );

    let assetIdParsedObject = '';

    try {
      assetIdParsedObject = JSON.parse(assetIdObj?.threekit_asset_id || '');
    } catch (error) {
      assetIdParsedObject = '';
    }

    const assetIdValue: any = Object?.values(assetIdParsedObject)[0];

    return assetIdValue?.assetId || '';
  };

  return (
    <>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <AddToProjectModal
        productsId={returnItemsId()}
        visible={showModal}
        onClose={() => setShowModal(false)}
        onBackDropPress={() => setShowModal(false)}
      />
      <div className={styles.Cart}>
        <div className={styles.Heading}>
          <p className={styles.HeadingText}>{cmsData?.title}</p>
        </div>
        {!cartItems?.length ? (
          <div className={styles.EmptyCart}>
            <div className={styles.EmptyCartContent}>
              <p className={styles.EmptyMessage}>{cmsData?.emptyCartMessage}</p>
              <WittLink
                href={cmsData?.emptyCartLink?.url || '#'}
                active
                className={styles.ExploreCollectionsLink}
              >
                {cmsData?.emptyCartLink?.text}
              </WittLink>
            </div>
          </div>
        ) : (
          <div className={cs('witt-container', styles.ProductsContainer)}>
            <div className={styles.ProductsLabelContainer}>Products</div>
            {products?.map(item => (
              <div key={item?.uid} className={styles.CartItemProduct}>
                <div
                  className={styles.CartItemProductImage}
                  onClick={() =>
                    navigateToUrl(`/products/details/${item?.product?.url_key}`)
                  }
                >
                  <Image
                    src={item?.threeKitImage}
                    alt={item?.product?.image?.label}
                    fill
                  />
                </div>
                <div className={styles.CartItemProductContent}>
                  <div className={styles.CartItemProductDesc}>
                    <div className={styles.TitleContainer}>
                      {/* eslint-disable-next-line
                      jsx-a11y/no-noninteractive-element-interactions */}
                      <p
                        className={styles.TitleText}
                        onClick={() =>
                          navigateToUrl(
                            `/products/details/${item?.product?.url_key}`
                          )
                        }
                      >
                        {item?.product?.name}
                      </p>
                      <div className={cs(styles.TitlePrice, styles.TitleText)}>
                        List Price From &nbsp;
                        <p className={styles.BlacKText}>{`$${roundPrice(
                          item?.prices?.price?.value
                        )}`}</p>
                      </div>
                    </div>
                    <p
                      className={styles.GrayText}
                    >{`SKU ${item?.product?.sku}`}</p>
                    <div className={cs(styles.InlineText, styles.GrayText)}>
                      List Price From &nbsp;
                      <p className={styles.BlacKText}>{`$${roundPrice(
                        item?.prices?.price?.value
                      )}`}</p>
                    </div>
                  </div>
                  <div className={styles.CartItemProductMaterialsLabel}>
                    <div className={styles.SelectLabel}>Selected Materials</div>
                    <div
                      className={styles.Configure}
                      onClick={() => showHideSideBar(true)}
                    >
                      Configure
                    </div>
                  </div>
                  <div className={styles.CartItemProductMaterialsGrid}>
                    {item?.customizable_options?.map(option => (
                      <div
                        className={styles.CartItemProductMaterial}
                        key={option?.id}
                      >
                        <p className={styles.Label}>{option?.label}</p>
                        <Card
                          title={option?.values[0]?.label}
                          imageUrl={`${url}${findAssetId(
                            item,
                            option
                          )}${token}`}
                          className={styles.Card}
                        />
                      </div>
                    ))}
                  </div>
                  <div className={styles.QuantityContainer}>
                    <CircleButton
                      content="-"
                      onPress={() => changeQuantity(item, -1)}
                      disabled={
                        isQuantityDisabled(item?.quantity) ||
                        quantityChangeInProgress(item?.uid)
                      }
                    />
                    <p className={styles.QuantityNumber}>{item?.quantity}</p>
                    <CircleButton
                      content="+"
                      onPress={() => changeQuantity(item, 1)}
                      disabled={quantityChangeInProgress(item?.uid)}
                    />
                    <div
                      className={styles.RemoveProduct}
                      onClick={() => dispatch(removeProductFromCart(item?.uid))}
                    >
                      Remove Product
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {materials?.length > 0 && (
              <div>
                <div className={styles.ProductsLabelContainer}>Materials</div>
                <div className={styles.CartMaterials}>
                  {materials?.map(item => (
                    <div className={styles.CartMaterialCard} key={item?.uid}>
                      <div className={styles.MaterialImage}>
                        <Image
                          src={item?.product?.image?.url}
                          alt="no-image"
                          fill
                        />
                      </div>
                      <div className={styles.MaterialDesc}>
                        <div>
                          <p className={styles.MaterialTitle}>
                            {item?.product?.name}
                          </p>
                          <p
                            className={styles.MaterialSKU}
                          >{`SKU ${item?.product?.sku}`}</p>
                        </div>
                        <div
                          className={styles.RemoveMaterial}
                          onClick={() =>
                            dispatch(removeProductFromCart(item?.uid))
                          }
                        >
                          Remove
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className={cs('witt-container', styles.CartActionContainer)}>
              <Button
                variant="filled"
                className={styles.Button}
                onClick={() => navigateToUrl('/request-form')}
              >
                Continue to request form
              </Button>
              <div className={styles.SaveOrAddContainer}>
                <div className={styles.SaveAdd}>Save</div>
                <div className={styles.Or}>or</div>
                <div
                  className={styles.SaveAdd}
                  onClick={() => setShowModal(true)}
                >
                  Add to Project
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="witt-container">
          <SectionHeader
            text={cmsData?.featuredProducts?.title}
            className={styles.FeaturedProductsTitle}
          />
          <div className={styles.FeaturedProductsGrid}>
            {cmsData?.featuredProducts?.products?.map(item => (
              <Card
                key={item?.id}
                title={item?.title}
                imageUrl={item?.image?.asset?.url}
                className={styles.FeaturedProductCard}
                onClick={() => handleNavigateSanity(item?.link?.url)}
                ImageElement={
                  <div
                    className={styles.Image}
                    onClick={() => handleNavigateSanity(item?.link?.url)}
                  >
                    {item?.image?.asset ? (
                      <SanityImage image={item?.image} />
                    ) : null}
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
