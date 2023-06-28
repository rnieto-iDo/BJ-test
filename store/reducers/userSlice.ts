import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getCurrentUserApi } from "../../api/routes/users";

type UserType = {
    currentUser: any | null;
    status: "idle" | "succeded" | "failed" | "loading";
    error: string | any;
};

const initialState: UserType = {
    currentUser: null,
    status: "idle",
    error: undefined,
};

export const getCurrentUser = createAsyncThunk(
    "users/getCurrentUser",
    async (_, { rejectWithValue }) => {
        const { data, error } = await getCurrentUserApi();

        if (error) return rejectWithValue(error);

        return data.customer;
    }
);

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCurrentUser.pending, state => ({
                ...state,
                status: "loading",
            }))
            .addCase(getCurrentUser.fulfilled, (state, action) => ({
                ...state,
                currentUser: action.payload,
                status: "succeded",
                error: "",
            }))
            .addCase(getCurrentUser.rejected, (state, action: any) => ({
                ...state,
                currentUser: null,
                error: action.payload?.error,
                status: "failed",
            }));
    },
});

export const selectCurrentUser = (state: any) => state?.user?.currentUser;

export default userSlice.reducer;
