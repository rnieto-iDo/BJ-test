import React, { useState, useEffect } from 'react';
import { ThreekitProvider } from '@threekit-tools/treble/dist';
import { RootState } from '../types/redux.types';
import MenuTab from '../components/planner/MenuTab';
import ProductViewer from '../components/planner/ProductViewer';
import { setCartId } from '../store/reducers/cartSlice';
import { useAppDispatch, useAppSelector } from '../hooks/reduxOverwriteHooks';
import {
  ROOM_PLANNER_CATEGORIES,
  ROOM_PLANNER_MATERIALS,
  MATERIAL_CATEGORY_UID,
  EQUAL_OPERATOR,
  TOTAL_PAGE_SIZE,
  INDEX_PAGE_NUMBER
} from '../constants/api.consts';
import {
  getRoomPlannerProducts,
  setRoomPlannerProducts
} from '../store/reducers/productSlice';
import { ICategory, IProductExtended } from '../interfaces/productInterfaces';
import {
  setIsProductSelected,
  setProductSelectedId
} from '../store/reducers/selectedItemsSlice';
import { getRoomPlannerMaterials } from '../store/reducers/materialSlice';
import SideBar from '../components/planner/SideBar';
import config from '../threekit.config';

const Planner = () => {
  const dispatch = useAppDispatch();
  const isProductSelected = useAppSelector(
    (state: RootState) => state.selectedItems.isProductSelected
  );
  const isThreekitEnv = useAppSelector(
    (state: RootState) => state.canvas.threekitEnv
  );
  const [isOpenMenu, setIsOpenMenu] = useState(true);

  const threekitEnv = process.env.THREEKIT_ENVIRONMENT ?? '';
  // eslint-disable-next-line no-shadow
  enum DISPLAY_OPTIONS {
    WEBGL = 'webgl',
    IMAGE = 'image'
  }

  const handleToggle = () => {
    // eslint-disable-next-line no-unused-expressions
    isProductSelected
      ? (dispatch(setIsProductSelected(false)),
        dispatch(setProductSelectedId(null)))
      : setIsOpenMenu(!isOpenMenu);
  };

  const getProducts = async () => {
    let productList: Array<IProductExtended> = [];
    const response = await dispatch(
      getRoomPlannerProducts(ROOM_PLANNER_CATEGORIES)
    );

    const productsByCategory: Array<ICategory> = response.payload;

    productsByCategory.map(list => {
      list.products.items.map(item => {
        const newItem: IProductExtended = {
          categoryId: list.id,
          categoryName: list.name,
          isSelected: false,
          ...item
        };
        productList = [...productList, newItem];
        return null;
      });
      return null;
    });
    dispatch(setRoomPlannerProducts(productList));
    return null;
  };

  const loadRoomPlannerMaterials = async () => {
    const filters = {
      [MATERIAL_CATEGORY_UID]: {
        [EQUAL_OPERATOR]: ROOM_PLANNER_MATERIALS
      }
    };
    const payload = {
      filters,
      pageSize: TOTAL_PAGE_SIZE,
      currentPage: INDEX_PAGE_NUMBER
    };

    await dispatch(getRoomPlannerMaterials(payload));
  };

  useEffect(() => {
    getProducts();
    loadRoomPlannerMaterials();
    const cartToken = localStorage.getItem('cartToken');
    dispatch(setCartId(cartToken));
  }, []);

  return (
    <section
      className={`mt-20 grid w-full grid-rows-[1fr] overflow-hidden font-haasUnica ${
        isOpenMenu && !isThreekitEnv
          ? 'grid-cols-[1fr,_40%]'
          : 'grid-cols-[1fr,_0%]'
      } `}
    >
      <div
        className={`transition-all duration-500 ease-in-out w-full relative pt-[50px] py-10 pl-10 pr-6${
          isOpenMenu && !isThreekitEnv ? 'col-span-1' : 'col-span-2'
        } row-start-2 row-end-2 bg-[#FBFBF9] flex flex-col items-center justify-center`}
      >
        {/* if is open menu then hidden button and is close menu show button  */}
        {!isOpenMenu && !isThreekitEnv && (
          <button
            onClick={handleToggle}
            className="absolute px-20 py-4 border-2 border-black top-10 right-10"
            type="button"
          >
            Menu
          </button>
        )}
        <ThreekitProvider
          playerConfig={{ display: DISPLAY_OPTIONS.WEBGL }}
          project={config}
          threekitEnv={threekitEnv}
        >
          <ProductViewer />
        </ThreekitProvider>
      </div>

      <div
        className={`transition-all duration-500 ease-in-out w-full relative border-l-2 overflow-hidden ${
          isOpenMenu ? 'col-span-1' : 'hidden'
        } row-start-2 row-end-2`}
      >
        <div className="flex items-center justify-end w-full p-5 py-3 pr-10">
          <button onClick={handleToggle} className="text-3xl" type="button">
            &times;
          </button>
        </div>

        <MenuTab />
        <SideBar callback={handleToggle} />
      </div>
    </section>
  );
};

export default Planner;
