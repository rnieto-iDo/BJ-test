import Img from 'next/image';
import { FC } from 'react';
import useSanityImageUrlBuilder from '../../../hooks/useSanityImageUrlBuilder';

// If you're using a private dataset you probably have to configure a separate write/read client.
// https://www.sanity.io/help/js-client-usecdn-token

type SanityImageProps = {
    image: any;
};

export const SanityImage: FC<SanityImageProps> = ({ image }) => {
    const { imageUrl, imageRef } = useSanityImageUrlBuilder(image);

    if (!imageUrl) {
        // console.warn('Sanity image url could not be resolved', image);
        return null;
    }

    return (
        // eslint-disable-next-line @next/next/no-img-element
        <Img
            ref={imageRef}
            src={imageUrl}
            alt="not-loaded"
            placeholder="blur"
            style={{ objectFit: 'cover' }}
            fill // layout="fill" prior to Next 13.0.0
            blurDataURL={image.asset.metadata.lqip}
        />
    );
};
