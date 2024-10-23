import { atom } from "recoil";
import {LocationType, StoreType, SearchType} from "../types/types";

const DEFAULT_LAT = "37.566826";
const DEFAULT_LNG = "126.978656";
const DEFAULT_ZOOM = 3;

export const mapState = atom<any>({
    key: 'mapState',
    default: null,
    dangerouslyAllowMutability: true,
});

export const currentStoreState = atom<StoreType | null>({
    key: "store",
    default: null,
});

export const locationState = atom<LocationType>({
    key: "location",
    default: {
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        zoom: DEFAULT_ZOOM,
    },
})

export const searchState = atom<SearchType | null>({
    key: "search",
    default: null,
})