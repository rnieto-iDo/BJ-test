import { Tabs, TabsProps } from 'antd';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { MOODBOARD_CATEGORIES } from '../../constants/api.consts';
import { useAppDispatch } from '../../hooks/reduxOverwriteHooks';
import {
  ICategory,
  IProjectProductExtended
} from '../../interfaces/productInterfaces';
import {
  getMoodboardProducts,
  setMoodboardProducts
} from '../../store/reducers/productSlice';
import styles from './InteractiveBoard.module.scss';
// import Moodboard from './Moodboard/Moodboard';
// import RoomPlanner from '../../pages/planner';

const Moodboard = dynamic(() => import('./Moodboard/Moodboard'));
const RoomPlanner = dynamic(() => import('../../pages/planner'));

const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Board`,
    children: <Moodboard />
  },
  {
    key: '2',
    label: `Planner`,
    children: <RoomPlanner />
  }
];

const InteractiveBoard = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<string>('1');

  const handelTabChange = (key: string) => {
    setActiveTab(key);
  };

  const getProducts = async () => {
    let productList: Array<IProjectProductExtended> = [];
    const response = await dispatch(getMoodboardProducts(MOODBOARD_CATEGORIES));

    const productsByCategory: Array<ICategory> = response.payload;

    productsByCategory.map(list => {
      list.products.items.map(item => {
        const newItem: IProjectProductExtended = {
          categoryId: list.id,
          categoryName: list.name,
          ...item,
          type: ''
        };
        productList = [...productList, newItem];
        return null;
      });
      return null;
    });
    dispatch(setMoodboardProducts(productList));
    return null;
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.InteractiveBoard}>
      <Tabs
        className={styles.Tabs}
        activeKey={activeTab}
        onChange={handelTabChange}
        items={items}
        tabBarStyle={{ color: 'black' }}
      />
    </div>
  );
};

export default InteractiveBoard;
