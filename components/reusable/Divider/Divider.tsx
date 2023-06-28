import React, { FC } from 'react';
import cs from 'classnames';

import styles from './Divider.module.scss';

type DividerProps = {
    // eslint-disable-next-line react/require-default-props
    className?: string;
};

const Divider: FC<DividerProps> = ({ className }) => (
    <div className={cs(styles.Divider, className)}>
        <hr />
    </div>
);

export default Divider;
