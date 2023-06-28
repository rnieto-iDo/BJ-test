/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from 'next/image';
import { DragEvent } from 'react';
import { useAppSelector } from "../../../hooks/reduxOverwriteHooks";
import { selectRoomPlannerMaterials, Material } from "../../../store/reducers/materialSlice";
import { IProductExtended } from "../../../interfaces/productInterfaces";

export interface IProductSwatch {
  sku: string;
  image: {
    url: string;
  };
  name: string;
  categoryId?: string;
}
interface IProductItem {
  product: IProductExtended;
  // eslint-disable-next-line react/require-default-props, react/no-unused-prop-types
  onClick?: () => void;
  isSelected: boolean;
}

const ProductItem = ({ product, isSelected }: IProductItem) => {
  const Materials: Array<Material> = useAppSelector(selectRoomPlannerMaterials);
  const productCopy: IProductExtended = JSON.parse(JSON.stringify(product));

  const handleDragStart = (e: DragEvent) => {
    const initialVariant: Array<any> = [];

    productCopy.options.map((option, indexOption) => {
      initialVariant.push({ option: option.title, optionId: option.uid, value: option.dropDown[0].title, valueId: option.dropDown[0].uid, valueSku: option.dropDown[0].sku })
      option.dropDown.map((materialOption, indexMaterial) => {
        // eslint-disable-next-line array-callback-return
        Materials.some(material => {
          // eslint-disable-next-line no-unused-expressions
          material.name === materialOption.title && (
            productCopy.options[indexOption].dropDown[indexMaterial] = { ...materialOption, image: material.image.url }
          )
        })
        return null
      })
      return null
    });
    productCopy.nodeId = "";
    productCopy.selectedOptions = initialVariant;
    e.dataTransfer?.setData('product', `https://brown-jordan.herokuapp.com/topviews/${product.categoryId}/${product.sku}`);
    e.dataTransfer?.setData('productRedux', JSON.stringify(productCopy));
  }

  return (
    <div className="relative col-span-1">
      <div className="absolute top-4 right-4">
        <div className="flex items-center">
          <input id={product?.sku} type="checkbox" name="A3-confirmation" className="absolute w-6 h-6 opacity-0 pointer-events-none" readOnly checked={isSelected} />
          <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 bg-white border-2 border-black focus-within:border-black">
            <svg className="hidden w-3 h-3 text-black pointer-events-none fill-current" version="1.1" viewBox="0 0 17 12" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fillRule="evenodd">
                <g transform="translate(-9 -11)" fill="#000000" fillRule="nonzero">
                  <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <Image width={209} height={209} draggable src={product?.image?.url} alt={product?.sku} onDragStart={handleDragStart} />
      <h3 className="mt-4 text-xs text-black uppercase">{product?.name}</h3>
    </div>
  );
};

export default ProductItem;
