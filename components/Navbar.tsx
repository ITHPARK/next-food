"use client"

// export default Navbarimport { useState } from "react";
import React, {useState, useCallback} from "react";
import Link from "next/link";
import { BiMenu } from "@react-icons/all-files/bi/BiMenu";
import { AiOutlineClose } from "@react-icons/all-files/ai/AiOutlineClose";
import {useSession, signOut} from "next-auth/react" 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, status } = useSession();

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);


  return (
    <>
      <div className="navbar"> 
        <Link className="navbar__logo" href="/">
          FTMAP
        </Link>
        <div className="navbar__list">
          <Link href="/stores" className="navbar__list--item" onClick={() => setIsOpen(false)}>
            맛집 목록
          </Link>
          <Link href="/stores/new" className="navbar__list--item" onClick={() => setIsOpen(false)}>
            맛집 등록
          </Link>
          <Link href="/users/likes" className="navbar__list--item" onClick={() => setIsOpen(false)}>
            찜한 가게
          </Link>
          
          {status === "authenticated" ? (
            <>
            <Link href="/users/mypage" className="navbar__list--item" onClick={() => setIsOpen(false)}>
              마이페이지
            </Link>
            <button type="button" 
               onClick={() => {
              signOut() 
              setIsOpen(false)}
            }
            >
              로그아웃
            </button>
            </>
            
          ) : (
            <Link href="/api/auth/signin" className="navbar__list--item" onClick={() => setIsOpen(false)}>
              로그인
            </Link>
          )}
        </div>
        {/* mobile button */}
        <div
          role="presentation"
          className="navbar__button"
          onClick={toggleMenu}
        >
          {isOpen ? <AiOutlineClose /> : <BiMenu />}
        </div>
      </div>
      {/* mobile navbar */}
      {isOpen && (
        <div className="navbar--mobile">
          <div className="navbar__list--mobile">
            <Link
              href="/stores?page=1"
              className="navbar__list--item--mobile"
              onClick={() => setIsOpen(false)}
            >
              맛집 목록
            </Link>
            <Link
              href="/stores/new"
              className="navbar__list--item--mobile"
              onClick={() => setIsOpen(false)}
            >
              맛집 등록
            </Link>
            <Link
              href="/users/likes"
              className="navbar__list--item--mobile"
              onClick={() => setIsOpen(false)}
            >
              찜한 가게
            </Link>
            {status === "authenticated" ? (
              <>
                <Link
                  href="/users/mypage"
                  className="navbar__list--item--mobile"
                  onClick={() => setIsOpen(false)}
                >
                  마이페이지
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  className="navbar__list--item--mobile text-left"
                >
                  로그아웃
                </button>
              </>
              
            ) : (
              <Link
                href="/api/auth/signin"
                className="navbar__list--item--mobile"
                onClick={() => setIsOpen(false)}
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// React.memo로 Navbar 메모이제이션
export default React.memo(Navbar);