/* eslint-disable jsx-a11y/no-static-element-interactions */
import Image from 'next/image';
import { DragEvent } from 'react';

export interface IProductSwatch {
  sku: string;
  image: {
    url: string;
  };
  name: string;
  categoryId?: string;
}
interface IProductItem {
  product: IProductSwatch;
  // eslint-disable-next-line react/require-default-props
  selected?: boolean;
  // eslint-disable-next-line react/require-default-props, react/no-unused-prop-types
  onClick?: () => void;
}

const ProductItem = ({ product, selected, onClick }: IProductItem) => {
  const handleDragStart = (e: DragEvent) => {
    e.dataTransfer?.setData(
      'product',
      `https://brown-jordan.herokuapp.com/topviews/${product.categoryId}/${product.sku}`
    );
    e.dataTransfer?.setData('productRedux', JSON.stringify(product));
  };

  return (
    <div className="relative col-span-1">
      <div className="absolute top-4 right-4">
        <div className="flex items-center">
          <input
            id={product?.sku}
            type="checkbox"
            checked={selected || false}
            name="A3-confirmation"
            className="absolute w-6 h-6 opacity-0 pointer-events-none"
            readOnly
          />
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
          <div
            className="flex items-center justify-center flex-shrink-0 w-6 h-6 mr-2 bg-white border-2 border-black focus-within:border-black"
            onClick={() => onClick && onClick()}
          >
            <svg
              className="hidden w-3 h-3 text-black pointer-events-none fill-current"
              version="1.1"
              viewBox="0 0 17 12"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g fill="none" fillRule="evenodd">
                <g
                  transform="translate(-9 -11)"
                  fill="#000000"
                  fillRule="nonzero"
                >
                  <path d="m25.576 11.414c0.56558 0.55188 0.56558 1.4439 0 1.9961l-9.404 9.176c-0.28213 0.27529-0.65247 0.41385-1.0228 0.41385-0.37034 0-0.74068-0.13855-1.0228-0.41385l-4.7019-4.588c-0.56584-0.55188-0.56584-1.4442 0-1.9961 0.56558-0.55214 1.4798-0.55214 2.0456 0l3.679 3.5899 8.3812-8.1779c0.56558-0.55214 1.4798-0.55214 2.0456 0z" />
                </g>
              </g>
            </svg>
          </div>
        </div>
      </div>
      <Image
        width={209}
        height={209}
        draggable
        src={product?.image?.url}
        alt={product?.sku}
        onDragStart={handleDragStart}
      />
      <h3 className="text-xs text-black mt-4 uppercase">{product?.name}</h3>
    </div>
  );
};

export default ProductItem;
