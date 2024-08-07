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
  lat?: string | null
  lng?: string | null
  zoom?: number
}

export interface MarkersProps {
  storeDatas: StoreType[];
  setcurrentStore: Dispatch<SetStateAction<any>>;
}

export  interface MarkerProps {
  store: StoreType
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

export interface LocationType { 
  lat?: string | null;
  lng?: string | null;
  zoom?: number | null;
}

export interface SearchType {
  q?: string
  district?: string
}