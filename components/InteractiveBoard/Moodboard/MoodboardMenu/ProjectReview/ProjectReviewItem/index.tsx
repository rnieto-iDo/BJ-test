import { getThreekitAssetById } from 'api/routes/products';
import { fabric } from 'fabric-moodboard';
import { useAppSelector } from 'hooks/reduxOverwriteHooks';
import Image from 'next/image';
import { FC, useCallback, useEffect, useState } from 'react';
import { selectMoodBoardCanvas } from 'store/reducers/moodboardCanvasSlice';
import styles from './ProjectReviewItem.module.scss';

type ProjectReviewItemPropTypes = {
  sku?: string;
  title: string;
  imageUrl: string;
  price: string;
  // eslint-disable-next-line react/require-default-props
  imageRef?: any;
  // eslint-disable-next-line react/require-default-props
  setLoaded?: () => void;
  // eslint-disable-next-line react/require-default-props
  defaultAttributes?: string;
};

const ProjectReviewItem: FC<ProjectReviewItemPropTypes> = ({
  sku,
  title,
  imageUrl,
  price,
  imageRef,
  setLoaded,
  defaultAttributes
}) => {
  const moodboardCanvas: fabric.Canvas = useAppSelector(selectMoodBoardCanvas);
  const [moodboardItem, setMoodboardItem] = useState<any>();
  const [defaultItemAttributes, setDefaultItemAttributes] = useState<any>();
  const [itemAttributes, setItemAttributes] = useState<any>();

  const getDefaultVariantNames = useCallback(async () => {
    if (!defaultAttributes) return;

    try {
      const attributesJson = JSON.parse(defaultAttributes);

      delete attributesJson['Cameras PDP/PLP'];

      const defaultVariantConfiguration = await Promise.all(
        Object.keys(attributesJson).map(async (key: string) => {
          const { assetId } = attributesJson[key];

          const assetObject = await getThreekitAssetById(assetId);

          const { name } = assetObject;

          return { key, name };
        })
      );

      setDefaultItemAttributes(defaultVariantConfiguration);
    } catch (error) {
      /* empty */
    }
  }, [defaultAttributes]);

  const getVariantNames = async targetElement => {
    if (!targetElement.data.threekitConfig?.variant) return null;

    const variants = await Promise.all(
      Object.keys(targetElement.data.threekitConfig?.variant)
        .filter(key => key !== 'Cameras - White Background')
        .map(async (key: string) => {
          const { assetId } =
            // eslint-disable-next-line no-unsafe-optional-chaining
            targetElement?.data?.threekitConfig?.variant[key];

          const assetObject = await getThreekitAssetById(assetId);

          const { name } = assetObject;

          return { key, name };
        })
    );

    return variants;
  };

  const handleOnAdded = useCallback(
    async (event: any) => {
      const targetElement = { ...event?.target };

      if (targetElement?.data?.sku !== sku) return;

      const variantNames = await getVariantNames(targetElement);

      if (!variantNames) return;

      setItemAttributes(variantNames);

      setMoodboardItem({
        ...targetElement
      });
    },
    [sku]
  );

  const handleOnModified = useCallback(
    async (event: any) => {
      const { type } = event;

      console.log('DEsi se');

      if (type !== 'productConfigured') return;

      const targetElement = { ...event?.target };

      if (targetElement?.data?.sku !== sku) return;

      const variantNames = await getVariantNames(targetElement);

      if (!variantNames) return;

      setItemAttributes(variantNames);

      setMoodboardItem({
        ...targetElement
      });
    },
    [sku]
  );

  const detectProductConfigured = useCallback(() => {
    if (!sku || !moodboardCanvas) return;

    moodboardCanvas.on('object:added', handleOnAdded);
    moodboardCanvas.on('object:modified', handleOnModified);
  }, [moodboardCanvas, sku, handleOnModified, handleOnAdded]);

  useEffect(() => {
    getDefaultVariantNames();
  }, [getDefaultVariantNames]);

  useEffect(() => {
    detectProductConfigured();
  }, [detectProductConfigured]);

  return (
    <div id="project-review-item" className={styles.MainContainer}>
      <div className={styles.ContentContainer}>
        {/* <Image src={imageUrl} alt="no-image" height={209} width={209} /> */}
        <div className={styles.ImageContainer} ref={imageRef}>
          <Image
            src={
              moodboardItem?.data?.productImage
                ? moodboardItem?.data?.productImage
                : imageUrl
            }
            fill
            alt="no-image"
            objectFit="cover"
            onLoad={() => setLoaded && setLoaded()}
          />
        </div>
        <div className={styles.DescriptionSection}>
          <div className={styles.Heading}>
            <p className={styles.Title}>{title}</p>
            <div className={styles.SubTitleContainer}>
              <p className={styles.Label}>List Price from </p>
              &nbsp;
              <p>{`$${price}`}</p>
            </div>
          </div>
          {moodboardItem ? (
            <div className={styles.SpecsContainer}>
              {itemAttributes &&
                itemAttributes?.map(item => (
                  <div className={styles.Specs}>
                    <div className={styles.Label}>{item.key}</div>
                    <div className={styles.Value}>{item.name}</div>
                  </div>
                ))}
            </div>
          ) : defaultItemAttributes ? (
            <div className={styles.SpecsContainer}>
              {defaultItemAttributes &&
                defaultItemAttributes?.map(item => (
                  <div className={styles.Specs}>
                    <div className={styles.Label}>{item.key}</div>
                    <div className={styles.Value}>{item.name}</div>
                  </div>
                ))}
            </div>
          ) : (
            <div style={{ margin: 'auto' }}>
              <p>No configuration available for product. </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ProjectReviewItem.defaultProps = {
  sku: undefined
};

export default ProjectReviewItem;
