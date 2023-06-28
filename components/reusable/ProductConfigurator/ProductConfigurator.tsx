import { Player, ThreekitProvider } from '@threekit-tools/treble/dist';
import cs from 'classnames';
import { FC, ReactNode } from 'react';

import styles from './ProductConfigurator.module.scss';
import ProductOptions from './ProductOptions/ProductOptions';

type ProductConfiguratorProps = {
  assetId: string;
  controls: ReactNode;
  customClassName?: string;
};

const ProductConfigurator: FC<ProductConfiguratorProps> = ({
  assetId,
  controls,
  customClassName
}) => {
  if (!assetId) return null;

  const projects = {
    credentials: {
      preview: {
        orgId: process.env.NEXT_PUBLIC_THREEKIT_ORG_ID ?? '',
        publicToken: process.env.NEXT_PUBLIC_THREEKIT_TOKEN ?? ''
      }
    },
    products: {
      preview: {
        assetId
      }
    }
  };

  return (
    <div className={cs(styles.ProductConfigurator, customClassName)}>
      <ThreekitProvider project={projects} threekitEnv="preview">
        <div className={styles.ProductViewer}>
          <Player minHeight="unset" />
        </div>
        <ProductOptions controls={controls} />
      </ThreekitProvider>
    </div>
  );
};

ProductConfigurator.defaultProps = {
  customClassName: undefined
};

export default ProductConfigurator;
