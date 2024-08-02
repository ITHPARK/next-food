
import MapMarkerCmp from "../components/MapMarkerCmp";
import { StoreType } from "../types/types";
import axios from "axios";




// 서버 측에서 데이터 패칭
const fetchStores = async() => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);

  if (!response) {
      throw new Error('Fetching failed');
  }
  return response.data;
  
}

const Home = async() => {  

  return (
    
      <div className="pt-[52px]"> 
        <MapMarkerCmp/>
      </div>
    
    
    
  );
}

export default Home;


