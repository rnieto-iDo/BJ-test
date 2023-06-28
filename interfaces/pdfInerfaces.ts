export interface IMaterial {
  title: string;
  value: string;
}

export interface IProduct {
  name: string;
  price: string;
  image: string;
  materials: Array<IMaterial> | undefined;
}

export interface IPDFDownload {
  url: string;
  productList: Array<IProduct>;
}

export interface IPDFShare extends IPDFDownload {
  email: string;
}