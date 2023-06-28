import { FC } from 'react';
import styles from './RadioButton.module.scss';

type RadioButtonPropTypes = {
    checked: boolean;
    label: string;
    onChecked: () => void;
};

const RadioButton: FC<RadioButtonPropTypes> = ({ checked, label, onChecked }) => (
    <div className={styles.Main}>
        <div className={styles.Empty} onClick={() => onChecked()}>
            {checked && <div className={styles.Selected} />}
        </div>
        <div className={styles.Label}>{label}</div>
    </div>
);

export default RadioButton;
