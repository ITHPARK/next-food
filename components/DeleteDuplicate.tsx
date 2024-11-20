"use client"

import React from 'react';
import axios from 'axios';

const DeleteDuplicate = () => {
  
  const handleDeleteDuplicates = async () => {
    try {
      // 중복 데이터를 삭제하는 API 호출
      const response = await axios.post('/api/delete-duplicate'); // POST 요청으로 데이터 전송

      // 응답 처리
      const data = response.data; // 응답 데이터 받기
      console.log(data.message || '중복된 레코드가 성공적으로 삭제되었습니다!');
    } catch (error) {
      if(error instanceof Error) {// error를 Error 타입으로 캐스팅
        console.log('중복 삭제에 실패했습니다: ' + error.message);
      }
      
      console.log('오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <button onClick={handleDeleteDuplicates}>중복 데이터 삭제하기</button>
    </div>
  );
};

export default DeleteDuplicate;
