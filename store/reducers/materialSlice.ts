import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMaterialCategories, fetchMaterials } from '../../api/routes/materials';

export type Material = {
    name: string;
    image: { url: string };
};

type MaterialProps = {
    roomPlannerMaterials: Array<Material>;
    materialCategoryData: any | null;
    allCategoriesProductTotalCount: number | null;
    materialsData: any | null;
    materialsTotalCount: number | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | any;
};

const initialState: MaterialProps = {
    roomPlannerMaterials: [],
    materialCategoryData: [],
    allCategoriesProductTotalCount: null,
    materialsData: null,
    materialsTotalCount: null,
    status: 'idle',
    error: undefined,
};

export const getMaterialCategories = createAsyncThunk('material/get-material-categories', async (payload: any, { rejectWithValue }) => {
    const { data, error } = await fetchMaterialCategories(payload);

    if (error) return rejectWithValue(error);

    return data;
});

export const getMaterials = createAsyncThunk('material/get-materials', async (payload: any, { rejectWithValue }) => {
    const { data, error } = await fetchMaterials(payload);

    if (error) return rejectWithValue(error);

    return data;
});

export const getInfiniteMaterials = createAsyncThunk('material/get-infinite-materials', async (payload: any, { rejectWithValue }) => {
    const { data, error } = await fetchMaterials(payload);

    if (error) return rejectWithValue(error);

    return data;
});

export const getRoomPlannerMaterials = createAsyncThunk('material/room-planner', async (payload: any, { rejectWithValue }) => {
    const { data, error } = await fetchMaterials(payload);

    if (error) return rejectWithValue(error);

    return data;
});

const materialSlice = createSlice({
    name: 'material',
    initialState,
    reducers: {
        clearMaterialsData: state => {
            state.materialsData = [];
        },
    },
    extraReducers: builder => {
        builder
            .addCase(getMaterialCategories.pending, state => {
                state.status = 'loading';
            })
            .addCase(getMaterialCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const [materialCategories] = action.payload.data.categoryList;
                state.materialCategoryData = materialCategories.children;
                state.allCategoriesProductTotalCount = materialCategories.product_count;
                state.error = '';
            })
            .addCase(getMaterialCategories.rejected, (state, action: any) => {
                state.status = 'failed';
                state.error = action?.payload?.message;
            })
            .addCase(getMaterials.pending, state => {
                state.status = 'loading';
            })
            .addCase(getMaterials.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const [materialCategories] = action.payload.data.categoryList;
                state.materialsData = materialCategories.products.items;
                state.materialsTotalCount = materialCategories.products.total_count;
                state.error = '';
            })
            .addCase(getMaterials.rejected, (state, action: any) => {
                state.status = 'failed';
                state.error = action?.payload?.message;
            })
            .addCase(getInfiniteMaterials.pending, state => {
                state.status = 'loading';
            })
            .addCase(getInfiniteMaterials.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const [materialCategories] = action.payload.data.categoryList;
                state.materialsData = [...state.materialsData, ...materialCategories.products.items];
                state.error = '';
            })
            .addCase(getInfiniteMaterials.rejected, (state, action: any) => {
                state.status = 'failed';
                state.error = action?.payload?.message;
            })
            .addCase(getRoomPlannerMaterials.pending, state => {
                state.status = 'loading';
            })
            .addCase(getRoomPlannerMaterials.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const [materialCategories] = action.payload.data.categoryList;
                state.roomPlannerMaterials = materialCategories.products.items;
                state.materialsTotalCount = materialCategories.products.total_count;
                state.error = '';
            })
            .addCase(getRoomPlannerMaterials.rejected, (state, action: any) => {
                state.status = 'failed';
                state.error = action?.payload?.message;
            });
    },
});

export const { clearMaterialsData } = materialSlice.actions;
export const selectStatus = (state: any) => state.materials.status;
export const selectError = (state: any) => state.materials.error;
export const selectMaterialCategoryData = (state: any) => state.materials.materialCategoryData;
export const selectMaterialsData = (state: any) => state.materials.materialsData;
export const selectMaterialsTotalCount = (state: any) => state.materials.materialsTotalCount;
export const selectAllCategoriesProductTotalCount = (state: any) => state.materials.allCategoriesProductTotalCount;
export const selectRoomPlannerMaterials = (state: any) => state.materials.roomPlannerMaterials;
export default materialSlice.reducer;
