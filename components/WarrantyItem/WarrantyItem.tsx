import React, { FC, useEffect, useState } from 'react';
import cs from 'classnames';

import styles from './WarrantyItem.module.scss';

export type WarrantyItemProps = {
  label: string;
  additionalInfo: string;
  value: string;
  noMultiLine?: boolean;
};

const WarrantyItem: FC<WarrantyItemProps> = ({
  label,
  additionalInfo,
  value,
  noMultiLine = false
}) => {
  const [hasMutipleLines, setHasMultipleLines] = useState(false);

  useEffect(() => {
    const splits = value.split('\n');

    const isMultiLines = splits.length > 1;

    setHasMultipleLines(isMultiLines);
  }, [value]);

  return (
    <div className={styles.WarrantyItem}>
      <div className={styles.LabelWrapper}>
        <p className={styles.Label}>{label}</p>
        <p className={styles.LabelAdditionalInfo}>{additionalInfo}</p>
      </div>
      <p
        className={cs(
          styles.Value,
          hasMutipleLines && !noMultiLine ? styles.MultiLine : ''
        )}
      >
        {value}
      </p>
    </div>
  );
};

export default WarrantyItem;
