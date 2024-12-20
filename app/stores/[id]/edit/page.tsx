"use client"

import {useEffect} from "react"
import { useForm } from "react-hook-form";
import { CATEGORY_ARR, FOOD_CERTIFY_ARR, STORE_TYPE_ARR } from "../../../../data/store";
import {toast} from "react-toastify";
import axios from "axios";
import AddressSearch from '../../../../components/AddressSearch'
import { StoreType } from "../../../../types/types";
import { useRouter } from 'next/navigation';
import {useQuery} from "@tanstack/react-query";
import Loading from "../../../../components/Loading";


//params는 App Router에서 자동으로 전달해주는 props
const StoreEditPage = ({ params }: { params: { id: string } }) => {

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StoreType>();

  const router = useRouter();
  const id = params.id;

  const fetchStore = async (id: string) => {
    const response = await axios(`/api/stores?id=${id}`);
    if (!response) {
      throw new Error('Network response was not ok');
    }
    return response.data as StoreType;
  };

  const { data, isError, isLoading , isSuccess} = useQuery({
    queryKey: [`store-${id}`],
    queryFn: () => fetchStore(id),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    refetchOnWindowFocus: false, // 창을 바꿀때마다 새로고침 되는걸 막는다
  });

  useEffect(() => {
    if(isSuccess) {
      setValue("id", data.id);
      setValue("name", data.name);
      setValue("phone", data.phone || "번호정보 없음");
      setValue("lat", data.lat);
      setValue("lng", data.lng);
      setValue("address", data.address);
      setValue("foodCertifyName", data.foodCertifyName);
      setValue("storeType", data.storeType);
      setValue("category", data.category || "업종구분 없음");
    }
  },[isSuccess, data])

  if (isError) return <div className='w-full h-screen mx-auto  pt-[30%] text-red-500 text-center font-semibold'>다시 시도해주세요</div>;

  if(isLoading) return <Loading/>



  return (
    <form className='px-4 md:max-w-4xl mx-auto py-8' 
      onSubmit={handleSubmit(async (data) => {

        try {
          const result = await axios.put("/api/stores", data);
          
          if(result.status === 200){
            //데이터 추가 성공
            toast.success("수정을 완료했습니다.");
          }else {
            //데이터 추가 실패
            toast.error("다시 시도해주세요.");
          }
        }catch (error) {
          console.log(error);
          toast.error("다시 시도해주세요.");
        }
      })}
    >
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">맛집 수정</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">아래 내용을 입력해서 맛집을 등록해주세요</p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                가게명
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  {...register("name", {required: true})}
                  placeholder="가게명 입력"
                  className="block w-full rounded-md border-0 p-1.5  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                {errors?.name?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                카테고리
              </label>
              <div className="mt-2">
                <select {...register("category", {required: true})} className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                  <option value="">카테고리 선택</option>
                  {
                    CATEGORY_ARR?.map( category => 
                    <option key={category} value={category}>{category}</option>)
                  }
                </select>
                {errors?.category?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                연락처
              </label>
              <div className="mt-2">
                <input
                  {...register("phone", {required: true})}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-effect sm:text-sm sm:leading-6"
                />
                {errors?.phone?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>


            <AddressSearch register={register} setValue={setValue} errors={errors} />

            <div className="sm:col-span-2 sm:col-start-1">
              <label htmlFor="foodCertifyName" className="block text-sm font-medium leading-6 text-gray-900">
                식품인증구분
              </label>
              <div className="mt-2">
                <select
                  {...register("foodCertifyName", {required: true})}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-effect sm:text-sm sm:leading-6">
                  <option value="">식품인증구분 선택</option>
                  {FOOD_CERTIFY_ARR?.map(data => <option key={data} value={data}>{data}</option>)}
                </select>
                {errors?.phone?.type === 'required' && (
                  <div className="pt-2 text-xs text-red-600">
                    필수  입력사항입니다.
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="storeType" className="block text-sm font-medium leading-6 text-gray-900">
                업종구분
              </label>
              <div className="mt-2">
                <select
                  {...register("storeType", {required: true})}
                  className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-effect sm:text-sm sm:leading-6">
                  
                  {data?.category ? (<option value="업종구분 없음" selected>업종구분 없음</option>) :
                  <>
                    <option value="">식품인증구분 선택</option>
                    {STORE_TYPE_ARR?.map(data => <option key={data} value={data}>{data}</option>)}
                  </>
                  }
                </select>
                  {errors?.phone?.type === 'required' && (
                    <div className="pt-2 text-xs text-red-600">
                      필수  입력사항입니다.
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.back() }
        >
          뒤로가기
        </button>
        <button
          type="submit"
          className="rounded-md bg-orange px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-effect focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-effect"
        >
          수정하기
        </button>
      </div>
    </form>
  )
}

export default StoreEditPage