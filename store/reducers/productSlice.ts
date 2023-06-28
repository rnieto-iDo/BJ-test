import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  fetchMoodbaordProducts,
  fetchProducts,
  fetchRoomPlannerProducts,
  getCategoryProductsApi,
  getProductCollectionOrDesignerApi,
  searchAll
} from '../../api/routes/products';
import {
  IProductExtended,
  IProjectProductExtended
} from '../../interfaces/productInterfaces';

type ProductsProps = {
  data: any | null;
  attributesMeta: any | null;
  additionalDataInfo: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | any;
  roomPlannerProducts: Array<IProductExtended>;
  searchAllData: any | null;
  materialListing: any | null;
  collection: any | null;
  designer: any | null;
  selectedOptions: any | null;
  moodboardProducts: Array<IProjectProductExtended>;
  categoryProducts: {
    products: any;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | any;
  };
};

const initialState: ProductsProps = {
  data: [],
  attributesMeta: [],
  additionalDataInfo: null,
  status: 'idle',
  error: undefined,
  roomPlannerProducts: [],
  searchAllData: [],
  materialListing: [],
  collection: null,
  designer: null,
  moodboardProducts: [],
  selectedOptions: {},
  categoryProducts: {
    products: [],
    status: 'idle',
    error: ''
  }
};

async function getProductOptionsCategorieList(productData: any) {
  const attributes = JSON.parse(
    productData?.data?.products?.items[0]?.visiture_custom_attributes
  );
  if (!attributes) return null;
  const options = attributes?.find(
    item => item?.attribute_code === 'options_json'
  );
  if (!options) return null;
  const productOptionsSKUs = JSON.parse(options?.value)?.map(item => item?.sku);
  if (!productOptionsSKUs) return null;

  const { data: materials, error: materialsError } = await fetchProducts({
    filter: {
      sku: {
        in: productOptionsSKUs
      }
    }
  });
  if (materialsError) return null;

  const optionsList = materials?.data?.products?.items;

  const optionCategories = optionsList.map(item => {
    const category = item?.categories?.reduce((prev, curr) =>
      prev.level > curr.level ? prev : curr
    );
    return category?.name;
  });

  const uniqueOptionsCategories = optionCategories?.filter(
    (item, index) => optionCategories?.indexOf(item) === index
  );

  const categoriesList = uniqueOptionsCategories?.map(item => ({
    categoryName: item,
    categoryArray: []
  }));

  optionsList?.forEach(item => {
    const category = item?.categories?.reduce((prev, curr) =>
      prev.level > curr.level ? prev : curr
    );
    categoriesList
      ?.find(cat => cat?.categoryName === category?.name)
      ?.categoryArray?.push(item);
  });

  return categoriesList ?? null;
}

const getCollection = async (productData: any) => {
  const id = productData?.data?.products?.items[0]?.collection_category_id;

  const { data, error } = await getProductCollectionOrDesignerApi({
    id
  });

  if (error) return null;

  return data?.category || null;
};

const getDesigner = async (productData: any) => {
  const id = productData?.data?.products?.items[0]?.designer_category_id;

  const { data, error } = await getProductCollectionOrDesignerApi({
    id
  });

  if (error) return null;

  return data?.category || null;
};

export const getProducts = createAsyncThunk(
  'products/get',
  async (payload: any, { rejectWithValue }) => {
    const { data, error } = await fetchProducts(payload);

    if (error) return rejectWithValue(error);

    const categoriesList = await getProductOptionsCategorieList(data);

    const productCollection = await getCollection(data);

    const productDesigner = await getDesigner(data);

    return {
      data,
      materials: categoriesList,
      collection: productCollection,
      designer: productDesigner
    };
  }
);

export const getInfiniteProducts = createAsyncThunk(
  'products/get-with-infinite-scroll',
  async (payload: any, { rejectWithValue }) => {
    const { data, error } = await fetchProducts(payload);

    if (error) return rejectWithValue(error);

    return data;
  }
);

export const getRoomPlannerProducts = createAsyncThunk(
  'products/room-planner',
  async (payload: Array<string>, { rejectWithValue }) => {
    const { data, error } = await fetchRoomPlannerProducts(payload);

    if (error) return rejectWithValue(error);

    return data.data.categoryList;
  }
);
export const getMoodboardProducts = createAsyncThunk(
  'products/moodboard',
  async (payload: Array<string>, { rejectWithValue }) => {
    const { data, error } = await fetchMoodbaordProducts(payload);

    if (error) return rejectWithValue(error);

    return data.data.categoryList;
  }
);

export const getSearchAll = createAsyncThunk(
  'products/search-all',
  async (searchTerm: string, { rejectWithValue }) => {
    const { data, error } = await searchAll(searchTerm);

    if (error) return rejectWithValue(error);

    // eslint-disable-next-line prefer-const
    let dataWithProductType: any[] = [...data];
    dataWithProductType.forEach((item: any) => {
      if (
        item?.type === 'Product' &&
        item?.categories?.find(cat => cat?.name === 'Materials')
      ) {
        item.type = 'Material';
      }
    });

    const result = {
      data: dataWithProductType,
      searchTerm
    };

    return result;
  }
);

export const getCategoryProducts = createAsyncThunk(
  'products/get-category-products',
  async (id: string, { rejectWithValue }) => {
    const { data, error } = await getCategoryProductsApi({ id });

    if (error) return rejectWithValue(error);

    return data?.category?.products?.items;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setRoomPlannerProducts: (
      state,
      { payload }: PayloadAction<Array<IProductExtended>>
    ) => {
      state.roomPlannerProducts = payload;
    },
    setSelectedOption: (state, { payload }: PayloadAction<any>) => {
      state.selectedOptions = { ...state.selectedOptions, ...payload };
    },
    setMoodboardProducts: (
      state,
      { payload }: PayloadAction<Array<IProjectProductExtended>>
    ) => {
      state.moodboardProducts = payload;
    },
    resetProductState: state => {
      state.data = [];
      state.status = 'idle';
      state.error = undefined;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProducts.fulfilled, (state, action: any) => {
        state.status = 'succeeded';
        state.data = action.payload.data.data.products.items;
        state.attributesMeta =
          action.payload.data.data.product_attributes.items;
        state.additionalDataInfo = {
          ...action.payload.data.data.products,
          items: undefined
        };
        state.materialListing = action.payload.materials;
        state.collection = action.payload.collection;
        state.designer = action.payload.designer;
        state.error = '';
      })
      .addCase(getProducts.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getInfiniteProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(getInfiniteProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = [...state.data, ...action.payload.data.products.items];

        state.additionalDataInfo = {
          ...action.payload.data.products,
          items: undefined
        };
        state.error = '';
      })
      .addCase(getInfiniteProducts.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getSearchAll.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSearchAll.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchAllData = action.payload;
        state.error = '';
      })
      .addCase(getSearchAll.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getCategoryProducts.pending, state => {
        state.categoryProducts.status = 'loading';
      })
      .addCase(getCategoryProducts.fulfilled, (state, action) => {
        state.categoryProducts.status = 'succeeded';
        state.categoryProducts.products = action.payload;
        state.categoryProducts.error = '';
      })
      .addCase(getCategoryProducts.rejected, (state, action: any) => {
        state.categoryProducts.status = 'failed';
        state.categoryProducts.error = action.payload.message;
      });
  }
});

export const {
  setRoomPlannerProducts,
  setSelectedOption,
  setMoodboardProducts,
  resetProductState
} = productsSlice.actions;
export const selectStatus = (state: any) => state.products.status;
export const selectError = (state: any) => state.products.error;
export const selectProductsData = (state: any) => state.products.data;
export const selectProductAttributesMeta = (state: any) =>
  state.products.attributesMeta;
export const selectAdditionalDataInfo = (state: any) =>
  state.products.additionalDataInfo;
export const selectSearchAllData = (state: any) => state.products.searchAllData;
export const selectMaterialListing = (state: any) =>
  state?.products?.materialListing;
export const selectCollection = (state: any) => state?.products?.collection;
export const selectDesigner = (state: any) => state?.products?.designer;
export const selectSelectedOptions = (state: any) =>
  state.products.selectedOptions;
export const selectCategoryProducts = (state: any) =>
  state?.products?.categoryProducts?.products;
export const selectCategoryProductsStatus = (state: any) =>
  state?.products?.categoryProducts?.status;
export const selectCategoryProductsError = (state: any) =>
  state?.products?.categoryProducts?.error;

export default productsSlice.reducer;
