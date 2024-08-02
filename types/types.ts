import { Dispatch, SetStateAction, ReactNode } from "react";

export interface StoreType {
  id: number;
  phone: string | null;
  address: string | null;
  lat: string;
  lng: string;
  name: string | null;
  category: string | null;
  storeType: string | null;
  foodCertifyName: string | null;
}

export interface MapProps {
  setMap: Dispatch<SetStateAction<any>>;
}

export interface MarkerProps {
  map: any
  storeDatas: StoreType[];
  setcurrentStore: Dispatch<SetStateAction<any>>;
}

export interface StoreBoxProps {
  store: any;
  setStore: Dispatch<SetStateAction<any>>;
}

export interface LayoutProps {
  //children은 ReactNode임
  children: ReactNode;
}

export interface StoreApiResponse {
  page?:number;
  data?: StoreType[];
  totalPage?: number;
  totalCount?: number;


}