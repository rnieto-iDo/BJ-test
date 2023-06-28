/* eslint-disable arrow-body-style */
import { Button } from '@witt-team/athens-component-library';
import React, { FC } from 'react';
import cs from 'classnames';

import { useAppSelector } from 'hooks/reduxOverwriteHooks';
import { selectAddToCartStatus } from 'store/reducers/cartSlice';
import styles from './ProductConfiguratorControls.module.scss';

type ProductConfiguratorControlsProps = {
  error?: boolean;
  addToCart?: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  save?: () => void;
  addToProject?: () => void;
};

const ProductConfiguratorControls: FC<ProductConfiguratorControlsProps> = ({
  error,
  addToCart,
  addToProject
}) => {
  const addToCartStatus = useAppSelector(selectAddToCartStatus);
  return (
    <div className={styles.ProductConfiguratorControls}>
      <Button
        onClick={addToCart}
        className={styles.AddToCartButton}
        size="full-width"
        variant={!error ? 'filled' : 'error'}
        inProgress={addToCartStatus === 'loading'}
      >
        Add to Cart
      </Button>
      {error && (
        <div className={styles.MagentoError}>
          <p>{`The product's required option(s) weren't entered. Make sure the options are entered and try again.`}</p>
        </div>
      )}
      <div className={styles.SaveControls}>
        {/* <Button onClick={save} className={cs(styles.TextButton)}>
          Save
        </Button> */}
        {/* <span> or </span> */}
        <Button onClick={addToProject} className={cs(styles.TextButton)}>
          Add to Project
        </Button>
      </div>
    </div>
  );
};

ProductConfiguratorControls.defaultProps = {
  error: false,
  addToCart: () => null,
  save: () => null,
  addToProject: () => null
};

export default ProductConfiguratorControls;
