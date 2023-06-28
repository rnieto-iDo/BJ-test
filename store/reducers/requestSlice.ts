import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RequestType, RequestFormState } from '../../types/data.types';

type RequestState = {
    formState: RequestFormState | '';
    contactInfo: {
        requestType: RequestType;
        firstName: string;
        lastName: string;
        phoneNumber: string;
        email: string;
        jobTitle?: string;
        companyName?: string;
        newsletter: boolean;
    };
    shippingInfo: {
        address: string;
        additionalAddress: string;
        city: string;
        state: string;
        postCode: string;
        country: string;
    };
    productInfo: {
        estimation: string;
        deliveryDate: string;
        notes: string;
    };
};

const initialState: RequestState = {
    formState: '',
    contactInfo: {
        requestType: 'Both',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        jobTitle: '',
        companyName: '',
        newsletter: true,
    },
    shippingInfo: {
        address: '',
        additionalAddress: '',
        city: '',
        state: '',
        postCode: '',
        country: '',
    },
    productInfo: {
        estimation: '',
        deliveryDate: '',
        notes: '',
    },
};

const requestSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {
        setFormState: (state, { payload }: PayloadAction<RequestFormState | ''>) => {
            state.formState = payload;
        },
        setContactInfo: (state, { payload }: PayloadAction<any>) => {
            state.contactInfo = payload;
        },
        setShippingInfo: (state, { payload }: PayloadAction<any>) => {
            state.shippingInfo = payload;
        },
        setProductInfo: (state, { payload }: PayloadAction<any>) => {
            state.productInfo = payload;
        },
    },
    extraReducers: {},
});

export const { setFormState, setContactInfo, setShippingInfo, setProductInfo } = requestSlice.actions;

export const selectFormState = (state: any) => state?.request?.formState;
export const selectContactInfo = (state: any) => state?.request?.contactInfo;
export const selectShippingInfo = (state: any) => state?.request?.shippingInfo;
export const selectProductInfo = (state: any) => state?.request?.productInfo;

export default requestSlice.reducer;
