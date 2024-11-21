"use client"

import React, {useState} from 'react'
import {AddressProps} from "../types/types";
import DaumPostcodeEmbed from 'react-daum-postcode';
import {StoreType} from "../types/types";


const AddressSearch = ({register, errors, setValue}: AddressProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const handleComplete = (data: any) => {
        let fullAddress = data.address;
        let extraAddress = '';
    
        //R은 도로명 주소를 뜻한다.
        if (data.addressType === 'R') {
            if (data.bname !== '') {
            extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
            extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName;
            }
            fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }
    
        setValue("address", fullAddress);
        setIsOpen(false);
    };

    return (
        <>
            <div className="col-span-full">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">
                주소 (다음 주소 검색 API) 
                </label>
                <div className="mt-2">
                    <div className='grid grid-cols-3 md:grid-cols-6 gap-6'>
                        <input
                            readOnly
                            placeholder='주소를 검색해주세요'
                            {...register("address", {required: true})}
                            className="col-span-2 block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-effect sm:text-sm sm:leading-6"
                        />
                        <button type='button'
                            onClick={() => setIsOpen((val) => !val)}
                            className='bg-orange hover:bg-orange-effect py-1.5 px-2 rounded text-white'
                        >
                            주소 검색
                        </button>
                    </div>
                    {errors?.phone?.type === 'required' && (
                        <div className="pt-2 text-xs text-red-600">
                        필수  입력사항입니다.
                        </div>
                    )}
                </div>
            </div>
            {isOpen && (
                <div className='border border-gray-300 w-full col-span-full md:col-span-3 rounded-md p-2'>
                    <DaumPostcodeEmbed onComplete={handleComplete}/>
                </div>
            )}
        </>
        
    )
}

export default AddressSearch
