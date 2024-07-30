
import MapMarkerCmp from "../components/MapMarkerCmp";
import { StoreType } from "../types/types";


// 서버 측에서 데이터 패칭
const fetchStores = async() => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/stores`);
  console.log('Fetch Response:', response); // 응답 확인

  if (!response.ok) {
      throw new Error('Fetching failed');
  }
  return response.json();
}

const Home = async() => {

  const stores: StoreType[] = await fetchStores();

  console.log(stores)
  

  return (
    <div>
      <MapMarkerCmp stores={stores}/>
    </div>
    
    
  );
}

export default Home;


