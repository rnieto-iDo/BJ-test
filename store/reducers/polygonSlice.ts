import { createSlice } from "@reduxjs/toolkit";
import { Point } from "../../interfaces/canvasInterfaces";
import { initPerimeter } from "../../constants/fabric.constants";

export interface PolygonState{
    pathFloor: string;
}

const initialState: PolygonState = {
    pathFloor: '',
}

const PolygonSlice = createSlice({
    name: "PolygonState",
    initialState,
    reducers: {
    setSavePathFloor: (state, action) => {
        state.pathFloor = action.payload;
      }
  }
});

export const { setSavePathFloor } = PolygonSlice.actions
export default PolygonSlice.reducer
