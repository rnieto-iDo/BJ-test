import { SanityImage } from '@/components/reusable/SanityImage/SanityImage';
import React, { FC } from 'react';

import styles from './GalleryDialog.module.scss';

type GalleryDialogProps = {
  images?: Array<any>;
  onImageClicked: (url: string | undefined) => void;
};

const GalleryDialog: FC<GalleryDialogProps> = ({ images, onImageClicked }) => (
  <div className={styles.GalleryDialog}>
    {images?.map(image => (
      <div
        className={styles.ImageContainer}
        onClick={() => onImageClicked(image)}
      >
        <SanityImage key={image.id} image={image} />
      </div>
    ))}
  </div>
);

GalleryDialog.defaultProps = {
  images: []
};

export default GalleryDialog;
