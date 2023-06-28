import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../../../hooks/reduxOverwriteHooks';
import Materials from '../Materials';
import {
  IProductExtended,
  IOption,
  ISelectedOption
} from '../../../interfaces/productInterfaces';
import { RootState } from '../../../types/redux.types';

interface ISideBard {
  callback: () => void;
}

const SideBar = ({ callback }: ISideBard) => {
  const products: Array<IProductExtended> = useAppSelector(
    (state: RootState) => state.selectedItems.products
  );
  const productSelectedId = useAppSelector(
    (state: RootState) => state.selectedItems.productSelectedId
  );
  const isProductSelected: boolean | null = useAppSelector(
    (state: RootState) => state.selectedItems.isProductSelected
  );

  const [options, setOptions] = useState<Array<IOption>>();
  const [selectedOptions, setSelectedOptions] =
    useState<Array<ISelectedOption>>();
  const [activeTab, setActiveTab] = useState<string>();

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  const handletoggle = () => {
    callback();
  };

  useEffect(() => {
    if (isProductSelected) {
      const product = products.find(
        productRedux => productRedux.id === productSelectedId
      );
      if (product) {
        setOptions(product?.options);
        setSelectedOptions(product?.selectedOptions);
        setActiveTab(product?.options[0].option_id);
      }
    }
  }, [isProductSelected, productSelectedId]);

  return (
    <form
      className={`w-full h-[calc(100%_-_76px)] ${
        isProductSelected ? '' : 'hidden pointer-events-none'
      }`}
      action=""
    >
      {/* Menu Tabs  */}
      <div className="flex justify-around w-full mb-6 border-b border-black rounded-t">
        {options &&
          selectedOptions &&
          options.map(tab => (
            <button
              key={tab.option_id}
              name={tab.title}
              type="button"
              className={`${
                activeTab === tab.option_id
                  ? 'border-black'
                  : 'inline-block text-[#7C7C7A] border-transparent'
              } py-2 px-10 font-semibold border-b-2 outline-none`}
              onClick={() => handleTabClick(tab.option_id)}
            >
              {tab.title}
            </button>
          ))}
      </div>
      {/* Tabs Content  */}

      <div className="w-full h-[80%]">
        {options &&
          selectedOptions &&
          options.map((tab, index) => (
            <div
              key={tab.option_id}
              className={`${
                activeTab === tab.option_id ? 'block' : 'hidden'
              } h-full ${tab.option_id === '3' && 'pl-6'}`}
            >
              <Materials
                options={tab}
                selectedOptions={selectedOptions[index]}
              />
              <button
                className="absolute bottom-0 z-10 flex items-center justify-center w-full py-4 text-white bg-black"
                type="button"
                onClick={handletoggle}
              >
                Close
              </button>
            </div>
          ))}
      </div>
    </form>
  );
};

export default SideBar;
