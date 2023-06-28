import Image from 'next/image';
import { FC } from 'react';
import cs from 'classnames';
import CheckedBox from '../../../assets/CheckedBox.svg';
import CheckRect from '../../../assets/CheckRect.svg';
import {getKey} from "../../../utils";
import styles from './CheckBox.module.scss';

type CheckBoxTypeProps = {
    checked: boolean;
    label: string;
    // eslint-disable-next-line react/require-default-props
    className?: string;
    onCheck: () => void;
};

const CheckBox: FC<CheckBoxTypeProps> = ({ checked, label, className, onCheck }) => (
    <div key={getKey(`checkbox-key-`)} className={cs(styles.Main, className)}>
        <div className={styles.Image} onClick={() => onCheck()}>
            {checked ? <Image src={CheckedBox?.src} fill alt="no-image" /> : <Image src={CheckRect?.src} fill alt="no-image" />}
        </div>
        <div className={styles.Label}>{label}</div>
    </div>
);

export default CheckBox;
