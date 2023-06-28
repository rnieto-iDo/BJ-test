import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Accordion, Button } from '@witt-team/athens-component-library';
import SeoMetaData from '@/components/globals/SeoMetaData';

import Spinner from '@/components/reusable/Spinner/Spinner';
import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';
import {
  addProductToCart,
  selectCartId,
  generateCustomerCart,
  setShowSideBar,
  selectAddToCartStatus
} from '../../../store/reducers/cartSlice';
import Custom404 from '../../404';
import {
  getProducts,
  resetProductState,
  selectProductAttributesMeta,
  selectProductsData,
  selectStatus
} from '../../../store/reducers/productSlice';
import { getKey } from '../../../utils';
import styles from '../../../styles/pages/MaterialDetails.module.scss';
import { ICartItems } from '../../../interfaces/cartInterfaces';

const AcordionAttribute: any = (props: {
  name: string;
  value: number | string;
}) => (
  <div className={styles.KeyValuePairWrapper}>
    <p className={styles.PairLabel}>{props?.name}:</p>
    <p className={styles.PairValue}>{props?.value}</p>
  </div>
);

const MaterialDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const dispatch = useAppDispatch();
  const materialData = useAppSelector(selectProductsData)[0] ?? null;
  const attributeMeta = useAppSelector(selectProductAttributesMeta) ?? null;
  const [customAttributes, setCustomAttributes] = useState<any>();
  const dataFetchStatus = useAppSelector(selectStatus);
  const selectedCartId = useAppSelector(selectCartId);
  const addToCartStatus = useAppSelector(selectAddToCartStatus);
  const [cardError, setCardError] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;

    const payload = {
      filter: {
        url_key: {
          eq: slug
        }
      }
    };
    dispatch(getProducts(payload));

    // eslint-disable-next-line consistent-return
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch, slug]);

  const getMaterialCategoryName = () => {
    const cat = materialData?.categories?.filter(
      (category: any) =>
        category?.name !== 'Materials' &&
        category?.name !== 'Textiles' &&
        category?.name !== 'Non Textiles'
    )[0];

    return cat?.name ?? 'No Category';
  };

  const getAttributeMeta = (name: string) => {
    const data = attributeMeta?.filter(
      attr => attr?.attribute_code === name
    )[0];
    return data;
  };

  const getAttributeLabel = name => {
    const meta = getAttributeMeta(name);
    return meta?.default_frontend_label;
  };

  const getAttributeValue = name => {
    const meta = getAttributeMeta(name);

    const attribute = customAttributes?.filter(
      (attr: any) => attr?.attribute_code === name
    )[0];

    if (!meta?.options) {
      return attribute?.value ?? '';
    }

    const metaValue =
      meta?.options?.filter(
        (option: any) => attribute?.value && option?.value === attribute.value
      )[0] ?? '';

    return metaValue?.label ?? '';
  };

  useEffect(() => {
    if (!materialData) return;
    setCustomAttributes(JSON.parse(materialData?.visiture_custom_attributes));
  }, [dispatch, materialData]);

  const addToCartSuccess = () => dispatch(setShowSideBar(true));

  const handleAddToCart = () => {
    setCardError(false);

    const addProductData: ICartItems = {
      cartId: selectedCartId,
      products: [
        {
          quantity: 1,
          sku: materialData?.sku
        }
      ],
      onSuccess: () => addToCartSuccess(),
      onFailed: () => setCardError(true)
    };

    dispatch(addProductToCart(addProductData));
  };

  useEffect(() => {
    dispatch(generateCustomerCart());
  }, [dispatch]);

  if (materialData === null && dataFetchStatus === 'succeeded') {
    return <Custom404 />;
  }

  if (!materialData) return <Spinner />;
  return (
    <>
      <SeoMetaData />

      <div className={styles.MaterialDetail}>
        <div className={styles.MagentoContentContainer}>
          {/* <SeoMetaData title={cmsData?.seo?.title} description={cmsData?.seo?.description} keywords={cmsData?.seo?.keywords} /> */}
          <div className={styles.MagentoContentContainerLeft}>
            {materialData?.media_gallery?.map((image: any, index: number) => (
              <div
                key={getKey(`image-${index}`)}
                className={styles.ImagePlaceholder}
              >
                <Image
                  className={styles.MainImage}
                  src={image.url}
                  alt="no-image"
                  fill
                  priority
                />
              </div>
            )) ?? null}
          </div>
          <div className={styles.MagentoContentContainerRight}>
            <div className={styles.MagentoContentForm}>
              <div className={styles.MagentoContentTitle}>
                {materialData?.name}
              </div>
              <div className={styles.MagentoContentDescription}>
                <div className={styles.MagentoDescriptionTitle}>
                  <div className={styles.MagentoTitleLeft}>
                    <span className={styles.label}>
                      {getMaterialCategoryName()}
                    </span>
                  </div>
                </div>
                <div className={styles.MagentoDescription}>
                  {materialData?.meta_description}
                </div>
              </div>
              <div className={styles.MagentoAccordionContainer}>
                <Accordion
                  label="SPECIFICATIONS"
                  className={styles.MagentoAccordion}
                >
                  <div style={{ marginBottom: 10 }}>
                    <AcordionAttribute
                      name={getAttributeLabel('construction')}
                      value={getAttributeValue('construction')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('fabric_type')}
                      value={getAttributeValue('fabric_type')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('grade')}
                      value={getAttributeValue('grade')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('use')}
                      value={getAttributeValue('use')}
                    />
                  </div>
                </Accordion>
                <Accordion
                  label="PERFORMANCE"
                  className={styles.MagentoAccordion}
                >
                  <div style={{ marginBottom: 10 }}>
                    <AcordionAttribute
                      name={getAttributeLabel('moldmildew_resistant')}
                      value={getAttributeValue('moldmildew_resistant')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('tear_resistance')}
                      value={getAttributeValue('tear_resistance')}
                    />
                  </div>
                </Accordion>
                <Accordion label="DETAILS" className={styles.MagentoAccordion}>
                  <div style={{ marginBottom: 10 }}>
                    <AcordionAttribute
                      name={getAttributeLabel('abrasion')}
                      value={getAttributeValue('abrasion')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('color')}
                      value={getAttributeValue('color')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('manufacturer')}
                      value={getAttributeValue('manufacturer')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('option_subgroup')}
                      value={getAttributeValue('option_subgroup')}
                    />
                    <AcordionAttribute
                      name={getAttributeLabel('weather_resistant')}
                      value={getAttributeValue('weather_resistant')}
                    />
                  </div>
                </Accordion>
              </div>
              <Button
                className={styles.MagentoAddToCart}
                onClick={() => handleAddToCart()}
                variant={!cardError ? 'filled' : 'error'}
                inProgress={addToCartStatus === 'loading'}
              >
                <div>Add to Cart</div>
              </Button>
              {cardError && (
                <div className={styles.MagentoError}>
                  <p>Material has not been added to the cart</p>
                </div>
              )}
              <div className={styles.MagentoLeadTime}>
                {materialData?.lead_time
                  ? `Lead time is ${materialData?.lead_time} weeks.`
                  : ''}
              </div>
              <div className={styles.MagentoButtons}>
                {/* <Button className={styles.MagentoButton}> */}
                {/*    <div>Downloads</div> */}
                {/* </Button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaterialDetail;
