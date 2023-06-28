import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  fetchAboutUsContent,
  fetchCollectionContent,
  fetchCollectionsContent,
  fetchHomeContent,
  fetchMaterialsContent,
  fetchProductDetailsContent,
  fetchProductsContent,
  fetchDiscoverDesignersContent,
  fetchRepresentativesContent,
  fetchTimelineContent,
  fetchAllLookBookContent,
  fetchLocationsPageContent,
  fetchNewsroomPageContent,
  fetchIndividualDesignerContent,
  fetchIndividualLookbookContent,
  fetchTimelinePageContent,
  fetchShowroomContent,
  fetchNavigationContent,
  fetchPressPageContent,
  fetchIndividualNewsPageContent,
  fetchCartPageContent,
  fetchLegalPageContent,
  fetchSearchBarContent,
  fetchFooterContent,
  fetchProjectSanityGallery,
  fetchSupportPageContent,
  fetchClaimsAndWarrantyPageContent,
  fetchCareAndMaintenancePageContent,
  fetchFaqPageContent,
  fetchTehnicianLocatorPageContent,
  fetchContactPageContent,
  fetchRegisterPageContent
} from '../../api/routes/pages';

type AuthState = {
  cmsData: any | null;
  productsPageCmsData: any | null;
  productDetailsCmsData: any | null;
  timelineCmsData: any | null;
  lookBooksCmsData: any | null;
  navigationData: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | any;
  individualDesignerCmsData: any | null;
  individualCollectionsCmsData: any | null;
  legalCmsData: any | null;
  individualLookbookCmsData: any | null;
  showroomCmsData: any | null;
  newsroomCmsData: any | null;
  pressCmsData: any | null;
  designersCmsData: any | null;
  individualNewsCmsData: any | null;
  searchBarCmsData: any | null;
  footerCmsData: any | null;
  projectGalleryData: any | null;
  supportCmsData: any | null;
  claimsAndWarrantyCmsData: any | null;
  careAndMaintenanceCmsData: any | null;
  faqCmsData: any | null;
  tehnicianLocatorCmsData: any | null;
  contactPageCmsData: any | null;
  registerPageCmsData: any | null;
};

const initialState: AuthState = {
  cmsData: null,
  productsPageCmsData: undefined,
  productDetailsCmsData: undefined,
  timelineCmsData: undefined,
  lookBooksCmsData: undefined,
  navigationData: undefined,
  status: 'idle',
  error: undefined,
  individualDesignerCmsData: undefined,
  individualCollectionsCmsData: undefined,
  legalCmsData: undefined,
  individualLookbookCmsData: undefined,
  showroomCmsData: undefined,
  newsroomCmsData: undefined,
  pressCmsData: undefined,
  designersCmsData: undefined,
  individualNewsCmsData: undefined,
  searchBarCmsData: undefined,
  footerCmsData: undefined,
  projectGalleryData: undefined,
  supportCmsData: undefined,
  claimsAndWarrantyCmsData: undefined,
  careAndMaintenanceCmsData: undefined,
  faqCmsData: undefined,
  tehnicianLocatorCmsData: undefined,
  contactPageCmsData: undefined,
  registerPageCmsData: undefined
};

export const getCollectionContent = createAsyncThunk(
  'pages/collections-cms-data',
  async () => {
    const data = await fetchCollectionsContent();
    return data;
  }
);
export const getHomePageContent = createAsyncThunk(
  'pages/home-cms-data',
  async () => {
    const data = await fetchHomeContent();
    return data;
  }
);

export const getCollectionPageContent = createAsyncThunk(
  'pages/collection-cms-data',
  async (slug: string) => {
    const data = await fetchCollectionContent(slug);
    return data;
  }
);

export const getShowroomPageContent = createAsyncThunk(
  'pages/showroom-cms-data',
  async (slug: string) => {
    const data = await fetchShowroomContent(slug);
    return data;
  }
);

export const getProductsPageContent = createAsyncThunk(
  'pages/products-cms',
  async (slug: string | string[]) => {
    const data = await fetchProductsContent(slug);
    return data;
  }
);

export const getProductDetailsPageContent = createAsyncThunk(
  'pages/product-details-cms',
  async (slug: string | string[]) => {
    const data = await fetchProductDetailsContent(slug);
    return data;
  }
);

export const getMaterialsPageContent = createAsyncThunk(
  'pages/materials-cms',
  async () => {
    const data = await fetchMaterialsContent();
    return data;
  }
);

export const getNavigationContent = createAsyncThunk(
  'pages/navigation',
  async () => {
    const data = await fetchNavigationContent();
    return data;
  }
);

export const getTimelineContent = createAsyncThunk(
  'pages/timeline-cms',
  async () => {
    const data = await fetchTimelineContent();
    return data;
  }
);

export const getRepresentativesPageContent = createAsyncThunk(
  'pages/representatives-cms',
  async () => {
    const data = await fetchRepresentativesContent();
    return data;
  }
);
export const getDiscoverDesignersPageContent = createAsyncThunk(
  'pages/discover-designers-cms-data',
  async () => {
    const data = await fetchDiscoverDesignersContent();
    return data;
  }
);

export const getDiscoverIndividualDesignerPageContent = createAsyncThunk(
  'pages/discover-individual-designer-cms-data',
  async (slug: string | string[]) => {
    const data = await fetchIndividualDesignerContent(slug);
    return data;
  }
);

export const getAboutUsPageContent = createAsyncThunk(
  'pages/about-us-cms',
  async () => {
    const data = await fetchAboutUsContent();
    return data;
  }
);

export const getAllLookBookPageContent = createAsyncThunk(
  'pages/lookbooks-cms',
  async () => {
    const data = await fetchAllLookBookContent();
    return data;
  }
);
export const getIndividualLookbookPageContent = createAsyncThunk(
  'pages/individual-lookbooks-cms',
  async (slug: string | string[]) => {
    const data = await fetchIndividualLookbookContent(slug);
    return data;
  }
);

export const getLocationsPageContent = createAsyncThunk(
  'pages/locations-cms',
  async () => {
    const data = await fetchLocationsPageContent();
    return data;
  }
);

export const getNewsroomPageContent = createAsyncThunk(
  'pages/newsroom-cms',
  async () => {
    const data = await fetchNewsroomPageContent();
    return data;
  }
);

export const getPressTypePageContent = createAsyncThunk(
  'pages/press-cms',
  async () => {
    const data = await fetchPressPageContent();
    return data;
  }
);

export const getIndividualNewsContent = createAsyncThunk(
  'pages/individual-news-cms',
  async (slug: string | string[]) => {
    const data = await fetchIndividualNewsPageContent(slug);
    return data;
  }
);

export const getTimelinePageContent = createAsyncThunk(
  'pages/timeline-page-cms',
  async () => {
    const data = await fetchTimelinePageContent();
    return data;
  }
);

export const getLegalPageTypeContent = createAsyncThunk(
  'pages/legal-page-cms',
  async (slug: string | string[]) => {
    const data = await fetchLegalPageContent(slug);
    return data;
  }
);

export const getCartTypePageContent = createAsyncThunk(
  'pages/cart-cms',
  async () => {
    const data = await fetchCartPageContent();
    return data;
  }
);

export const getSearchBarContent = createAsyncThunk(
  'pages/searchbar-cms',
  async () => {
    const data = await fetchSearchBarContent();
    return data;
  }
);

export const getFooterContent = createAsyncThunk(
  'pages/footer-cms',
  async () => {
    const data = await fetchFooterContent();
    return data;
  }
);

export const getProjectSanityGallery = createAsyncThunk(
  'pages/project-gallery',
  async () => {
    const data = await fetchProjectSanityGallery();
    return data;
  }
);

export const getSupportPageContent = createAsyncThunk(
  'pages/support-cms',
  async () => {
    const data = await fetchSupportPageContent();
    return data;
  }
);

export const getClaimsAndWarrantyPageContent = createAsyncThunk(
  'pages/claims-and-warranty-cms',
  async () => {
    const data = await fetchClaimsAndWarrantyPageContent();
    return data;
  }
);

export const getCareAndMaintenancePageContent = createAsyncThunk(
  'pages/care-and-maintenance-cms',
  async () => {
    const data = await fetchCareAndMaintenancePageContent();
    return data;
  }
);

export const getFaqPageContent = createAsyncThunk('pages/faq-cms', async () => {
  const data = await fetchFaqPageContent();
  return data;
});

export const getTehnicianLocatorPageContent = createAsyncThunk(
  'pages/tehnician-locator-cms',
  async () => {
    const data = await fetchTehnicianLocatorPageContent();
    return data;
  }
);

export const getContactPageContent = createAsyncThunk(
  'pages/contact-cms',
  async () => {
    const data = await fetchContactPageContent();
    return data;
  }
);

export const getRegisterPageContent = createAsyncThunk(
  'pages/register-cms',
  async () => {
    const data = await fetchRegisterPageContent();
    return data;
  }
);

const pagesSlice = createSlice({
  name: 'pages',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getCollectionContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getCollectionContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getCollectionContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getProductsPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProductsPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productsPageCmsData = action.payload;
        state.error = '';
      })
      .addCase(getProductsPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getCollectionPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getCollectionPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.individualCollectionsCmsData = action.payload;
        state.error = '';
      })
      .addCase(getCollectionPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getHomePageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getHomePageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getHomePageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getProductDetailsPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProductDetailsPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetailsCmsData = action.payload;
        state.error = '';
      })
      .addCase(getProductDetailsPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getDiscoverDesignersPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getDiscoverDesignersPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.designersCmsData = action.payload;
        state.error = '';
      })
      .addCase(
        getDiscoverDesignersPageContent.rejected,
        (state, action: any) => {
          state.status = 'failed';
          state.error = action?.payload?.message;
        }
      )
      .addCase(getDiscoverIndividualDesignerPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(
        getDiscoverIndividualDesignerPageContent.fulfilled,
        (state, action) => {
          state.status = 'succeeded';
          state.individualDesignerCmsData = action.payload;
          state.error = '';
        }
      )
      .addCase(
        getDiscoverIndividualDesignerPageContent.rejected,
        (state, action: any) => {
          state.status = 'failed';
          state.error = action?.payload?.message;
        }
      )
      .addCase(getMaterialsPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getMaterialsPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getMaterialsPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getNavigationContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getNavigationContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.navigationData = action.payload;
        state.error = '';
      })
      .addCase(getNavigationContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getTimelineContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTimelineContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.timelineCmsData = action.payload;
        state.error = '';
      })
      .addCase(getTimelineContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getRepresentativesPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getRepresentativesPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getRepresentativesPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getAllLookBookPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAllLookBookPageContent.fulfilled, (state, action: any) => {
        state.status = 'succeeded';
        state.lookBooksCmsData = action.payload;
        state.error = '';
      })
      .addCase(getAllLookBookPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getAboutUsPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getAboutUsPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getAboutUsPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getLocationsPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getLocationsPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getNewsroomPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getNewsroomPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.newsroomCmsData = action.payload;
        state.error = '';
      })
      .addCase(getPressTypePageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getPressTypePageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pressCmsData = action.payload;
        state.error = '';
      })
      .addCase(getIndividualNewsContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getIndividualNewsContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.individualNewsCmsData = action.payload;
        state.error = '';
      })
      .addCase(getIndividualLookbookPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getIndividualLookbookPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.individualLookbookCmsData = action.payload;
        state.error = '';
      })
      .addCase(
        getIndividualLookbookPageContent.rejected,
        (state, action: any) => {
          state.status = 'failed';
          state.error = action?.payload?.message;
        }
      )
      .addCase(getShowroomPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getShowroomPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.showroomCmsData = action.payload;
        state.error = '';
      })
      .addCase(getShowroomPageContent.rejected, state => {
        state.status = 'failed';
      })
      .addCase(getLocationsPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getTimelinePageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTimelinePageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getTimelinePageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action?.payload?.message;
      })
      .addCase(getLegalPageTypeContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getLegalPageTypeContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.legalCmsData = action.payload;
        state.error = '';
      })
      .addCase(getCartTypePageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getCartTypePageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cmsData = action.payload;
        state.error = '';
      })
      .addCase(getCartTypePageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getSearchBarContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSearchBarContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.searchBarCmsData = action.payload;
        state.error = '';
      })
      .addCase(getSearchBarContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getFooterContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getFooterContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.footerCmsData = action.payload;
        state.error = '';
      })
      .addCase(getFooterContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getProjectSanityGallery.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProjectSanityGallery.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.projectGalleryData = action.payload;
        state.error = '';
      })
      .addCase(getProjectSanityGallery.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getSupportPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSupportPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.supportCmsData = action.payload;
        state.error = '';
      })
      .addCase(getSupportPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getClaimsAndWarrantyPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getClaimsAndWarrantyPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.claimsAndWarrantyCmsData = action.payload;
        state.error = '';
      })
      .addCase(
        getClaimsAndWarrantyPageContent.rejected,
        (state, action: any) => {
          state.status = 'failed';
          state.error = action.payload?.message;
        }
      )
      .addCase(getCareAndMaintenancePageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getCareAndMaintenancePageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.careAndMaintenanceCmsData = action.payload;
        state.error = '';
      })
      .addCase(
        getCareAndMaintenancePageContent.rejected,
        (state, action: any) => {
          state.status = 'failed';
          state.error = action.payload?.message;
        }
      )
      .addCase(getFaqPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getFaqPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.faqCmsData = action.payload;
        state.error = '';
      })
      .addCase(getFaqPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getTehnicianLocatorPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTehnicianLocatorPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tehnicianLocatorCmsData = action.payload;
        state.error = '';
      })
      .addCase(
        getTehnicianLocatorPageContent.rejected,
        (state, action: any) => {
          state.status = 'failed';
          state.error = action.payload?.message;
        }
      )
      .addCase(getContactPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getContactPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.contactPageCmsData = action.payload;
        state.error = '';
      })
      .addCase(getContactPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload?.message;
      })
      .addCase(getRegisterPageContent.pending, state => {
        state.status = 'loading';
      })
      .addCase(getRegisterPageContent.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.registerPageCmsData = action.payload;
      })
      .addCase(getRegisterPageContent.rejected, (state, action: any) => {
        state.status = 'failed';
        state.error = action.payload.message;
      });
  }
});

// export const {} = collectionsSlice.actions;
export const selectStatus = (state: any) => state.pages.status;
export const selectError = (state: any) => state.pages.error;
export const selectCMSData = (state: any) => state?.pages?.cmsData;

export const selectNavigationData = (state: any) =>
  state?.pages?.navigationData;
export const selectTimelineData = (state: any) => state?.pages?.timelineCmsData;
export const selectProductCMSData = (state: any) =>
  state?.pages?.productsPageCmsData;
export const selectProductDetailsCMSData = (state: any) =>
  state?.pages?.productDetailsCmsData;
export const selectAllLookBooksCmsData = (state: any) =>
  state?.pages?.lookBooksCmsData;
export const selectIndividualDesignerCmsData = (state: any) =>
  state?.pages?.individualDesignerCmsData;
export const selectIndividualCollectionsCmsData = (state: any) =>
  state?.pages?.individualCollectionsCmsData;
export const selectLegalCmsData = (state: any) => state?.pages?.legalCmsData;
export const selectIndividualLookbookCmsData = (state: any) =>
  state?.pages?.individualLookbookCmsData;
export const selectShowroomCmsData = (state: any) =>
  state?.pages.showroomCmsData;
export const selectNewsroomCmsData = (state: any) =>
  state?.pages.newsroomCmsData;
export const selectPressCmsData = (state: any) => state?.pages.pressCmsData;
export const selectDesignersCmsData = (state: any) =>
  state?.pages.designersCmsData;
export const selectIndividualNewsCmsData = (state: any) =>
  state?.pages.individualNewsCmsData;
export const selectSearchBarCmsData = (state: any) =>
  state?.pages.searchBarCmsData;
export const selectProjectGallery = (state: any) =>
  state?.pages.projectGalleryData;
export const selectFooterCmsData = (state: any) => state?.pages.footerCmsData;

export const selectSupportCmsData = (state: any) => state?.pages.supportCmsData;
export const selectClaimsAndWarrantyCmsData = (state: any) =>
  state?.pages.claimsAndWarrantyCmsData;
export const selectCareAndMaintenanceCmsData = (state: any) =>
  state?.pages.careAndMaintenanceCmsData;
export const selectFaqCmsData = (state: any) => state?.pages.faqCmsData;
export const selectTehnicianLocatorCmsData = (state: any) =>
  state?.pages.tehnicianLocatorCmsData;
export const selectContactPageCmsData = (state: any) =>
  state?.pages.contactPageCmsData;
export const selectRegisterPageCmsData = (state: any) =>
  state?.pages?.registerPageCmsData;
export default pagesSlice.reducer;
