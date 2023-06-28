import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import userSlice from './reducers/userSlice';
import authSlice from './reducers/authSlice';
import collectionsSlice from './reducers/collectionsSlice';
import pageSlice from './reducers/pageSlice';
import projectsSlice from './reducers/projectsSlice';
import productSlice from './reducers/productSlice';
import cartSlice from './reducers/cartSlice';
import setDimensionsSlice from './reducers/setDimensionsSlice';
import selectedItemsSlice from './reducers/selectedItemsSlice';
import canvasSlice from './reducers/canvasSlice';
import materialSlice from './reducers/materialSlice';
// eslint-disable-next-line import/no-cycle
import moodBoardMenuSlice from './reducers/moodBoardMenuSlice';
import moodboardCanvasSlice from './reducers/moodboardCanvasSlice';
import savedProjectSlice from './reducers/savedProjectSlice';
import requestSlice from './reducers/requestSlice';

export const store = configureStore({
    reducer: {
        user: userSlice,
        auth: authSlice,
        collections: collectionsSlice,
        pages: pageSlice,
        projects: projectsSlice,
        products: productSlice,
        cart: cartSlice,
        setDimensions: setDimensionsSlice,
        selectedItems: selectedItemsSlice,
        canvas: canvasSlice,
        materials: materialSlice,
        moodBoardMenu: moodBoardMenuSlice,
        moodboardCanvas: moodboardCanvasSlice,
        savedProject: savedProjectSlice,
        request: requestSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

const makeStore = () => store;
export const wrapper = createWrapper(makeStore);
