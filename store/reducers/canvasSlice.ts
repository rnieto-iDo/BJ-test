import { createSlice } from "@reduxjs/toolkit";

export interface CanvasState {
  takeScreenShot: boolean;
  threekitEnv: boolean;
}

const initialState: CanvasState = {
    takeScreenShot: false,
    threekitEnv: true
}

const CanvasSlice = createSlice({
    name: "CanvasState",
    initialState,
    reducers: {
      setTakeScreenShot: (state, action) => {
        state.takeScreenShot = action.payload;
      },
      setThreekitEnv: (state, action) => {
        state.threekitEnv = action.payload;
      }
  }
});

export const { setTakeScreenShot, setThreekitEnv } = CanvasSlice.actions
export default CanvasSlice.reducer
