import { useEffect, useState } from 'react';
import Image from 'next/image';
import cs from 'classnames';
import { Button, Input } from '@witt-team/athens-component-library';
import { useRouter } from 'next/router';
import AddToProjectModal from '@/components/reusable/AddToProjectModal';
import { handleInputNumber, roundPrice } from 'helpers/utils';
import {
  BOTH,
  EMAIL_REGEX,
  MATERIAL_SAMPLE,
  NUMBER_REGEX,
  PHONE_NUMBER_REGEX,
  PRODUCT_QUOTE
} from 'constants/common';
import styles from '../../styles/pages/RequestForm.module.scss';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  getProductsInCart,
  selectCartItems,
  removeProductFromCart,
  updateProductFromCart,
  selectCartId,
  generateCustomerCart,
  selectCartItemsUpdateStatus
} from '../../store/reducers/cartSlice';
import RadioButton from '../../components/reusable/RadioButton';
import type { RequestType } from '../../types/data.types';
import CheckBox from '../../components/reusable/CheckBox';
import {
  setContactInfo,
  setFormState,
  setShippingInfo,
  setProductInfo,
  selectFormState,
  selectContactInfo,
  selectShippingInfo,
  selectProductInfo
} from '../../store/reducers/requestSlice';
import { IUpdateCart } from '../../interfaces/cartInterfaces';
import CircleButton from '../../components/reusable/CircleButton';

const RequestForm = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const cartItems = useAppSelector(selectCartItems);
  const formState = useAppSelector(selectFormState);
  const contactInfo = useAppSelector(selectContactInfo);
  const shippingInfo = useAppSelector(selectShippingInfo);
  const productInfo = useAppSelector(selectProductInfo);
  const cartId = useAppSelector(selectCartId);
  const updateCartStatus = useAppSelector(selectCartItemsUpdateStatus);
  const products = cartItems?.filter(
    item => !item?.product?.categories?.find(cat => cat?.name === 'Materials')
  );
  const materials = cartItems?.filter(item =>
    item?.product?.categories?.find(cat => cat?.name === 'Materials')
  );
  const [selectedUid, setSelectedUid] = useState<string>('');

  // Add to project Modal
  const [showModal, setShowModal] = useState<boolean>(false);

  // Contact Data
  const [requestType, setRequestType] = useState<RequestType>(BOTH);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [newsletter, setNewsletter] = useState<boolean>(true);

  // Shipping Data
  const [address, setAddress] = useState<string>('');
  const [additionalAddress, setAdditionalAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [postCode, setPostCode] = useState<string>('');
  const [country, setCountry] = useState<string>('');

  // Products Data
  const [estimation, setEstimation] = useState<string>('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Edit Sections
  const [editContact, setEditContact] = useState<boolean>(false);
  const [editShipping, setEditShipping] = useState<boolean>(false);
  const [editProduct, setEditProduct] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getProductsInCart());
    dispatch(generateCustomerCart());
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

  const isEmailValid = () => {
    if (!email) return true;
    return EMAIL_REGEX.test(email);
  };

  const isContactButtonDisabled = () =>
    !firstName || !lastName || !email || !phoneNumber || !isEmailValid();
  const isShippingButtonDisabled = () =>
    !address || !additionalAddress || !city || !state || !postCode || !country;

  const navigate = (href: string) => router.push(href);

  const returnProductsArray = () => products?.map(item => item?.product?.id);

  const renderContactForm = () => (
    <div>
      <AddToProjectModal
        productsId={returnProductsArray()}
        visible={showModal}
        onBackDropPress={() => setShowModal(false)}
        onClose={() => setShowModal(false)}
      />
      <div className={styles.RequestSelection}>
        <p className={styles.Label}>I want to request</p>
        <div className={styles.RadioContainer}>
          <RadioButton
            label={PRODUCT_QUOTE}
            checked={requestType === PRODUCT_QUOTE}
            onChecked={() => setRequestType(PRODUCT_QUOTE)}
          />
          <RadioButton
            label={MATERIAL_SAMPLE}
            checked={requestType === MATERIAL_SAMPLE}
            onChecked={() => setRequestType(MATERIAL_SAMPLE)}
          />
          <RadioButton
            label={BOTH}
            checked={requestType === BOTH}
            onChecked={() => setRequestType(BOTH)}
          />
        </div>
      </div>
      <div className={styles.ContactInfo}>
        <p className={styles.Title}>Contact Information</p>
        <div className={styles.InputContainer}>
          <Input
            className={styles.InputField}
            placeholder="First Name"
            value={firstName}
            onChange={e => setFirstName(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="Last Name"
            value={lastName}
            onChange={e => setLastName(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={e => {
              handleInputNumber(e?.target?.value, PHONE_NUMBER_REGEX, () =>
                setPhoneNumber(e?.target?.value)
              );
            }}
          />
          <Input
            className={styles.InputField}
            placeholder="Email"
            value={email}
            status={!isEmailValid() ? 'error' : ''}
            onChange={e => setEmail(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="Job Title (Optional)"
            value={jobTitle}
            onChange={e => setJobTitle(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="Company Name (Optional)"
            value={companyName}
            onChange={e => setCompanyName(e?.target?.value)}
          />
        </div>
        <CheckBox
          checked={newsletter}
          onCheck={() => setNewsletter(!newsletter)}
          label="I would like to subscribe to newsletter and receive marketing emails from Brown Jordan"
        />
      </div>
      <Button
        size="full-width"
        variant="filled"
        disabled={isContactButtonDisabled()}
        className={styles.ContactButton}
        onClick={() => {
          if (!editContact) dispatch(setFormState('Contact'));
          dispatch(
            setContactInfo({
              firstName,
              lastName,
              email,
              phoneNumber,
              jobTitle,
              companyName,
              newsletter,
              requestType
            })
          );
          setEditContact(false);
        }}
      >
        Continue
      </Button>
    </div>
  );

  const renderShippingForm = () => (
    <div>
      <div className={styles.ContactInfo}>
        <p className={styles.Title}>Shipping Information</p>
        <div className={styles.InputContainer}>
          <Input
            className={styles.InputField}
            placeholder="Address"
            value={address}
            onChange={e => setAddress(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="Additional Address"
            value={additionalAddress}
            onChange={e => setAdditionalAddress(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="City"
            value={city}
            onChange={e => setCity(e?.target?.value)}
          />
          <div className={styles.StatePostalCode}>
            <Input
              className={styles.InputField}
              placeholder="State"
              value={state}
              onChange={e => setState(e?.target?.value)}
            />
            <Input
              className={styles.InputField}
              placeholder="Postcode"
              value={postCode}
              onChange={e =>
                handleInputNumber(e?.target?.value, NUMBER_REGEX, () =>
                  setPostCode(e?.target?.value)
                )
              }
            />
          </div>
          <Input
            className={styles.InputField}
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e?.target?.value)}
          />
        </div>
      </div>
      <Button
        size="full-width"
        variant="filled"
        disabled={isShippingButtonDisabled()}
        className={styles.ContactButton}
        onClick={() => {
          if (!editShipping) dispatch(setFormState('Shipping'));
          dispatch(
            setShippingInfo({
              address,
              additionalAddress,
              city,
              state,
              postCode,
              country
            })
          );
          setEditShipping(false);
        }}
      >
        Continue
      </Button>
    </div>
  );

  const renderProductForm = () => (
    <div>
      <div className={styles.ContactInfo}>
        <p className={styles.Title}>Product Information</p>
        <div className={cs(styles.InputContainer, styles.ProductInputFields)}>
          <Input
            className={styles.InputField}
            placeholder="Estimated buying time frame (Optional)"
            value={estimation}
            onChange={e => setEstimation(e?.target?.value)}
          />
          <Input
            className={styles.InputField}
            placeholder="When do you need products by? (Optional)"
            value={deliveryDate}
            onChange={e => setDeliveryDate(e?.target?.value)}
          />
          <Input
            className={cs(styles.InputField, styles.InputFieldArea)}
            placeholder="Notes to Customer Service (Optional)"
            value={notes}
            onChange={e => setNotes(e?.target?.value)}
          />
        </div>
      </div>
      <Button
        size="full-width"
        variant="filled"
        className={cs(styles.ContactButton, styles.ReviewOrder)}
        onClick={() => {
          if (!editProduct) dispatch(setFormState('Product'));
          dispatch(setProductInfo({ estimation, deliveryDate, notes }));
          setEditProduct(false);
        }}
      >
        Review Order
      </Button>
    </div>
  );

  const renderButtons = () => (
    <div>
      <Button
        size="full-width"
        variant="filled"
        disabled={editContact || editProduct || editShipping}
        className={cs(styles.ContactButton)}
        onClick={() => navigate('/request-form/success')}
      >
        Submit Request
      </Button>
      <Button
        size="full-width"
        variant="default"
        onClick={() => {
          setEditContact(true);
          setEditShipping(true);
          setEditProduct(true);
        }}
      >
        Edit Order
      </Button>
    </div>
  );

  const renderReviewRequestForm = () => (
    <div className={styles.ReviewOrderContent}>
      <div className={styles.TitleAndEdit}>
        <div className={styles.Title}>Request</div>
        <div className={cs(styles.Content, styles.ShowHideContent2)}>
          {contactInfo?.requestType === 'Both'
            ? `For Product Quote & Material Sample`
            : contactInfo?.requestType}
        </div>
        <div className={styles.Edit} onClick={() => setEditContact(true)}>
          Edit
        </div>
      </div>
      <div className={cs(styles.Content, styles.ShowHideContent)}>
        {contactInfo?.requestType === 'Both'
          ? `For Product Quote & Material Sample`
          : contactInfo?.requestType}
      </div>
    </div>
  );

  const renderReviewContactForm = () => (
    <div>
      {renderReviewRequestForm()}
      <div className={styles.ReviewOrderContent}>
        <div className={styles.TitleAndEdit}>
          <div className={styles.Title}>Contact</div>
          <div className={cs(styles.Content, styles.ShowHideContent2)}>
            <div>{`${contactInfo?.firstName}  ${contactInfo?.lastName}`}</div>
            <div>{contactInfo?.phoneNumber}</div>
            <div>{contactInfo?.email}</div>
            <div>{contactInfo?.jobTitle}</div>
            <div>{contactInfo?.companyName}</div>
          </div>
          <div className={styles.Edit} onClick={() => setEditContact(true)}>
            Edit
          </div>
        </div>
        <div className={cs(styles.Content, styles.ShowHideContent)}>
          <div>{`${contactInfo?.firstName}  ${contactInfo?.lastName}`}</div>
          <div>{contactInfo?.phoneNumber}</div>
          <div>{contactInfo?.email}</div>
          <div>{contactInfo?.jobTitle}</div>
          <div>{contactInfo?.companyName}</div>
        </div>
      </div>
    </div>
  );

  const renderReviewShippingForm = () => (
    <div className={styles.ReviewOrderContent}>
      <div className={styles.TitleAndEdit}>
        <div className={styles.Title}>Shipping</div>
        <div className={cs(styles.Content, styles.ShowHideContent2)}>
          <div>{shippingInfo?.address}</div>
          <div>{shippingInfo?.additionalAddress}</div>
          <div>{shippingInfo?.state}</div>
          <div>{shippingInfo?.city}</div>
          <div>{shippingInfo?.postCode}</div>
          <div>{shippingInfo?.country}</div>
        </div>
        <div className={styles.Edit} onClick={() => setEditShipping(true)}>
          Edit
        </div>
      </div>
      <div className={cs(styles.Content, styles.ShowHideContent)}>
        <div>{shippingInfo?.address}</div>
        <div>{shippingInfo?.additionalAddress}</div>
        <div>{shippingInfo?.state}</div>
        <div>{shippingInfo?.city}</div>
        <div>{shippingInfo?.postCode}</div>
        <div>{shippingInfo?.country}</div>
      </div>
    </div>
  );

  const renderReviewProductForm = () => (
    <div className={styles.ReviewOrderContent}>
      <div className={styles.TitleAndEdit}>
        <div className={styles.Title}>Product</div>
        <div className={cs(styles.Content, styles.ShowHideContent2)}>
          <div>{productInfo?.notes}</div>
          <div>{productInfo?.estimation}</div>
          <div>{productInfo?.deliveryDate}</div>
        </div>
        <div className={styles.Edit} onClick={() => setEditProduct(true)}>
          Edit
        </div>
      </div>
      <div className={cs(styles.Content, styles.ShowHideContent)}>
        <div>{productInfo?.notes}</div>
        <div>{productInfo?.estimation}</div>
        <div>{productInfo?.deliveryDate}</div>
      </div>
    </div>
  );

  return (
    <div className={styles.Main}>
      <div className={cs(styles.PageContent)}>
        <div className={cs(styles.Form, 'witt-container')}>
          <p className={styles.Title}>Request Form</p>
          <p className={styles.SubTitle}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Metus non
            venenatis viverra cras. Netus porttitor egestas id etiam maecenas.
            Leo egestas donec consequat sed elementum et. Lorem ipsum dolor sit
            amet, consectetur adipiscing elit. Metus non venenatis viverra.
          </p>
          <div className={cs(styles.FormContent, styles.FormContentShowHide2)}>
            {formState === '' || editContact
              ? renderContactForm()
              : renderReviewContactForm()}
            {formState === 'Contact' || editShipping
              ? renderShippingForm()
              : shippingInfo?.address && renderReviewShippingForm()}
            {formState === 'Shipping' || editProduct
              ? renderProductForm()
              : formState === 'Product' && renderReviewProductForm()}
            {formState === 'Product' && renderButtons()}
          </div>
        </div>
        <div className={cs(styles.Cart, 'witt-container')}>
          <div className={styles.TopContainer}>
            <p className={styles.CartQuantity}>{cartItems?.length} items</p>
            <div className={styles.SaveOrAdd}>
              <p className={styles.Link}>Save</p>&nbsp;or&nbsp;
              {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
              <p className={styles.Link} onClick={() => setShowModal(true)}>
                Add to Project
              </p>
            </div>
          </div>
          <div className={styles.SectionLabel}>Products</div>
          {products?.map(item => (
            <div key={item?.id} className={styles.ProductCard}>
              <div className={styles.ProductDetails}>
                <div className={styles.ProductTitle}>
                  <p className={cs(styles.ShowHideTitle, styles.CursorTitle)}>
                    {item?.product?.name}
                  </p>
                  <p
                    className={cs(styles.GrayText, styles.ShowHideTitle)}
                  >{`SKU ${item?.product?.sku}`}</p>
                  <div
                    className={cs(styles.ProductPrice, styles.ShowHideTitle)}
                  >
                    <p className={cs(styles.GrayText, styles.ShowHideTitle)}>
                      Starting at
                    </p>
                    &nbsp;
                    <p className={styles.ShowHideTitle}>
                      ${roundPrice(item?.prices?.price?.value)}
                    </p>
                  </div>
                  <div className={styles.Image}>
                    <Image fill src={item?.threeKitImage} alt="no-image" />
                  </div>
                </div>
                <div className={styles.ProductSpecs}>
                  <div>
                    <p
                      className={cs(styles.ShowHideTitle2, styles.CursorTitle)}
                    >
                      {item?.product?.name}
                    </p>
                    <p
                      className={cs(styles.GrayText, styles.ShowHideTitle2)}
                    >{`SKU ${item?.product?.sku}`}</p>
                    <div
                      className={cs(styles.ProductPrice, styles.ShowHideTitle2)}
                    >
                      <p className={cs(styles.GrayText, styles.ShowHideTitle2)}>
                        Starting at
                      </p>
                      &nbsp;
                      <p className={styles.ShowHideTitle2}>
                        ${roundPrice(item?.prices?.price?.value)}
                      </p>
                    </div>
                  </div>
                  <div className={styles.Configure}>Configure</div>
                  <div className={styles.ShowHideTableAndQuantity2}>
                    {item?.customizable_options?.length > 0 && (
                      <div className={styles.Table}>
                        {item?.customizable_options?.map(option => (
                          <div>
                            <div className={styles.TableItem}>
                              <p>{option?.label}</p>
                              <p>{option?.values[0]?.label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
              <div className={styles.ShowHideTableAndQuantity}>
                {item?.customizable_options?.length > 0 && (
                  <div className={styles.Table}>
                    {item?.customizable_options?.map(option => (
                      <div>
                        <div className={styles.TableItem}>
                          <p>{option?.label}</p>
                          <p>{option?.values[0]?.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
          {/* <div
            className={styles.AddProduct}
            onClick={() => navigate('/products')}
          >
            + Add Product
          </div> */}
          <div
            className={cs(styles.SectionLabel, styles.MaterialsSectionLabel)}
          >
            Materials
          </div>
          <div className={styles.CartMaterials}>
            {materials?.map(item => (
              <div className={styles.CartMaterialCard} key={item?.uid}>
                <div className={styles.MaterialImage}>
                  <Image src={item?.product?.image?.url} alt="no-image" fill />
                </div>
                <div className={styles.MaterialDesc}>
                  <div>
                    <p className={cs(styles.MaterialTitle, styles.CursorTitle)}>
                      {item?.product?.name}
                    </p>
                    <p
                      className={styles.MaterialSKU}
                    >{`SKU ${item?.product?.sku}`}</p>
                  </div>
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
          <div
            className={styles.AddMaterials}
            onClick={() => navigate('/materials')}
          >
            + Add Materials
          </div>
        </div>
      </div>
      <div
        className={cs(
          styles.FormContent,
          'witt-container',
          styles.FormContentShowHide
        )}
      >
        {formState === '' || editContact
          ? renderContactForm()
          : renderReviewContactForm()}
        {formState === 'Contact' || editShipping
          ? renderShippingForm()
          : shippingInfo?.address && renderReviewShippingForm()}
        {formState === 'Shipping' || editProduct
          ? renderProductForm()
          : formState === 'Product' && renderReviewProductForm()}
        {formState === 'Product' && renderButtons()}
      </div>
    </div>
  );
};

export default RequestForm;
