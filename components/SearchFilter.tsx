"use client"

import React from 'react'
import { AiOutlineSearch } from "@react-icons/all-files/ai/AiOutlineSearch";
import { DISTRICT_ARR } from '../data/store';
import { searchState } from '../atom';
import {useRecoilState} from "recoil"


const SearchFilter = () => {

    const [search, setSearch] = useRecoilState(searchState);

    console.log(search)

  return (
    <div className='flex flex-col md:flex-row gap-2 my-4'>
        <div className='flex items-center justify-center gap-2 w-full'>
        <AiOutlineSearch className='w-6 h-6' />
        <input 
            type="search" 
            onChange={(e) => setSearch({...search, q: e.target.value})}
            placeholder="음식점 검색" 
            className='block w-full p-3 text-sm text-gray-800 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500  outline-none'
        />
        </div>
        <select onChange={(e) => setSearch({...search, q: e.target.value})} className='bg-gray-50 border border-gray-300 text-gray-800 text-sm md:max-w-[200px] rounded-lg focus:border-blue-500 block w-full p-3 outline-none'>
            <option>지역 선택</option>

            {
                DISTRICT_ARR.map((data)=> {
                    return <option value={data} key={data}>{data}</option>
                })
            }
        </select>
    </div>
  )
}

export default SearchFilter
