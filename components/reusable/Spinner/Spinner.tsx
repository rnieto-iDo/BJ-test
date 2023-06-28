import React, { CSSProperties } from 'react';
import { ClipLoader } from 'react-spinners';

import styles from './Spinner.module.scss';

const override: CSSProperties = {
  display: 'block',
  position: 'absolute',
  top: 'calc(50% - 75px)',
  left: 'calc(50% - 75px)'
};

const Spinner = () => (
  <div className={styles.Spinner}>
    <ClipLoader
      cssOverride={override}
      color="000000"
      className={styles.WittSpinner}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  </div>
);

export default Spinner;
