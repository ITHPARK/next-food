
import MapMarkerCmp from "../components/MapMarkerCmp";
import { StoreType } from "../types/types";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {ReactQueryDevtools} from "react-query/devtools"
import axios from "axios";

const queryClient = new QueryClient();


// 서버 측에서 데이터 패칭
const fetchStores = async() => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
  console.log('Fetch Response:', response); // 응답 확인

  if (!response) {
      throw new Error('Fetching failed');
  }
  return response.data;
  
}

const Home = async() => {

  const stores: StoreType[] = await fetchStores();
  

  return (
    
      <div>
        <QueryClientProvider client={queryClient}>
          <MapMarkerCmp stores={stores}/>
        </QueryClientProvider>
      </div>
    
    
    
  );
}

export default Home;


