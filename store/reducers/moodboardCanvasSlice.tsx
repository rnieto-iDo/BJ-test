import { createSlice } from '@reduxjs/toolkit';

import { fabric } from 'fabric';

export type MoodboardCanvasStateProps = {
    canvas: fabric.Canvas | undefined;
};

const initialState: MoodboardCanvasStateProps = {
    canvas: undefined,
};

const CanvasSlice = createSlice({
    name: 'MoodBoardCanvas',
    initialState,
    reducers: {
        setMoodboardCanvas: (state, action) => {
            state.canvas = action.payload;
        },
    },
});

export const { setMoodboardCanvas } = CanvasSlice.actions;
export default CanvasSlice.reducer;

export const selectMoodBoardCanvas = state => state.moodboardCanvas.canvas;
