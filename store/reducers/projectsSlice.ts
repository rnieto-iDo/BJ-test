import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  createProjectApi,
  getProjectImagesApi,
  getProjectMaterialsApi,
  getProjectsApi,
  getProjectsProductsApi,
  addEditProjectMoodboardApi,
  getProjectMoodboardApi,
  addEditProductProjectApi
} from '../../api/routes/projects';
import {
  CreateEditProjectData,
  getProjectProductsData,
  getProjectsData,
  AddEditProjectMoodboardData,
  GetProjectMoodboard,
  AddEditProductProjectType
} from '../../types/data.types';

type ProjectsType = {
  projects: {
    projectsList: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
  selectedProject: {
    project: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
  selectedProjectProducts: {
    products: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
  selectedProjectMaterials: {
    materials: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
  selectedProjectImages: {
    images: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
  selectedProjectMoodboard: {
    project: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
  addEditProductProject: {
    data: any | null;
    status: 'idle' | 'succeeded' | 'failed' | 'loading';
    error: string | any;
  };
};

const initialState: ProjectsType = {
  projects: {
    projectsList: [],
    status: 'idle',
    error: undefined
  },
  selectedProject: {
    project: null,
    status: 'idle',
    error: undefined
  },
  selectedProjectProducts: {
    products: null,
    status: 'idle',
    error: undefined
  },
  selectedProjectMaterials: {
    materials: null,
    status: 'idle',
    error: undefined
  },
  selectedProjectImages: {
    images: null,
    status: 'idle',
    error: undefined
  },
  selectedProjectMoodboard: {
    project: null,
    status: 'idle',
    error: undefined
  },
  addEditProductProject: {
    data: null,
    status: 'idle',
    error: undefined
  }
};

export const getProjects = createAsyncThunk(
  'projects/get',
  async (payload: getProjectsData, { rejectWithValue }) => {
    const { data, error } = await getProjectsApi(payload);
    if (error) return rejectWithValue(error);

    return data.getProjectsForUser;
  }
);

export const getSingleProject = createAsyncThunk(
  'projects/singleProject',
  async (payload: getProjectsData, { rejectWithValue }) => {
    const { data, error } = await getProjectsApi(payload);
    if (error) return rejectWithValue(error);

    return data.getProjectsForUser?.items[0];
  }
);

export const getSingleProjectProducts = createAsyncThunk(
  'projects/singleProjectProducts',
  async (payload: getProjectProductsData, { rejectWithValue }) => {
    const { data, error } = await getProjectsProductsApi(payload);
    if (error) return rejectWithValue(error);

    return data.getProjectProducts;
  }
);

export const getSingleProjectMaterials = createAsyncThunk(
  'projects/singleProjectMaterials',
  async (payload: getProjectProductsData, { rejectWithValue }) => {
    const { data, error } = await getProjectMaterialsApi(payload);
    if (error) return rejectWithValue(error);

    return data.getProjectMaterials;
  }
);

export const getSingleProjectImages = createAsyncThunk(
  'project/singleProjectImages',
  async (payload: getProjectProductsData, { rejectWithValue }) => {
    const { data, error } = await getProjectImagesApi(payload);
    if (error) return rejectWithValue(error);

    return data.getProjectImages;
  }
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (payload: CreateEditProjectData, { rejectWithValue }) => {
    const { onSuccess, onFailed, ...params } = payload;
    const { error } = await createProjectApi(params);
    if (error) {
      if (onFailed) {
        onFailed();
      }

      return rejectWithValue(error);
    }

    const { data, error: loadingProjectsError } = await getProjectsApi({
      filter: {},
      sort: { created_at: 'DESC' }
    });
    if (loadingProjectsError) return rejectWithValue(loadingProjectsError);

    if (onSuccess) {
      onSuccess();
    }

    return data.getProjectsForUser;
  }
);

export const editProject = createAsyncThunk(
  'projects/edit',
  async (payload: CreateEditProjectData, { rejectWithValue }) => {
    const { onSuccess, onFailed, ...params } = payload;
    const { error } = await createProjectApi(params);
    if (error) {
      if (onFailed) {
        onFailed();
      }
      return rejectWithValue(error);
    }

    const { data, error: loadingProjectsError } = await getProjectsApi({
      filter: {},
      sort: { created_at: 'DESC' }
    });
    if (loadingProjectsError) return rejectWithValue(loadingProjectsError);
    if (onSuccess) {
      onSuccess();
    }

    return data.getProjectsForUser;
  }
);

export const addEditProjectMoodboard = createAsyncThunk(
  'projects/add-project-moodboard',
  async (payload: AddEditProjectMoodboardData, { rejectWithValue }) => {
    const { onSuccess, onFailed, ...params } = payload;

    const { error } = await addEditProjectMoodboardApi(params);

    if (error) {
      if (onFailed) {
        onFailed();
      }
      return rejectWithValue(error);
    }

    const { data, error: loadingMoodboardError } = await getProjectMoodboardApi(
      { filter: { project_id: { eq: params?.input?.project_id } }, sort: {} }
    );

    if (loadingMoodboardError) return rejectWithValue(loadingMoodboardError);

    if (onSuccess) {
      onSuccess();
    }

    return data?.getProjectMoodboard;
  }
);

export const getProjectMoodboard = createAsyncThunk(
  'projects/get-projects-moodboard',
  async (payload: GetProjectMoodboard, { rejectWithValue }) => {
    const { data, error } = await getProjectMoodboardApi(payload);

    if (error) rejectWithValue(error);

    return data?.getProjectMoodboard;
  }
);

export const addOrEditProductInProject = createAsyncThunk(
  'projects/add-edit-product-to-project',
  async (payload: AddEditProductProjectType, { rejectWithValue }) => {
    const { onSuccess, onFailed, input } = payload;
    const { productsId, project_id } = input;

    if (productsId?.length === 1) {
      const { data, error } = await addEditProductProjectApi({
        input: { project_id, product_id: productsId[0] }
      });

      if (error) {
        if (onFailed) {
          onFailed();
        }
        return rejectWithValue(error);
      }

      if (onSuccess) {
        onSuccess();
      }

      return data?.addEditProjectProduct;
    }

    const promiseArray = productsId?.map(item =>
      addEditProductProjectApi({ input: { project_id, product_id: item } })
    );
    const response = await Promise.all(promiseArray);

    const errorArray = response?.filter(item => item?.error !== undefined);

    if (errorArray?.length > 0) {
      if (onFailed) {
        onFailed();
      }
      return rejectWithValue(errorArray);
    }

    if (onSuccess) {
      onSuccess();
    }

    return response?.map(item => item?.data?.addEditProjectProduct);
  }
);

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getProjects.pending, state => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'loading'
        }
      }))
      .addCase(getProjects.fulfilled, (state, action) => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'succeeded',
          projectsList: action.payload,
          error: ''
        }
      }))
      .addCase(getProjects.rejected, (state, action: any) => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'failed',
          projectsList: [],
          error: action.payload?.message
        }
      }))
      .addCase(createProject.pending, state => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'loading'
        }
      }))
      .addCase(createProject.fulfilled, (state, action) => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'succeeded',
          projectsList: action.payload,
          error: ''
        }
      }))
      .addCase(createProject.rejected, (state, action: any) => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'failed',
          error: action.payload?.message
        }
      }))
      .addCase(editProject.pending, state => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'loading'
        }
      }))
      .addCase(editProject.fulfilled, (state, action) => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'succeeded',
          projectsList: action.payload,
          error: ''
        }
      }))
      .addCase(editProject.rejected, (state, action: any) => ({
        ...state,
        projects: {
          ...state.projects,
          status: 'failed',
          error: action.payload?.message
        }
      }))
      .addCase(getSingleProject.pending, state => ({
        ...state,
        selectedProject: {
          ...state.selectedProject,
          status: 'loading'
        }
      }))
      .addCase(getSingleProject.fulfilled, (state, action) => ({
        ...state,
        selectedProject: {
          ...state.selectedProject,
          status: 'succeeded',
          project: action.payload,
          error: ''
        }
      }))
      .addCase(getSingleProject.rejected, (state, action: any) => ({
        ...state,
        selectedProject: {
          status: 'failed',
          project: null,
          error: action.payload?.message
        }
      }))
      .addCase(getSingleProjectProducts.pending, state => ({
        ...state,
        selectedProjectProducts: {
          ...state.selectedProjectProducts,
          status: 'loading'
        }
      }))
      .addCase(getSingleProjectProducts.fulfilled, (state, action) => ({
        ...state,
        selectedProjectProducts: {
          ...state.selectedProjectProducts,
          status: 'succeeded',
          products: action.payload,
          error: ''
        }
      }))
      .addCase(getSingleProjectProducts.rejected, (state, action: any) => ({
        ...state,
        selectedProjectProducts: {
          ...state.selectedProjectProducts,
          status: 'failed',
          products: null,
          error: action.payload?.message
        }
      }))
      .addCase(getSingleProjectMaterials.pending, state => ({
        ...state,
        selectedProjectMaterials: {
          ...state.selectedProjectMaterials,
          status: 'loading'
        }
      }))
      .addCase(getSingleProjectMaterials.fulfilled, (state, action) => ({
        ...state,
        selectedProjectMaterials: {
          ...state.selectedProjectMaterials,
          status: 'succeeded',
          materials: action.payload,
          error: ''
        }
      }))
      .addCase(getSingleProjectMaterials.rejected, (state, action: any) => ({
        ...state,
        selectedProjectMaterials: {
          ...state.selectedProjectMaterials,
          status: 'failed',
          materials: null,
          error: action.payload?.message
        }
      }))
      .addCase(getSingleProjectImages.pending, state => ({
        ...state,
        selectedProjectImages: {
          ...state.selectedProjectImages,
          status: 'loading'
        }
      }))
      .addCase(getSingleProjectImages.fulfilled, (state, action) => ({
        ...state,
        selectedProjectImages: {
          ...state.selectedProjectImages,
          status: 'succeeded',
          images: action.payload,
          error: ''
        }
      }))
      .addCase(getSingleProjectImages.rejected, (state, action: any) => ({
        ...state,
        selectedProjectImages: {
          ...state.selectedProjectImages,
          status: 'failed',
          images: null,
          error: action.payload?.message
        }
      }))
      .addCase(addEditProjectMoodboard.pending, state => ({
        ...state,
        selectedProjectMoodboard: {
          ...state.selectedProjectMoodboard,
          status: 'loading'
        }
      }))
      .addCase(addEditProjectMoodboard.fulfilled, (state, action) => ({
        ...state,
        selectedProjectMoodboard: {
          ...state.selectedProjectMoodboard,
          status: 'succeeded',
          project: action.payload,
          error: ''
        }
      }))
      .addCase(addEditProjectMoodboard.rejected, (state, action: any) => ({
        ...state,
        selectedProjectMoodboard: {
          ...state.selectedProjectMoodboard,
          status: 'failed',
          project: null,
          error: action.payload?.message
        }
      }))
      .addCase(getProjectMoodboard.pending, state => ({
        ...state,
        selectedProjectMoodboard: {
          ...state.selectedProjectMoodboard,
          status: 'loading'
        }
      }))
      .addCase(getProjectMoodboard.fulfilled, (state, action) => ({
        ...state,
        selectedProjectMoodboard: {
          ...state.selectedProjectMoodboard,
          status: 'succeeded',
          project: action.payload,
          error: ''
        }
      }))
      .addCase(getProjectMoodboard.rejected, (state, action: any) => ({
        ...state,
        selectedProjectMoodboard: {
          ...state.selectedProjectMoodboard,
          status: 'failed',
          project: null,
          error: action.payload?.message
        }
      }))
      .addCase(addOrEditProductInProject.pending, state => ({
        ...state,
        addEditProductProject: {
          ...state.addEditProductProject,
          status: 'loading'
        }
      }))
      .addCase(addOrEditProductInProject.fulfilled, (state, action) => ({
        ...state,
        addEditProductProject: {
          ...state.addEditProductProject,
          status: 'succeeded',
          data: action?.payload,
          error: ''
        }
      }))
      .addCase(addOrEditProductInProject.rejected, (state, action: any) => ({
        ...state,
        addEditProductProject: {
          ...state.addEditProductProject,
          status: 'succeeded',
          error: action?.payload?.message
        }
      }));
  }
});

export const selectProjects = (state: any) =>
  state?.projects?.projects?.projectsList;
export const selectProjectsStatus = (state: any) =>
  state?.projects?.projects?.status;
export const selectProjectsError = (state: any) =>
  state?.projects?.projects?.error;

export const selectSingleProject = (state: any) =>
  state?.projects?.selectedProject?.project;
export const selectSingleProjectStatus = (state: any) =>
  state?.projects?.selectedProject?.status;
export const selectSingleProjectError = (state: any) =>
  state?.projects?.selectedProject?.error;

export const selectSingleProjectProducts = (state: any) =>
  state?.projects?.selectedProjectProducts?.products;
export const selectSingleProjectProductsStatus = (state: any) =>
  state?.projects?.selectedProjectProducts?.status;
export const selectSingleProjectProductsError = (state: any) =>
  state?.projects?.selectedProjectProducts?.error;

export const selectSingleProjectMaterials = (state: any) =>
  state?.projects?.selectedProjectMaterials?.materials;
export const selectSingleProjectMaterialsStatus = (state: any) =>
  state?.projects?.selectedProjectMaterials?.status;
export const selectSingleProjectMaterialsError = (state: any) =>
  state?.projects?.selectedProjectMaterials?.error;

export const selectSingleProjectImages = (state: any) =>
  state?.projects?.selectedProjectImages?.images;
export const selectSingleProjectImagesStatus = (state: any) =>
  state?.projects?.selectedProjectImages?.status;
export const selectSingleProjectImagesError = (state: any) =>
  state?.projects?.selectedProjectImages?.error;

export const selectProjectMoodboard = (state: any) =>
  state?.projects?.selectedProjectMoodboard?.project;
export const selectProjectMoodboardStatus = (state: any) =>
  state?.projects?.selectedProjectMoodboard?.status;
export const selectProjectMoodboardError = (state: any) =>
  state?.projects?.selectedProjectMoodboard?.error;

export const selectAddedEditedProductProject = (state: any) =>
  state?.projects?.addEditProductProject?.data;
export const selectAddedEditedProductProjectStatus = (state: any) =>
  state?.projects?.addEditProductProject?.status;
export const selectAddedEditedProductProjectError = (state: any) =>
  state?.projects?.addEditProductProject?.error;

export default projectsSlice.reducer;
