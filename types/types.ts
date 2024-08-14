import { Dispatch, SetStateAction, ReactNode } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'

export interface StoreType {
  id: number;
  phone: string | null;
  address: string | null;
  lat: string | null;
  lng: string | null;
  name: string | null;
  category: string | null;
  storeType: string | null;
  foodCertifyName: string | null;
  likes?: LikeInterface[]
}

export interface LikeInterface {
  id: number;
  storeId: number;
  userId: number;
  store?: StoreType;
}

export interface LikeApiResponse {
  data: LikeInterface[];
  totalPage?: number;
  page?: number
}

interface UserType {
  id: number;
  email: string
  name?: string | null
  image?: string | null;
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

export interface AddressProps {
  setValue: UseFormSetValue<StoreType>
  register: UseFormRegister<StoreType>
  errors: FieldErrors<StoreType>
}

export interface LikeProps {
  storeId: number;
}

export interface StoreListProps {
  store: StoreType;
  i: number;
}

export interface Pagiantion {
  total?: number;
  page: string;
  pathname: string;
}

export interface CommentProps {
  storeId: number;
}

export interface CommentInterface {
  id:number;
  storeId: number;
  userId: number;
  store?: StoreType;
  body: string;
  user?: UserType;
  createdAt: Date;
}

interface UserType {
  id: number;
  email: string;
  name?: string | null;
  image?: string | null;
}

export interface CommnetApiResponse {
  data: CommentInterface[];
  totalPage?: number;
  page?: number;
}

export interface CommnetListProps {
  comments?: CommnetApiResponse;
  displayStore?: boolean;
}