export type LoginData = {
  email: string;
  password: string;
};

export type CreateEditProjectData = {
  input: {
    name?: string;
    entity_id?: string;
    moodboard_canvas_json?: string;
  };
  onSuccess?: () => void;
  onFailed?: () => void;
};

export type getProjectsData = {
  filter:
    | {
        entity_id: {
          eq?: string;
          in?: string[];
        };
        name: {
          match?: string;
        };
      }
    // eslint-disable-next-line @typescript-eslint/ban-types
    | {};
  sort:
    | {
        name?: 'ASC' | 'DESC';
        created_at?: 'ASC' | 'DESC';
        updated_at?: 'ASC' | 'DESC';
      }
    // eslint-disable-next-line @typescript-eslint/ban-types
    | {};
  pageSize?: number;
  currentPage?: number;
};

export type getProjectProductsData = {
  filter:
    | {
        entity_id: {
          eq?: string;
          in?: string[];
        };
        product_id: {
          eq?: string;
          in?: string[];
        };
        project_id: {
          eq?: string;
          in?: string[];
        };
      }
    // eslint-disable-next-line @typescript-eslint/ban-types
    | {};
  sort:
    | {
        entity_id?: 'ASC' | 'DESC';
        project_id?: 'ASC' | 'DESC';
        product_id?: 'ASC' | 'DESC';
        created_at?: 'ASC' | 'DESC';
        updated_at?: 'ASC' | 'DESC';
      }
    // eslint-disable-next-line @typescript-eslint/ban-types
    | {};
  pageSize?: number;
  currentPage?: number;
};

export type AddEditProjectMoodboardData = {
  input: {
    object_id: string;
    project_id: string;
    object_attributes: string;
    object_type:
      | 'PROJECT_PRODUCT'
      | 'PROJECT_IMAGE'
      | 'PROJECT_MATERIAL'
      | 'ADDITIONAL_PRODUCT';
    entity_id?: string;
  };
  onSuccess?: () => void;
  onFailed?: () => void;
};

export type GetProjectMoodboard = {
  filter:
    | {
        entity_id: {
          eq?: string;
          in?: string[];
        };
        object_id: {
          eq?: string;
          in?: string[];
        };
        object_type: {
          eq?: string;
          in?: string[];
        };
        project_id: {
          eq?: string;
          in?: string[];
        };
      }
    // eslint-disable-next-line @typescript-eslint/ban-types
    | {};
  sort:
    | {
        entity_id?: 'ASC' | 'DESC';
        project_id?: 'ASC' | 'DESC';
        object_id?: 'ASC' | 'DESC';
        object_type?: 'ASC' | 'DESC';
        created_at?: 'ASC' | 'DESC';
        updated_at?: 'ASC' | 'DESC';
      }
    // eslint-disable-next-line @typescript-eslint/ban-types
    | {};
  pageSize?: number;
  currentPage?: number;
};

export type RequestType = 'Both' | 'Product Quote' | 'Material Sample';
export type RequestFormState = 'Contact' | 'Shipping' | 'Product';

export type AddEditProductProjectType = {
  input: {
    entity_id?: string;
    productsId: string[];
    project_id: string;
  };
  onSuccess?: () => void;
  onFailed?: () => void;
};

export type AddEditProductProjectApiType = {
  input: {
    entity_id?: string;
    product_id: string;
    project_id: string;
  };
  onSuccess?: () => void;
  onFailed?: () => void;
};

export type getCategoryApiType = {
  id: string;
};
