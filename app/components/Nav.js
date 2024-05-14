'use client'
import Image from "next/image";
// import logo from '../public/logo1-1.png'
import logo from "../../public/assets/images/Emzor-Logo-HIRES-1.jpg";
import { HiOutlineMoon } from "react-icons/hi";
import MobileMenu from "./MobileMenu";
import AppContext from '../context/AppContext'
import React, { useContext } from "react";

import Link from "next/link";
import Nav3 from "./Nav3";

function Nav() {
    const { currentUser, connectWallet } = useContext(AppContext);
  return (
    <div className="w-full h-24 bg-pharmaGreen-800">
      <div className="flex justify-between items-center p-4 md:w-10/12 md:mx-auto">
        <div>
          <Image className="w-28 cursor-pointer" src={logo} alt="logo" />
          <p className="flex justify-end text-xs text-white font-normal pl-2 cursor-pointer">
            Obimka Wenceslaus Somtochukwu
          </p>
        </div>
        <div className="hidden md:flex">
          <ul className="text-white flex space-x-4">
            <li className="font-normal p-1 cursor-pointer transition ease-linear duration-150 text-orange-400">
              <Link href="/">Home</Link>
            </li>
            <li className="font-normal p-1 cursor-pointer">
              <Link href="/products">Products</Link>
            </li>
            <li className="font-normal p-1 cursor-pointer">
              <Link href="/users">Users</Link>
            </li>
            {/*<li className='font-normal p-1 cursor-pointer'>Contact</li>*/}
          </ul>
          <div className="ml-3">
            {/* <ConnectKitButton /> */}
            <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6  md:flex md:space-y-0 md:mt-0">
              {currentUser ? (
                <p className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                  {currentUser.slice(0, 25)}...
                </p>
              ) : (
                <button
                  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
                  onClick={() => connectWallet()}
                >
                  Connect Wallet <Nav3 />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="md:hidden">
          <div className="flex items-center space-x-2 text-white">
            <div className="p-1 rounded-lg border border-pharmaGreen-700">
              <HiOutlineMoon
                className="text-pharmaGreen-700 cursor-pointer"
                size={21}
              />
            </div>
            {/* <div className='p-1 rounded-lg border border-pharmaGreen-700'>
                            <ConnectKitButton />
                        </div> */}
            <div className="flex-1 gap-x-6 items-center justify-end mt-6 space-y-6  md:flex md:space-y-0 md:mt-0">
              {currentUser ? (
                <p className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex">
                  {currentUser.slice(0, 25)}...
                </p>
              ) : (
                <button
                  className="flex items-center justify-center gap-x-1 py-2 px-4 text-white font-medium bg-gray-800 hover:bg-gray-700 active:bg-gray-900 rounded-full md:inline-flex"
                  onClick={() => connectWallet()}
                >
                  Connect Wallet <Nav3 />
                </button>
              )}
            </div>
            <MobileMenu />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Nav;
