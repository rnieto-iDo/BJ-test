/* eslint-disable import/no-cycle */
import { useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { RootState } from '../../../types/redux.types';

import SingleProductReview from '../SingleProductReview';
import { IProductExtended } from '../../../interfaces/productInterfaces';

const ProjectReview = () => {
  const itemState: Array<IProductExtended> = useSelector((state: RootState) => state.selectedItems.products);

  return (
    <>
      <div className="border-b border-black flex justify-between items-end p-4 w-[100%_-_24px]">
        <h3 className="text-xl font-medium">Products</h3>
        <a className="underline" download>
          Download Checklist
        </a>
      </div>

      <div className="pr-10 overflow-y-auto h-[580px]" id="container-products">
        {itemState && itemState.length !== 0 ? itemState.map((product: IProductExtended) => <SingleProductReview key={uuid()} product={product} />) : null}
      </div>
    </>
  );
};

export default ProjectReview;
