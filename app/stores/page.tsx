

import React from 'react'
import StoreList from "../../components/StoreList"
import DeleteDuplicate from '../../components/DeleteDuplicate'



const StoreListPage = async() => {  

  return (
    <div className='px-4 md:max-w-5xl mx-auto pb-8'>
        <StoreList></StoreList> 
    </div>
  )
}

export default StoreListPage
