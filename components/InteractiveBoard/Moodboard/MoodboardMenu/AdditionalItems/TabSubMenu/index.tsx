import { FC } from 'react';
import type { TabType } from '../AdditionalItems';
import styles from './TabSubMenu.module.scss';

type TabSubMenuType = {
    items: TabType[];
    selected: string;
};

const TabSubMenu: FC<TabSubMenuType> = ({ items, selected }) => {
    const isActive = (value: boolean) => (value ? styles.TabItemSelected : styles.TabItemNotSelected);

    return (
        <div className={styles.MainContainer}>
            {items?.map((tab: TabType) => (
                <button type="button" className={isActive(selected === tab?.key)} onClick={() => tab?.callBack()}>
                    {tab?.label}
                </button>
            ))}
        </div>
    );
};

export default TabSubMenu;
