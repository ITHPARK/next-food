
# :pushpin: NEXT.JS로 만든 맛집 앱
>[ Project URL ] : [https://www.next-food-map.shop](https://www.next-food-map.shop)
> 

</br>

## 1. 프로젝트 소개
해당 앱은 맛집의 위치와 상세 정보를 제공하는 앱으로써 카카오지도 API 통해 음식점의 위치를 지도에서 확인이 가능하며 음식점에 대한 상세 정보와 댓글을 확인 할 수 있으며, 구글, 네이버, 카카오 로그인을 지원하고 로그인 시 맛집 추가, 수정, 삭제, 댓글달기, 찜하기 기능을 지원합니다.

</br>

## 2. 사용 기술
#### `Front-end`
  - Next.js
  - Typescript
  - Tainwind CSS
  - Recoil
  - React Query v4
#### `Other`
  - 스키마 구성 -> Prisma
  - 데이터 베이스 -> Supabase

</br>

## 3. 주요 구현
- prisma를 이용한 유저정보, 식당정보, 계정, 로그인 세션, 토큰, 좋아요, 댓글 스키마를 정의 및 supabase로 연동해 데이터베이스 구현.
- 스카마와 데이터베이스를 바탕으로 클라이언트측에서 NextRoute를 기능별 route를 구성하여 CRUD 구현.
- NextAuth로 구글, 네이버, 카카오 로그인 구현 및 jwt 토큰으로 세션정보를 받거나 서버와 통신.
- 카카오지도API를 사용해 각 식당의 위치를 지도에 표시 및 클릭시 팝업을 뛰워 간략한 정보를 제공 및 상세페이지 링크 이동 가능.
- 맛집 리스트 페이지 구현 및 식당이름 검색 기능과 지역별 식당 리스트 검색 가능
- 로그인 시 식당 리스트 댓글달기, 및 DaumPostCode로 주소검색하여 맛집 등록기능, 찜하기, 맛집 수정, 삭제 기능 구현.
- [Go to Installation Guide](#1-프로젝트-소개)

<br/>

## 4. 주요 소스코드

```
손 쉽게 만들 수 있는
코드블럭
```

###


### p


<br/>

  

  



