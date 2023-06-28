import { createSlice, PayloadAction, current } from '@reduxjs/toolkit';
import { IProduct } from '../../interfaces/productInterfaces';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../types/redux.types';

type moodBoardMenuType = {
  selectedProjectItems: {
    list: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | null;
  };
};

const initialState: moodBoardMenuType = {
  selectedProjectItems: {
    list: [],
    status: 'idle',
    error: ''
  }
};

const moodBoardMenuSlice = createSlice({
  name: 'moodBoardMenu',
  initialState,
  reducers: {
    addItemMoodboard: (state, { payload }: PayloadAction<IProduct>) => {
      state.selectedProjectItems.list = [
        ...state.selectedProjectItems.list,
        payload
      ];
    },
    setMoodboardItems: (state, { payload }: PayloadAction<Array<IProduct>>) => {
      state.selectedProjectItems.list = payload;
    },
    removeItemMoodboard: (state, { payload }: PayloadAction<IProduct>) => {
      const currentState = current(state);
      const updatedState = currentState.selectedProjectItems.list.filter(
        item => item.sku !== payload.sku
      );
      state.selectedProjectItems.list = updatedState;
    }
  },
  extraReducers: {}
});

export const { addItemMoodboard, removeItemMoodboard, setMoodboardItems } =
  moodBoardMenuSlice.actions;
export const selectedProjectItems = (state: RootState) =>
  state.moodBoardMenu.selectedProjectItems.list;

export default moodBoardMenuSlice.reducer;
