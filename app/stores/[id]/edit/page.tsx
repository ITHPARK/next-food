import React from 'react'

interface StoreEditProps {
    params: {
      id: string;
    };
  }


const StoreEdit:React.FC<StoreEditProps> = ({params}) => {

    const {id} = params;


  return (
    <div>
        <h1>store edit {id}</h1>
    </div>
  )
}

export default StoreEdit