import { createSlice } from "@reduxjs/toolkit";

export interface SetDimensionsParams {
  width: number;
  length: number;
  unitMeasure: string
}

const initialState: SetDimensionsParams = {
  width: 15,
  length: 15,
  unitMeasure: 'feet'
}

const SetDimensionsSlice = createSlice({
    name: "setDimensions",
    initialState,
    reducers: {
      setDimensions: (state, action) => {
        const { width, length, unitMeasure } = action.payload;
        if(length >= 10){
          state.length = length;
        }
        if(width >= 10){
          state.width = width;
        }
        state.unitMeasure = unitMeasure;
      }
  }
});

export const { setDimensions } = SetDimensionsSlice.actions
export default SetDimensionsSlice.reducer
