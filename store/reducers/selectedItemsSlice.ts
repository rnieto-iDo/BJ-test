import { createSlice } from '@reduxjs/toolkit';
import { IProductExtended } from '../../interfaces/productInterfaces';
import { SizeRoom } from '../../interfaces/canvasInterfaces';

export interface ISelectedItemsSlice {
  products: Array<IProductExtended>,
  filteredItems: Array<IProductExtended>,
  isProductSelected: boolean,
  productSelectedId: string | null,
  roomSize: SizeRoom
};


const initialState: ISelectedItemsSlice = {
  products: [],
  filteredItems: [],
  isProductSelected: false,
  productSelectedId: null,
  roomSize: {}
};

const SelectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    setItems(state, action) {
      const selectedItem = {
        ...action.payload,
        isSelected: true
      }
      state.products.push(selectedItem);
      state.filteredItems.push(selectedItem);
    },
    setFilterItems(state, action) {
      state.filteredItems = action.payload
    },
    deleteItemById(state, action) {
      const copyItems = state.products.filter((x: any) => x.id !== action.payload);
      const copyFilterItems = state.filteredItems.filter((x: any) => x.id !== action.payload);
      state.products = copyItems;
      state.filteredItems = copyFilterItems;
    },
    setIsProductSelected(state, action) {
      state.isProductSelected = action.payload;
    },
    setProductSelectedId(state, action) {
      state.productSelectedId = action.payload;
    },
    updateSelectedItems(state, action) {
      state.products = action.payload;
    },
    updateSelectedFilterItems(state, action) {
      const item = action.payload;
      const filterIndex = state.filteredItems.findIndex((x: any) => x.id === item.id);
      state.filteredItems[filterIndex] = item;
    },

    updateSelectedFilterItemByIndex(state, action) {
      const item = {
        ...action.payload,
        isSelected: true,
        is2DView: true
      }
      const filterIndex = state.filteredItems.findIndex((x: IProductExtended) => x.sku === item.sku);
      state.filteredItems[filterIndex] = item;
      state.products = [...state.products, item];
    },

    updatePositionItemById(state, action) {
      const { idProduct, offsetX, offsetY, angle } = action.payload
      const index = state.products.findIndex((x: any) => x.id === idProduct);
      const filterIndex = state.filteredItems.findIndex((x: any) => x.id === idProduct);
      if (index !== -1) {
        state.products[index].offsetX = offsetX;
        state.products[index].offsetY = offsetY;
        state.products[index].angle = angle
      }
      if (filterIndex !== -1) {
        state.filteredItems[filterIndex].offsetX = offsetX;
        state.filteredItems[filterIndex].offsetY = offsetY;
        state.filteredItems[filterIndex].angle = angle
      }
    },
    setRoomSize(state, action) {
      state.roomSize = action.payload;
    },
  },
});

export const { setItems, deleteItemById, setIsProductSelected, setProductSelectedId, updateSelectedItems, updatePositionItemById, setRoomSize, updateSelectedFilterItems, setFilterItems, updateSelectedFilterItemByIndex } = SelectedItemsSlice.actions;
export const selectIsProductSelected = (state: any) => state.selectedItems.isProductSelected;
export const selectProductSelectedId = (state: any) => state.selectedItems.productSelectedId;
export const selectedItems = (state: any) => state.selectedItems.products;
export default SelectedItemsSlice.reducer;