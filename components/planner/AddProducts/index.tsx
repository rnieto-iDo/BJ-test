import { useDispatch, useSelector } from 'react-redux';
import uuid from 'react-uuid';
import { ChangeEvent, useEffect, useState } from 'react';
import { setFilterItems } from 'store/reducers/selectedItemsSlice';
import { sortAlphabeticalOrder } from 'helpers/canvasHelper';
import ProductItem from '../ProductItem';
import type { RootState } from '../../../types/redux.types';
import { IProductExtended } from "../../../interfaces/productInterfaces";


const AddProducts = () => {
  const dispatch = useDispatch();
  const productsState = useSelector((state: RootState) => state.products);
  const savedProject = useSelector((state: RootState) => state.savedProject);
  const selectedItems = useSelector((state: RootState) => state.selectedItems.products);
  const projectItems = useSelector((state: RootState) => state.selectedItems.filteredItems);
  const projectState = useSelector((state: RootState) => state.projects.selectedProjectProducts);
  // const projectLoadStatus = useSelector((state: RootState) => state.projects.selectedProject.status);
  const [showProjectItems, setShowProjectItems] = useState<boolean>(true)
  const [catalogItems, setCatalogItems] = useState<Array<IProductExtended>>([])
  const [query, setQuery] = useState<string>('')
  const [project, setProject] = useState<Array<IProductExtended>>([])
  const sortedItems = sortAlphabeticalOrder(projectItems)
  const filteredItems = showProjectItems ?
    sortedItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    :
    catalogItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  // selectedItems.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))

  const handleQueryChange = (e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)

  const reRenderfilter = () => {
    const third = productsState.roomPlannerProducts.map(item => {
      const matchingItem = selectedItems.find(selItem => selItem.sku === item.sku);
      if (matchingItem) {
        return { ...item, isSelected: true };
      }
      return item;
    });
    setCatalogItems(third)
  }
  const handleToggle = () => {
    reRenderfilter()
    setShowProjectItems(!showProjectItems)
  }

  const filterProjectItems = () => {
    const products: Array<IProductExtended> = [];
    projectState.products.items.forEach((item: any) => {
      let returnValue = false;
      productsState.roomPlannerProducts.some(product => {
        if (product.sku === item.product_attributes.sku) {
          const magentoItem = {
            ...product
          }
          magentoItem.isMagento = true
          magentoItem.is2DView = false
          products.push(magentoItem);
          returnValue = true;
        }
        return returnValue;
      })
    })
    return products;
  }

  useEffect(() => {
    reRenderfilter()
  }, [selectedItems, project])


  useEffect(() => {
    if (savedProject.configuration.lenght > 0 && savedProject.isLoaded) {
      const parsedProject: Array<IProductExtended> = JSON.parse(savedProject.configuration)
      setProject(parsedProject)
    }
  }, [savedProject.isLoaded, savedProject.configuration])


  useEffect(() => {
    if (savedProject.isLoaded && savedProject.isRebuilt) {
      if(productsState.roomPlannerProducts.length > 0){
        let products = filterProjectItems();
        products = [...products, ...selectedItems];
        dispatch(setFilterItems(products))
      }
    }
  }, [savedProject.isLoaded, savedProject.isRebuilt, productsState.roomPlannerProducts]);

  return (
    <div className="w-full px-10 py-2 ">
      <div className="w-full flex relative min-h-[40px]">
        <button type="button" className={`${showProjectItems ? 'bg-black text-white z-10' : 'bg-[#F7F7F3] text-black z-0'} rounded-3xl p-2 absolute top-0 left-0 w-[54%]`} onClick={handleToggle} >
          Projects Items
        </button>
        <button type="button" className={`${!showProjectItems ? 'bg-black  text-white z-10' : 'bg-[#F7F7F3] text-black z-0'} rounded-3xl p-2 absolute top-0 right-0 w-[54%]`} onClick={handleToggle}>
          Additional Items
        </button>
      </div>

      <div className="relative flex items-center w-full h-16 mt-6">
        <svg className="absolute left-0" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m17 17l4 4M3 11a8 8 0 1 0 16 0a8 8 0 0 0-16 0Z" />
        </svg>
        <input type="search" className="w-full h-full bg-transparent border-b outline-none p-[10px_100px_10px_40px]" onChange={handleQueryChange} />
        <button type="button" className="absolute right-0 uppercase bg-transparent border-none outline-none">
          filter & sort
        </button>
      </div>
      <p
        className="mt-4 -mb-8 text-center"
      >
        Drag and drop
      </p>

      <div className="w-full overflow-y-auto mt-10 grid grid-cols-3 gap-y-10 gap-x-4 h-[470px] pb-4" id="container-products">
        {filteredItems.map((product: IProductExtended) => <ProductItem key={uuid()} product={product} isSelected={product.isSelected} />)}
      </div>
    </div>
  );
};

export default AddProducts;