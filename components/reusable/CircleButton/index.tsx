import { FC } from 'react';
import cs from 'classnames';
import styles from './CircleButton.module.scss';

type CircleButtonPropTypes = {
    content: string;
    disabled?: boolean;
    onPress: () => void;
};

const CircleButton: FC<CircleButtonPropTypes> = ({ content, disabled, onPress }) => (
    <div className={cs(styles.Main, disabled && styles.Disabled)} onClick={() => !disabled && onPress()}>
        {content}
    </div>
);

CircleButton.defaultProps = {
    disabled: false,
};

export default CircleButton;
