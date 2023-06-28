import { DownOutlined } from '@ant-design/icons';
import { FC, useState } from 'react';
import styles from './Dropdown.module.scss';

type DropDownItemsType = {
  id: string;
  label: string;
  value: string;
};

type DropDownPropTypes = {
  selectedValue: any;
  items: DropDownItemsType[];
  onSelect: (value: any) => void;
};

const Dropdown: FC<DropDownPropTypes> = ({
  selectedValue,
  items,
  onSelect
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  return (
    <div className={styles.Main}>
      <div
        onClick={() => setShowOptions(!showOptions)}
        className={styles.Button}
      >
        {!selectedValue ? 'Select' : selectedValue}
        <DownOutlined rev="" className={styles.DownArrow} />
      </div>
      {showOptions && (
        <div className={styles.Content}>
          {items?.map(item => (
            <div
              key={item?.id}
              onClick={() => {
                setShowOptions(!showOptions);
                onSelect(item?.value);
              }}
              className={styles.Element}
            >
              {item?.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
