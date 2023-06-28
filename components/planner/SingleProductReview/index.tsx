/* eslint-disable react/destructuring-assignment */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import uuid from 'react-uuid';
import { getThumbnail } from 'public/services/thumbnails/service';
import { IProductExtended } from '../../../interfaces/productInterfaces';
import Loader from '../Loader';

export interface IProductSwatch {
  product: IProductExtended;
}

const SingleProductReview = ({ product }: IProductSwatch) => {
  const [custom_thumbnail, setCustom_thumbnail] = useState<any>(
    product.image.url
  );
  const [isShown, setIsShown] = useState<boolean>(true);

  useEffect(() => {
    if (product.config_thumbnail) {
      setIsShown(false);
      getThumbnail(product.config_thumbnail)
        .then((response: any) => {
          const base64ImageString = Buffer.from(
            response.data,
            'binary'
          ).toString('base64');
          const srcValue = `data:image/png;base64, ${base64ImageString}`;
          setCustom_thumbnail(srcValue);
        })
        .finally(() => setIsShown(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.config_thumbnail]);

  return (
    <div className="relative flex gap-6 pt-10 pb-10 border-b border-black">
      {isShown ? (
        <Image
          className="w-[209px] h-[209px]"
          src={custom_thumbnail}
          width={209}
          height={209}
          quality={100}
          alt={product.description.html}
        />
      ) : (
        <div className="w-[209px] h-[209px] flex items-center justify-center">
          <Loader
            width="w-[50px]"
            height="h-[50px]"
            borderWidth="border-4"
            color="border-black"
          />
        </div>
      )}
      <div className="w-[calc(100%_-_237px)]">
        <p className="mb-2 font-medium">{product.name}</p>
        <span className="text-[#7C7C7A]">
          List Price from{' '}
          <strong className="text-black">
            $
            {product.price_range?.minimum_price?.final_price?.value
              ?.toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </strong>
        </span>
        <div className="relative overflow-x-auto mt-7">
          <table className="w-full text-base text-left border-t border-black">
            <tbody>
              {product.selectedOptions?.map(material => (
                <tr key={uuid()} className="border-b border-black">
                  <td className="w-1/2 py-2 font-medium text-black">
                    {material.option}
                  </td>
                  <td className="w-1/2 py-2 font-medium text-black">
                    {material.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SingleProductReview;
