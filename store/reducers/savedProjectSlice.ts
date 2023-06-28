import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  configuration: [],
  dimensions: {},
  isLoaded: false,
  isRebuilt: false
};

const savedProjectSlice = createSlice({
  name: 'SavedProject',
  initialState,
  reducers: {
    setSavedProject(state, action) {
      const { value, isLoaded } = action.payload
      state.configuration = value.Configuration
      state.dimensions = value.roomSize
      state.isLoaded = isLoaded
    },
    setRebuilt(state, action) {
      state.isRebuilt = action.payload;
    },
    setIsLoaded(state, action) {
      state.isLoaded = action.payload
    }
  },
},
);

export const { setSavedProject, setRebuilt, setIsLoaded } = savedProjectSlice.actions;
export default savedProjectSlice.reducer;
