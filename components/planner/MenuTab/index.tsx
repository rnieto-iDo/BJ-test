import React, { useState } from 'react';
import { useSelector } from "react-redux";
import AddProducts from "../AddProducts";
import ProjectReview from "../ProjectReview";
import SetDimensions from "../SetDimensions";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxOverwriteHooks";
import { addProductToCart } from "../../../store/reducers/cartSlice";
import { RootState } from "../../../types/redux.types";
import { ICartItems } from '../../../interfaces/cartInterfaces';
import { Check } from '../../../assets/icons';
import Loader from "../Loader/index";

interface Tab {
  id: string;
  title: string;
  content: React.ReactNode;
}

type status = 'idle' | 'loading' | 'succeeded';

const tabs: Tab[] = [
  {
    id: '1',
    title: '1. Set Dimensions',
    content: <SetDimensions />,
  },
  {
    id: '2',
    title: '2. Add Products',
    content: <AddProducts />,
  },
  {
    id: '3',
    title: '3. Planner Summary',
    content: <ProjectReview />,
  },
];

const MenuTab = () => {
  const dispatch = useAppDispatch();
  const cartState = useSelector((state: RootState) => state.cart);
  const selectedItems = useSelector((state: RootState) => state.selectedItems);
  const isProductSelected = useAppSelector((state: RootState) => state.selectedItems.isProductSelected);
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [addToCartStatus, setAddToCartStatus] = useState<status>('idle');

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };

    const handleOnClick = async () => {
        if (parseInt(activeTab, 10) < tabs.length) {
            setActiveTab(tabs[parseInt(activeTab, 10)].id);
        } else {
      setAddToCartStatus("loading");

      const addToCart: ICartItems = {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cartId: cartState.data!,
        products: []
      }

      addToCart.products = selectedItems.products.map((product) => {
        const productCart = {
          quantity: 1,
          sku: product.sku,
          selected_options: product.selectedOptions?.map((option) => (option.valueId))
        }
        return productCart;
      })

      const response = await dispatch(
        addProductToCart(addToCart)
      );

      if (response.meta.requestStatus === "fulfilled") {
        setAddToCartStatus("succeeded");
        setTimeout(() => {
          setAddToCartStatus('idle');
        }, 1000);
      }
    }
  };

  return (
    <form className={`w-full h-[calc(100%_-_76px)] ${isProductSelected ? "hidden pointer-events-none" : ""}`} action="">
      {/* Menu Tabs  */}
      <div className="flex justify-between w-full mb-6 border-b border-black rounded-t">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`${activeTab === tab.id ? 'border-black' : 'inline-block text-[#7C7C7A] border-transparent'} py-2 px-10 font-semibold border-b-2 outline-none`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tabs Content  */}

      <div className="w-full h-[80%]">
        {tabs.map(tab => (
          <div key={tab.id} className={`${activeTab === tab.id ? 'block' : 'hidden'} h-full ${tab.id === '3' && 'pl-6'}`}>
            {tab.content}
          </div>
        ))}
      </div>

      {/* Button next  */}

      <button onClick={handleOnClick} className="absolute bottom-0 z-10 flex items-center justify-center w-full py-4 text-white bg-black" type="button">
        {parseInt(activeTab, 10) !== tabs.length
          ? 'Next'
          :
          addToCartStatus === 'idle' && `Add ${selectedItems.products.length}  Items to Cart` ||
          addToCartStatus === 'loading' && <Loader borderWidth="border-4" height="h-[24px]" width="w-[24px]" color="border-white" /> ||
          addToCartStatus === 'succeeded' && <Check />
        }
      </button>
    </form>
  );
};

export default MenuTab;
