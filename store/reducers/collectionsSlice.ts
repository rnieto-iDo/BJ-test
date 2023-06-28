import { createSlice } from "@reduxjs/toolkit";

type AuthState = {
    cmsData: any | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | any;
};

const initialState: AuthState = {
    cmsData: null,
    status: "idle",
    error: undefined,
};

const collectionsSlice = createSlice({
    name: "collections",
    initialState,
    reducers: {},
});

// export const {} = collectionsSlice.actions;
export const selectStatus = (state: any) => state.collections.status;
export const selectError = (state: any) => state.collections.error;
export const selectCMSData = (state: any) => state?.collections?.cmsData;
export default collectionsSlice.reducer;
