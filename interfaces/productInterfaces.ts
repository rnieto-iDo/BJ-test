export interface IPriceDetails {
  value: number;
  currency: string;
}

export interface IPrice {
  regular_price: IPriceDetails;
  final_price: IPriceDetails;
}

export interface IPriceRange {
  minimum_price: IPrice;
  maximum_price: IPrice;
}

export interface IDescription {
  html: string;
}

export interface IImage {
  url: string;
  label: string;
  position: string | null;
}

export interface IDropDown {
  uid: string;
  sku: string;
  option_type_id: number;
  title: string;
  price: number;
  price_type: string;
  image?: string;
}

export interface ISelectedOption {
  option: string;
  optionId: string;
  value: string;
  valueId: string;
  valueSku: string;
}

export interface IOption {
  uid: string;
  option_id: string;
  required: boolean;
  title: string;
  dropDown: Array<IDropDown>;
}

export interface IProduct {
  id?: string;
  uid: string;
  threekit_asset_id: string;
  threekit_webgl_asset_id: string;
  nodeId?: string;
  sku: string;
  categoryId?: string;
  name: string;
  url_key: string;
  stock_status: string;
  options: Array<IOption>;
  selectedOptions?: Array<ISelectedOption>;
  image: IImage;
  small_image: IImage;
  thumbnail: IImage;
  short_description: IDescription;
  description: IDescription;
  price_range: IPriceRange;
  new_from_date: string | null;
  new_to_date: string | null;
  special_price: string | null;
  special_from_date: string | null;
  special_to_date: string | null;
  gift_message_available: string | null;
  country_of_manufacture: string | null;
  price_tiers: Array<number>;
  topView?: string;
  offsetX?: number;
  offsetY?: number;
  config_thumbnail?: string;
  angle?: number;
}
export interface IProjectProduct {
  uid: string;
  sku: string;
  categoryId?: string;
  name: string;
  url_key: string;
  stock_status: string;
  options: Array<IOption>;
  image: IImage;
  small_image: IImage;
  thumbnail: IImage;
  short_description: IDescription;
  description: IDescription;
  price_range: IPriceRange;
  new_from_date: string | null;
  new_to_date: string | null;
  special_price: string | null;
  special_from_date: string | null;
  special_to_date: string | null;
  gift_message_available: string | null;
  country_of_manufacture: string | null;
  price_tiers: Array<number>;
}

export interface IProductList {
  items: Array<IProduct>;
  page_info: {
    current_page: number;
    page_size: number;
  };
  total_count: number;
}

export interface ICategory {
  id: string;
  name: string;
  products: IProductList;
}

export interface IProductExtended extends IProduct {
  categoryId: string;
  categoryName: string;
  isSelected: boolean;
  isMagento?: boolean;
  is2DView?: boolean;
}
export interface IProjectProductExtended extends IProduct {
  type: string;
  categoryId: string;
  categoryName: string;
}
