import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login } from "../../api/routes/auth";
import { LoginData } from "../../types/data.types";

type AuthState = {
    data: any | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | any;
};

const initialState: AuthState = {
    data: null,
    status: "idle",
    error: undefined,
};

export const loginUser = createAsyncThunk(
    "auth/login",
    async (payload: LoginData, { rejectWithValue }) => {
        const { data, error } = await login(payload);

        if (error) return rejectWithValue(error);

        return data.generateCustomerToken.token;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loginUser.pending, state => {
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
                state.error = "";
            })
            .addCase(loginUser.rejected, (state, action: any) => {
                state.status = "failed";
                state.error = action?.payload?.message;
            });
    },
});

// export const {} = authSlice.actions;
export const selectStatus = (state: any) => state.auth.status;
export const selectError = (state: any) => state.auth.error;
export default authSlice.reducer;
