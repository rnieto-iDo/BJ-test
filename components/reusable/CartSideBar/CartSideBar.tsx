import { FC, useEffect, useState } from 'react';
import Image from 'next/image';
import cs from 'classnames';
import { useRouter } from 'next/router';
import { roundPrice } from 'helpers/utils';
import Close from '../../../assets/close.svg';
import styles from './CartSideBar.module.scss';
import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';
import {
  updateProductFromCart,
  generateCustomerCart,
  getProductsInCart,
  removeProductFromCart,
  selectCartItems,
  selectCartId,
  selectCartItemsUpdateStatus,
  setShowSideBar
} from '../../../store/reducers/cartSlice';
import CircleButton from '../CircleButton';
import { IUpdateCart } from '../../../interfaces/cartInterfaces';

type CartSideBarPropTypes = {
  onBackDropPress: () => void;
  onClose: () => void;
};

const CartSideBar: FC<CartSideBarPropTypes> = ({
  onBackDropPress,
  onClose
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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

  useEffect(() => {
    dispatch(getProductsInCart());
    dispatch(generateCustomerCart());
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [dispatch]);

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

  return (
    <div className={styles.Main}>
      <div className={styles.Back} onClick={() => onBackDropPress()} />
      <div className={styles.Sidebar}>
        <div className={styles.TopNavigation}>
          <p className={styles.NavTitle}>My Cart</p>
          <Image
            src={Close}
            alt="no-image"
            onClick={() => onClose()}
            className={styles.Close}
          />
        </div>
        <div className={cs('witt-container', styles.Content)}>
          {products?.length > 0 && (
            <div className={styles.ProductsLabelContainer}>Products</div>
          )}
          <div className={styles.ProductsList}>
            {products?.map(item => (
              <div key={item?.id}>
                <div className={styles.Product}>
                  <div className={styles.ProductImage}>
                    <Image src={item?.threeKitImage} fill alt="no-image" />
                  </div>
                  <div className={styles.ProductDesc}>
                    <p className={styles.Title}>{item?.product?.name}</p>
                    <div className={styles.Description}>
                      Starting at &nbsp;
                      <p className={styles.BlackText}>{`$${roundPrice(
                        item?.prices?.price?.value
                      )}`}</p>
                    </div>
                    <div className={styles.Table}>
                      {item?.customizable_options?.map(option => (
                        <div className={styles.TableItem} key={option?.id}>
                          <p>{option?.label}</p>
                          <p>{option?.values[0]?.label}</p>
                        </div>
                      ))}
                      <div className={styles.QuantityContainer}>
                        <CircleButton
                          content="-"
                          onPress={() => changeQuantity(item, -1)}
                          disabled={
                            isQuantityDisabled(item?.quantity) ||
                            quantityChangeInProgress(item?.uid)
                          }
                        />
                        <p className={styles.QuantityNumber}>
                          {item?.quantity}
                        </p>
                        <CircleButton
                          content="+"
                          onPress={() => changeQuantity(item, 1)}
                          disabled={quantityChangeInProgress(item?.uid)}
                        />
                        <div
                          className={styles.RemoveProduct}
                          onClick={() =>
                            dispatch(removeProductFromCart(item?.uid))
                          }
                        >
                          Remove Product
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={cs(styles.Table, styles.Table2)}>
                  {item?.customizable_options?.map(option => (
                    <div className={styles.TableItem} key={option?.id}>
                      <p>{option?.label}</p>
                      <p>{option?.values[0]?.label}</p>
                    </div>
                  ))}
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
          </div>
          {materials?.length > 0 && (
            <div
              className={cs(
                styles.ProductsLabelContainer,
                styles.MaterialLabelContainer
              )}
            >
              Materials
            </div>
          )}
          <div className={styles.CartMaterials}>
            {materials?.map(item => (
              <div className={styles.CartMaterialCard} key={item?.uid}>
                <div className={styles.MaterialImage}>
                  <Image src={item?.product?.image?.url} alt="no-image" fill />
                </div>
                <div className={styles.MaterialDesc}>
                  <p className={styles.MaterialTitle}>{item?.product?.name}</p>
                  <div
                    className={styles.RemoveMaterial}
                    onClick={() => dispatch(removeProductFromCart(item?.uid))}
                  >
                    Remove
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className={styles.ContinueButton}
          onClick={() => {
            dispatch(setShowSideBar(false));
            router.push('/request-form');
          }}
        >
          Continue to Request Form
        </div>
      </div>
    </div>
  );
};

export default CartSideBar;
