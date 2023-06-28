import { Accordion, Button } from '@witt-team/athens-component-library';
import Link from 'next/link';
import Image from 'next/image';
import { FC, useCallback, useEffect, useState } from 'react';

import {
  selectCollection,
  selectDesigner,
  selectProductAttributesMeta,
  selectSelectedOptions
} from 'store/reducers/productSlice';
import { roundPrice } from 'helpers/utils';
import { getKey } from '../../utils';
import {
  useAppDispatch,
  useAppSelector
} from '../../hooks/reduxOverwriteHooks';
import {
  addProductToCart,
  selectAddToCartStatus,
  selectCartId,
  generateCustomerCart,
  setShowSideBar
} from '../../store/reducers/cartSlice';
import { ICartItems } from '../../interfaces/cartInterfaces';
import ProductConfigurator from '../reusable/ProductConfigurator/ProductConfigurator';
import ProductConfiguratorControls from './ProductConfiguratorControls/ProductConfiguratorControls';
import DownloadForm from './DownloadForm/DownloadForm';
import LoginPopup from './LogInPopup/LoginPopup';
import styles from './MagentoContent.module.scss';
import AddToProjectModal from '../reusable/AddToProjectModal';

type MagentoContentProps = { product: any };

const CONFIGURATOR_ID = 'configurator';

const MagentoContent: FC<MagentoContentProps> = ({ product }) => {
  const [attributes, setAttributes] = useState<any>();
  const [pdpImages, setPdpImages] = useState<any>();
  const [error, setError] = useState<boolean>(false);
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [showLogInPopup, setShowLogInPopup] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const selectedOptions = useAppSelector(selectSelectedOptions);
  const selectedDesigner = useAppSelector(selectDesigner);
  const selectedCollection = useAppSelector(selectCollection);
  const addToCartStatus = useAppSelector(selectAddToCartStatus);
  const productAttributes = useAppSelector(selectProductAttributesMeta);
  const requiredNumberOfOptions = product?.options?.length;

  const attributesStr = product?.visiture_custom_attributes;
  const dispatch = useAppDispatch();
  const selectedCartId = useAppSelector(selectCartId);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserLoggedIn(
        !!(
          localStorage.getItem('token') && localStorage.getItem('token') !== ''
        )
      );
    }
  }, []);

  const fetchPdpImages = useCallback(
    async (threekitImageConfigurations: any) => {
      const { threekit_asset_id_plp_pdp } = attributes;

      if (!threekitImageConfigurations || !threekit_asset_id_plp_pdp) return;

      let images = await Promise.all(
        threekitImageConfigurations.map(async threekitConfig => {
          const endpoint = `https://${process.env.NEXT_PUBLIC_THREEKIT_ENV}/api/layers/layer?`;
          const format = 'png';
          const optimization = {
            format: 'webp',
            quality: 100,
            height: 972,
            width: 972
          };
          const cache = 'true';
          const orgId = process.env.NEXT_PUBLIC_THREEKIT_ORG_ID;
          const url = `${endpoint}format=${format}&optimization=${JSON.stringify(
            optimization
          )}&cache=${cache}&orgId=${orgId}&assetId=${threekit_asset_id_plp_pdp}&assetLayerConfiguration=${JSON.stringify(
            threekitConfig
          )}&bearer_token=${process.env.NEXT_PUBLIC_THREEKIT_TOKEN}`;
          const res = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          const data = await res.json();
          const image = data.url;
          return image;
        })
      );

      // Removing failed to load images
      images = images.filter(image => image);

      setPdpImages(images);
    },
    [attributes]
  );

  const getThreekitImageConfigurations = useCallback(() => {
    const pdpJsonRegex = /threekit_pdp_\d_json/;

    const threekitPdpKeys = Object.keys(attributes).filter(key =>
      key.match(pdpJsonRegex)
    );

    if (!threekitPdpKeys) return null;

    // SAFE METHOD FOR THREEKIT JSON NOT VALID
    const threekitPdpImageConfigurations = threekitPdpKeys
      .filter(key => {
        try {
          JSON.parse(attributes[key]);
          return true;
        } catch (parseError) {
          return false;
        }
      })
      .map(key => JSON.parse(attributes[key]));

    return threekitPdpImageConfigurations;
  }, [attributes]);

  const isNumberOfOptionsValid = () =>
    Object?.values(selectedOptions || {})?.length !== requiredNumberOfOptions;

  const getUidFromOptions = () =>
    Object?.values(selectedOptions || {}).map((item: any) => item?.uid);

  const addToCartSuccess = () => dispatch(setShowSideBar(true));

  const handleAddToCart = () => {
    setError(false);

    if (attributes?.required_options === '1' && isNumberOfOptionsValid()) {
      setError(true);
      return;
    }

    const addProductData: ICartItems = {
      cartId: selectedCartId,
      products: [
        {
          quantity: 1,
          selected_options: getUidFromOptions(),
          sku: product?.sku
        }
      ],
      onSuccess: () => addToCartSuccess()
    };

    dispatch(addProductToCart(addProductData));
  };

  const scrollToConfigurator = () => {
    document
      .getElementById(CONFIGURATOR_ID)
      ?.scrollIntoView({ behavior: 'smooth' });
  };
  const openDownloadForm = () => {
    if (userLoggedIn) {
      setShowDownloadForm(true);
    } else {
      setShowLogInPopup(true);
    }
  };

  const closeDownloadForm = () => {
    setShowDownloadForm(false);
  };

  const closeLoginPopup = () => {
    setShowLogInPopup(false);
  };

  const findAttributeLabel = (code: string) => {
    const attribute = productAttributes?.find(
      item => item?.attribute_code === code
    );
    return attribute?.default_frontend_label;
  };

  const findAttributeValue = (code: string, value: string) => {
    const attribute = productAttributes?.find(
      item => item?.attribute_code === code
    );

    const option = attribute?.options?.find(item => item?.value === `${value}`);

    return option?.label;
  };

  const isNotZero = (value: string) => +value !== 0;

  const renderDimensions = () => (
    <div className={styles.ContentWrapper}>
      {isNotZero(product?.width) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('width')}</p>
          <p className={styles.PairValue}>{product?.width}</p>
        </div>
      )}
      {isNotZero(product?.length) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('length')}</p>
          <p className={styles.PairValue}>{product?.length}</p>
        </div>
      )}
      {isNotZero(product?.seat_depth) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('seat_depth')}</p>
          <p className={styles.PairValue}>{product?.seat_depth}</p>
        </div>
      )}
      {isNotZero(product?.height) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('height')}</p>
          <p className={styles.PairValue}>{product?.height}</p>
        </div>
      )}
      {isNotZero(product?.arm_height) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('arm_height')}</p>
          <p className={styles.PairValue}>{product?.arm_height}</p>
        </div>
      )}
      {isNotZero(product?.seat_height) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>
            {findAttributeLabel('seat_height')}
          </p>
          <p className={styles.PairValue}>{product?.seat_height}</p>
        </div>
      )}
      {isNotZero(product?.weight) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('weight')}</p>
          <p className={styles.PairValue}>{product?.weight}</p>
        </div>
      )}
      {isNotZero(product?.leg_spacing) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>
            {findAttributeLabel('leg_spacing')}
          </p>
          <p className={styles.PairValue}>{product?.leg_spacing}</p>
        </div>
      )}
      {isNotZero(product?.chair_clearance) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>
            {findAttributeLabel('chair_clearance')}
          </p>
          <p className={styles.PairValue}>{product?.chair_clearance}</p>
        </div>
      )}
    </div>
  );

  const renderDetails = () => (
    <div className={styles.ContentWrapper}>
      {isNotZero(product?.style) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>{findAttributeLabel('style')}</p>
          <p className={styles.PairValue}>
            {findAttributeValue('style', product?.style)}
          </p>
        </div>
      )}
      {isNotZero(product?.year_released) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>
            {findAttributeLabel('year_released')}
          </p>
          <p className={styles.PairValue}>
            {findAttributeValue('year_released', product?.year_released)}
          </p>
        </div>
      )}
      {isNotZero(product?.weather_resistant) && (
        <div className={styles.KeyValuePairWrapper}>
          <p className={styles.PairLabel}>
            {findAttributeLabel('weather_resistant')}
          </p>
          <p className={styles.PairValue}>
            {findAttributeValue(
              'weather_resistant',
              product?.weather_resistant
            )}
          </p>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    if (!attributes) return;

    const threekitPdpImageConfigurations = getThreekitImageConfigurations();

    if (!threekitPdpImageConfigurations) return;

    fetchPdpImages(threekitPdpImageConfigurations);
  }, [
    attributes,
    getThreekitImageConfigurations,
    setPdpImages,
    fetchPdpImages
  ]);

  useEffect(() => {
    if (!attributesStr) return;

    const attributesArray = JSON.parse(attributesStr);

    const attributeObj = {};

    attributesArray.forEach(obj => {
      attributeObj[obj.attribute_code] = obj.value;
    });

    setAttributes(attributeObj);
  }, [attributesStr]);

  useEffect(() => {
    dispatch(generateCustomerCart());
  }, [dispatch]);

  //  just to pass lint
  const locationsUrl = '/locations';

  return (
    <div>
      {showModal ? (
        <AddToProjectModal
          visible={showModal}
          productsId={[product?.id]}
          onClose={() => setShowModal(false)}
          onBackDropPress={() => setShowModal(false)}
        />
      ) : null}
      <div className={styles.MagentoContentContainer}>
        <div className={styles.MagentoContentContainerLeft}>
          {pdpImages && pdpImages?.length > 0 ? (
            pdpImages?.map(image => (
              <div key={getKey('threekit-image-')}>
                <Image
                  className={styles.MainImage}
                  src={image}
                  alt="no-image"
                  fill
                />
              </div>
            ))
          ) : (
            <div key={getKey('threekit-image-')}>
              <Image
                className={styles.MainImage}
                src={`${process.env.API_ENDPOINT}/media/catalog/product${attributes?.image}`}
                alt="no-image"
                fill
              />
            </div>
          )}
        </div>
        <div className={styles.MagentoContentContainerRight}>
          <div className={styles.MagentoContentForm}>
            <div className={styles.MagentoContentTitle}>{product?.name}</div>
            <div className={styles.MagentoContentDescription}>
              <div className={styles.MagentoDescriptionTitle}>
                <div className={styles.MagentoTitleLeft}>
                  <span className={styles.label}>
                    {selectedCollection?.name}
                  </span>
                  <span className={styles.MagentoTitleBy}>by</span>
                  <span className={styles.value}>{selectedDesigner?.name}</span>
                </div>
                <div className={styles.MagentoTitleLeft}>
                  <span className={styles.label}>SKU</span>
                  <span className={styles.value}>{product?.sku}</span>
                </div>
                <div className={styles.MagentoTitleRight}>
                  <span>List Price From</span>
                  <span className={styles.rightValue}>{`$${roundPrice(
                    product?.price_range?.minimum_price?.regular_price?.value
                  )}`}</span>
                </div>
              </div>
              <div className={styles.MagentoDescription}>
                {attributes?.marketing_description}
              </div>
              <div className={styles.MagentoPairs}>
                {/* Pairs well with:{' '} */}
                {/* <span className={styles.pairsWith}>Calcutta, H, Moto</span> */}
              </div>
            </div>
            <div className={styles.MagentoAccordionContainer}>
              <Accordion label="DIMENSIONS" className={styles.MagentoAccordion}>
                {renderDimensions()}
              </Accordion>
              <Accordion label="DETAILS" className={styles.MagentoAccordion}>
                {renderDetails()}
              </Accordion>
              <Accordion label="WARRANTY" className={styles.MagentoAccordion}>
                <div className={styles.ContentWrapper}>
                  <div className={styles.KeyValuePairWrapper}>
                    <p className={styles.PairLabel}>Warranty: </p>
                    <p className={styles.PairValue}>
                      {product?.warranty ? (
                        <Link
                          href={`${process.env.API_ENDPOINT}/media/pdf/${product?.warranty}`}
                        >
                          {product?.warranty}
                        </Link>
                      ) : null}
                    </p>
                  </div>
                  <div className={styles.KeyValuePairWrapper}>
                    <p className={styles.PairLabel}>Commercial: </p>
                    <p className={styles.PairValue}>
                      {product?.warranty_commercial ? (
                        <Link
                          href={`${process.env.API_ENDPOINT}/media/pdf/${product?.warranty_commercial}`}
                        >
                          {product?.warranty_commercial}
                        </Link>
                      ) : null}
                    </p>
                  </div>
                  <div className={styles.KeyValuePairWrapper}>
                    <p className={styles.PairLabel}>Consumer: </p>
                    <p className={styles.PairValue}>
                      {product?.warranty_consumer ? (
                        <Link
                          href={`${process.env.API_ENDPOINT}/media/pdf/${product?.warranty_consumer}`}
                        >
                          {product?.warranty_consumer}
                        </Link>
                      ) : null}
                    </p>
                  </div>
                </div>
              </Accordion>
            </div>
            <Button
              className={styles.MagentoAddToCart}
              onClick={() => handleAddToCart()}
              variant={!error ? 'filled' : 'error'}
              inProgress={addToCartStatus === 'loading'}
            >
              <div>Add to Cart</div>
            </Button>
            {error && (
              <div className={styles.MagentoError}>
                <p>{`The product's required option(s) weren't entered. Make sure the options are entered and try again.`}</p>
              </div>
            )}
            <div className={styles.MagentoLeadTime}>
              {product?.lead_time
                ? `Lead time is ${product?.lead_time} weeks.`
                : ''}
              <a href={locationsUrl}>Find where to buy</a>
            </div>
            <div className={styles.MagentoButtons}>
              <Button
                className={styles.MagentoButton}
                onClick={openDownloadForm}
              >
                <div>Downloads</div>
              </Button>
              {showDownloadForm && (
                <DownloadForm
                  product={product}
                  images={pdpImages}
                  onClose={closeDownloadForm}
                />
              )}
              {showLogInPopup && <LoginPopup onClose={closeLoginPopup} />}
              <Button
                className={styles.MagentoButton}
                onClick={() => scrollToConfigurator()}
              >
                <div>Configure</div>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div id="configurator" className={styles.Configure}>
        <ProductConfigurator
          assetId={attributes?.threekit_asset_id}
          controls={
            <ProductConfiguratorControls
              addToCart={() => handleAddToCart()}
              addToProject={() => setShowModal(true)}
              error={error}
            />
          }
        />
      </div>
    </div>
  );
};

export default MagentoContent;
