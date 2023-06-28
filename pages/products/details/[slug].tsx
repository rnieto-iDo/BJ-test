import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import SeoMetaData from '@/components/globals/SeoMetaData';
import MagentoContent from '@/components/ProductsDetails/MagentoContent';
import MaterialsListing from '@/components/reusable/MaterialsListing';
import styles from '@/styles/pages/ProductDetails.module.scss';
import ThreeImagesTwoAboveOneBelow from 'blocks/image-blocks/three-images-two-above-one-below/ThreeImagesTwoAboveOneBelow';
import LineSeparatorBlock from 'blocks/separator-blocks/line-separator-block/LineSeparatorBlock';
import ThreeImagesTwoLeftOneRight from 'blocks/image-blocks/three-images-two-left-one-right/ThreeImagesTwoLeftOneRight';
import BigImageTitleDescLinkBlock from 'blocks/image-blocks/big-image-with-title-desc-link/BigImageTitleDescLinkBlock';
import BigImageWithContentAndCard from 'blocks/image-blocks/big-image-with-content-and-card/BigImageWithContentAndCard';
import BigImageWithTitleAndLinkBottom from 'blocks/image-blocks/big-image-with-title-and-link-bottom/BigImageWithTitleAndLinkBottom';
import FourImageWithTwoImageGrid from 'blocks/image-blocks/four-image-two-image-grid/FourImageTwoImageGrid';
import Spinner from '@/components/reusable/Spinner/Spinner';
import {
  getProducts,
  selectMaterialListing,
  selectProductsData,
  resetProductState,
  selectCollection,
  selectDesigner
} from '../../../store/reducers/productSlice';
import {
  getProductDetailsPageContent,
  selectProductDetailsCMSData
} from '../../../store/reducers/pageSlice';
import {
  useAppDispatch,
  useAppSelector
} from '../../../hooks/reduxOverwriteHooks';

const LinkTypes = {
  COLLECTION: 'collection',
  DESIGNER: 'designer'
};

const ProductDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const productData = useAppSelector(selectProductsData);
  const materialsListing = useAppSelector(selectMaterialListing);
  const productCollection = useAppSelector(selectCollection);
  const productDesigner = useAppSelector(selectDesigner);
  const product = productData[0];
  const dispatch = useAppDispatch();
  const cmsData = useAppSelector(selectProductDetailsCMSData);

  useEffect(() => {
    if (!slug) return;
    dispatch(
      getProducts({
        filter: {
          url_key: {
            eq: slug
          }
        }
      })
    );

    // eslint-disable-next-line consistent-return
    return () => {
      dispatch(resetProductState());
    };
  }, [dispatch, slug]);

  useEffect(() => {
    if (!slug) return;
    dispatch(getProductDetailsPageContent(slug));
  }, [slug, dispatch]);

  const getFormatedLink = (type: string, magentoCategory: any) => {
    let ret = '#';
    if (magentoCategory?.url_key) {
      if (type === LinkTypes.COLLECTION) {
        ret = `/collections/${magentoCategory?.url_key}`;
      } else if (type === LinkTypes.DESIGNER) {
        ret = `/designers/${magentoCategory?.url_key}`;
      } else {
        ret = magentoCategory?.url_key;
      }
    }
    return ret;
  };

  const formatDataForCardArray = (data: any) =>
    data?.map(item => ({
      title: item?.name,
      description: '',
      id: item?.id,
      image: item?.image?.url,
      onClick: () => router?.push(`./product/details/${item?.url_key}`)
    }));

  if (!product) return <Spinner />;

  return (
    <div className={styles.ProductDetail}>
      <SeoMetaData
        title={cmsData?.seo?.title}
        description={cmsData?.seo?.description}
        keywords={cmsData?.seo?.keywords}
      />
      <MagentoContent product={product} />
      {cmsData?.featuredImages && (
        <div>
          <ThreeImagesTwoAboveOneBelow
            firstImage={cmsData?.featuredImages[0]}
            secondImage={cmsData?.featuredImages[1]}
            thirdImage={cmsData?.featuredImages[2]}
          />
          <LineSeparatorBlock />
        </div>
      )}
      {cmsData?.productFeatures && (
        <div>
          <ThreeImagesTwoLeftOneRight
            title={cmsData?.productFeatures?.title}
            firstImage={cmsData?.productFeatures?.features[0]}
            secondImage={cmsData?.productFeatures?.features[1]}
            thirdImage={cmsData?.productFeatures?.features[2]}
          />
          <LineSeparatorBlock />
        </div>
      )}
      <div className="witt-container">
        <MaterialsListing
          title="Materials"
          subTitle="Materials sample requests can be added to your cart in the  Materials section"
          materials={materialsListing}
        />
      </div>
      {cmsData?.exploreSection && (
        <BigImageTitleDescLinkBlock
          title={cmsData?.exploreSection?.title}
          description={cmsData?.exploreSection?.description}
          image={cmsData?.exploreSection?.image}
          backgroundColor={cmsData?.exploreSection?.backgroundColor}
          textColor="#fff"
          linkText={cmsData?.exploreSection?.link?.text}
          linkUrl={cmsData?.exploreSection?.link?.url ?? ''}
        />
      )}
      {productCollection && (
        <BigImageWithTitleAndLinkBottom
          title={`The ${productCollection?.name} Collection`}
          subTitle="Explore now"
          subTitleLink={getFormatedLink(
            LinkTypes.COLLECTION,
            productCollection
          )}
          backgroundImage={productCollection?.image}
        />
      )}
      {productDesigner && (
        <div>
          <BigImageWithContentAndCard
            title="About the Designer"
            description={productDesigner?.description}
            card={{
              title: productDesigner?.name,
              description: '',
              image: productDesigner?.image || ''
            }}
            link={{
              url: getFormatedLink(LinkTypes.DESIGNER, productDesigner),
              text: 'Go to Designer Page'
            }}
          />
          <LineSeparatorBlock />
        </div>
      )}
      <FourImageWithTwoImageGrid
        cardArray={formatDataForCardArray(productData[0]?.upsell_products)}
        title="Related Products"
      />
      {cmsData?.retailerLocations && (
        <BigImageTitleDescLinkBlock
          title={cmsData?.retailerLocations?.title}
          backgroundColor={cmsData?.retailerLocations?.backgroundColor}
          textColor="#fff"
          linkText={cmsData?.retailerLocations?.link?.text}
          linkUrl={cmsData?.retailerLocations?.link?.url ?? ''}
          size="medium"
        />
      )}
    </div>
  );
};

export default ProductDetail;
