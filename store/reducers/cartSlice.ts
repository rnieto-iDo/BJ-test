import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getThreekitImageUrlForMoodboard } from 'api/routes/products';
import {
  customerCart,
  addProduct,
  getCartItems,
  removeProduct,
  updateProduct
} from '../../api/routes/cart';
import {
  ICartItems,
  IRemoveCart,
  IUpdateCart
} from '../../interfaces/cartInterfaces';

type CartState = {
  cartId: {
    id: string | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | any;
  };
  cartItems: {
    items: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    updateStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | any;
  };
  addToCart: {
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
  cartSideBar: {
    showSideBar: boolean;
  };
  data: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | any;
};

const initialState: CartState = {
  cartId: { id: null, status: 'idle', error: undefined },
  cartItems: {
    items: [],
    status: 'idle',
    updateStatus: 'idle',
    error: undefined
  },
  addToCart: {
    status: 'idle'
  },
  cartSideBar: {
    showSideBar: false
  },
  data: null,
  status: 'idle',
  error: undefined
};

const generateUrlForThreeKit = async (productsList: any) => {
  const data = productsList?.map(item => {
    const parsedAttributes = JSON.parse(
      item?.product?.visiture_custom_attributes
    );

    const threeKitAssetIdObj = parsedAttributes?.find(
      attr => attr?.attribute_code === 'threekit_asset_id'
    );

    const threeKitAssetId = threeKitAssetIdObj?.value;

    const customizable_options = item?.customizable_options;
    const optionsArray = item?.product?.options;

    const productThreeKitOptons = customizable_options?.map(el => {
      const elementUid = el?.values[0]?.customizable_option_value_uid;

      const options = optionsArray?.find(
        opt => opt?.option_id === el?.id
      )?.value;

      const optionAssetObj = options?.find(
        opt => opt?.uid === elementUid
      )?.threekit_asset_id;

      return JSON.parse(optionAssetObj);
    });

    let threeKitConfig = {};

    productThreeKitOptons?.forEach(opt => {
      const [assetId] = Object.values(opt);
      threeKitConfig[Object.keys(opt)[0]] = assetId;
    });

    threeKitConfig = {
      ...threeKitConfig,
      'Cameras - White Background': 'Front facing'
    };

    return { threeKitAssetId, threeKitConfig };
  });

  const images = await Promise.all(
    data?.map(item =>
      getThreekitImageUrlForMoodboard(
        item?.threeKitAssetId,
        JSON.stringify(item?.threeKitConfig)
      )
    )
  );

  return images;
};

const addThreeKitToCartItems = async (data: any) => {
  const products = data?.filter(
    item => !item?.product?.categories?.find(cat => cat?.name === 'Materials')
  );
  const materials = data?.filter(item =>
    item?.product?.categories?.find(cat => cat?.name === 'Materials')
  );

  const images = await generateUrlForThreeKit(products);

  const updatedProducts = products?.map((item, index) => ({
    ...item,
    threeKitImage: images[index]
  }));

  return [...updatedProducts, ...materials];
};

export const generateCustomerCart = createAsyncThunk(
  'cart/generate-token',
  async (_, { rejectWithValue }) => {
    const { data, error } = await customerCart();

    if (error) return rejectWithValue(error);

    return data.customerCart.id;
  }
);

export const getProductsInCart = createAsyncThunk(
  'cart/get-cart',
  async (_, { rejectWithValue }) => {
    const { data: cartData, error: cartError } = await customerCart();

    if (cartError) return rejectWithValue(cartError);

    const { data, error } = await getCartItems(cartData.customerCart.id);

    if (error) return rejectWithValue(error);

    const updatedCartItems = await addThreeKitToCartItems(data?.cart?.items);

    return updatedCartItems;
  }
);

export const addProductToCart = createAsyncThunk(
  'cart/add-product',
  async (payload: ICartItems, { rejectWithValue }) => {
    const { onSuccess, onFailed, ...params } = payload;

    const { data, error } = await addProduct(params);

    if (error) {
      if (onFailed) onFailed();
      return rejectWithValue(error);
    }

    if (onSuccess) {
      onSuccess();
    }

    return data;
  }
);

export const removeProductFromCart = createAsyncThunk(
  'cart/remove-product',
  async (payload: string, { rejectWithValue }) => {
    const { data: cartData, error: cartError } = await customerCart();

    if (cartError) return rejectWithValue(cartError);

    const removeData: IRemoveCart = {
      input: { cart_id: cartData.customerCart.id, cart_item_uid: payload }
    };

    const { data, error } = await removeProduct(removeData);

    if (error) return rejectWithValue(error);

    const updatedCartItems = await addThreeKitToCartItems(
      data?.removeItemFromCart?.cart?.items
    );

    return updatedCartItems;
  }
);

export const updateProductFromCart = createAsyncThunk(
  'cart/update-product',
  async (payload: IUpdateCart, { rejectWithValue }) => {
    const { onSuccess, onFailed, ...params } = payload;

    const { data, error } = await updateProduct(params);

    if (error) {
      if (onFailed) onFailed();
      return rejectWithValue(error);
    }

    if (onSuccess) onSuccess();

    const updatedCartItems = await addThreeKitToCartItems(
      data?.updateCartItems?.cart?.items
    );

    return updatedCartItems;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartId: (state, { payload }: PayloadAction<string | null>) => {
      state.cartId.id = payload;
    },
    setShowSideBar: (state, { payload }: PayloadAction<boolean>) => {
      state.cartSideBar.showSideBar = payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(generateCustomerCart.pending, state => {
        state.cartId.status = 'loading';
      })
      .addCase(generateCustomerCart.fulfilled, (state, action) => {
        state.cartId.status = 'succeeded';
        state.cartId.id = action.payload;
        state.cartId.error = '';
      })
      .addCase(generateCustomerCart.rejected, (state, action: any) => {
        state.cartId.status = 'failed';
        state.cartId.error = action?.payload?.message;
      })
      .addCase(getProductsInCart.pending, state => {
        state.cartItems.status = 'loading';
      })
      .addCase(getProductsInCart.fulfilled, (state, action) => {
        state.cartItems.status = 'succeeded';
        state.cartItems.items = action.payload;
        state.cartItems.error = '';
      })
      .addCase(getProductsInCart.rejected, (state, action: any) => {
        state.cartItems.status = 'failed';
        state.cartItems.error = action.payload?.message;
      })
      .addCase(addProductToCart.pending, state => {
        state.addToCart.status = 'loading';
      })
      .addCase(addProductToCart.fulfilled, state => {
        state.addToCart.status = 'succeeded';
      })
      .addCase(addProductToCart.rejected, state => {
        state.addToCart.status = 'failed';
      })
      .addCase(removeProductFromCart.pending, state => {
        state.cartItems.status = 'loading';
      })
      .addCase(removeProductFromCart.fulfilled, (state, action) => {
        state.cartItems.status = 'succeeded';
        state.cartItems.items = action.payload;
        state.cartItems.error = '';
      })
      .addCase(removeProductFromCart.rejected, (state, action: any) => {
        state.cartItems.status = 'failed';
        state.cartItems.error = action.payload.message;
      })
      .addCase(updateProductFromCart.pending, state => {
        state.cartItems.updateStatus = 'loading';
      })
      .addCase(updateProductFromCart.fulfilled, (state, action) => {
        state.cartItems.updateStatus = 'succeeded';
        state.cartItems.items = action.payload;
        state.cartItems.error = '';
      })
      .addCase(updateProductFromCart.rejected, (state, action: any) => {
        state.cartItems.updateStatus = 'failed';
        state.cartItems.error = action.payload.message;
      });
  }
});

export const { setCartId, setShowSideBar } = cartSlice.actions;

export const selectCartId = (state: any) => state?.cart?.cartId?.id;
export const selectCartIdStatus = (state: any) => state?.cart?.cartId?.status;
export const selectCartIdError = (state: any) => state?.cart?.cartId?.error;

export const selectCartItems = (state: any) => state?.cart?.cartItems?.items;
export const selectCartItemsStatus = (state: any) =>
  state?.cart?.cartItems?.status;
export const selectCartItemsError = (state: any) =>
  state?.cart?.cartItems?.error;
export const selectCartItemsUpdateStatus = (state: any) =>
  state?.cart?.cartItems?.updateStatus;

export const selectAddToCartStatus = (state: any) =>
  state?.cart?.addToCart?.status;

export const selectCartShowSideBar = (state: any) =>
  state?.cart?.cartSideBar?.showSideBar;

export default cartSlice.reducer;
