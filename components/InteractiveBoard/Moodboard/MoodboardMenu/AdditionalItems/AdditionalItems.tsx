import { useState } from 'react';
import styles from './AdditionalItems.module.scss';
import TabSubMenu from './TabSubMenu';
import AddProducts from './AddProducts';
import UploadImage from './UploadImage';

export type TabType = {
    label: string;
    key: string;
    callBack: () => void;
};

const AdditionalItems = () => {
    const [activeTab, setActiveTab] = useState<string>('1');
    const TAB_ITEMS: TabType[] = [
        { key: '1', label: 'Add Products', callBack: () => setActiveTab('1') },
        { key: '2', label: 'Upload Image', callBack: () => setActiveTab('2') },
    ];

    return (
        <div className={styles.MainContainer}>
            <TabSubMenu items={TAB_ITEMS} selected={activeTab} />
            {activeTab === '1' ? <AddProducts /> : <UploadImage />}
        </div>
    );
};

export default AdditionalItems;
