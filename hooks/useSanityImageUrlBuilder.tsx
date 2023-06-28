import imageUrlBuilder from '@sanity/image-url';
import { useCallback, useEffect, useState } from 'react';
import sanityClient from '../api/sanityClient';
import useScreenResolution from './useScreenResolution';

type Asset = {
  url: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
      aspectRatio: number;
    };
  };
};

type Hotspot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Crop = {
  bottom: number;
  left: number;
  right: number;
  top: number;
};

type ImageProps = {
  asset: Asset;
  hotspot?: Hotspot;
  crop?: Crop;
};

export type ImageIdParts = {
  assetId: string;
  dimensions: {
    height: number;
    width: number;
    //    aspectRatio: number
  };
  format: string;
};

export const buildRectFromCropData = (
  /** Source/original image dimensions */
  dimensions: { width: number; height: number },
  crop: Crop
): [number, number, number, number] => {
  //  const { width, height } = croppedImageSize(dimensions, crop)

  if (crop.left + crop.right >= 1 || crop.top + crop.bottom >= 1) {
    throw new Error(
      `Invalid crop: ${JSON.stringify(crop)}; crop values must be less than 1`
    );
  }

  const width = Math.round(dimensions.width * (1 - crop.left - crop.right));
  const height = Math.round(dimensions.height * (1 - crop.top - crop.bottom));
  //    const aspectRatio = width / height

  return [
    Math.round(crop.left * dimensions.width),
    Math.round(crop.top * dimensions.height),
    width,
    height
  ]; //    .join(",")
};

const useSanityImageUrlBuilder = ({
  asset: { url, metadata },
  hotspot,
  crop
}: ImageProps) => {
  const [parentWidth, setParentWidth] = useState<any>();
  const [parentHeight, setParentHeight] = useState<any>();
  const [imageUrl, setImageUrl] = useState<string>('');
  const { width, height } = useScreenResolution();

  const imageRef = useCallback(
    (node: any) => {
      if (node !== null) {
        setParentWidth(node.getBoundingClientRect()?.width);
        setParentHeight(node.getBoundingClientRect().height);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [width, height]
  );

  useEffect(() => {
    const builder = imageUrlBuilder(sanityClient);
    let urlFor = builder.image(url).crop('focalpoint').auto('format');

    if (parentWidth && parentHeight) {
      if (hotspot) {
        const scaledWidth = Math.round(parentWidth ?? width / hotspot.width);
        const scaledHeight = Math.round(
          parentHeight ?? height / hotspot.height
        );
        urlFor = urlFor
          .size(scaledWidth, scaledHeight)
          .focalPoint(hotspot.x, hotspot.y)
          .fit('crop');
      }
      if (crop) {
        const originalDimensions = metadata?.dimensions as {
          width: number;
          height: number;
        };

        const [left, top, finalWidth, finalHeight] = buildRectFromCropData(
          originalDimensions,
          crop
        );
        urlFor = urlFor.rect(left, top, finalWidth, finalHeight);
      }
    }

    const newImageUrl: string = urlFor.url();
    setImageUrl(newImageUrl);
  }, [url, width, height, hotspot, parentWidth, parentHeight, metadata, crop]);

  return { imageUrl, imageRef };
};

export default useSanityImageUrlBuilder;
