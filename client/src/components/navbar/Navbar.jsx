import { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';
import { CiSearch } from "react-icons/ci";
import { FaRegHeart } from "react-icons/fa";
import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";

import darkLogo from '../../assets/images/logo-main.png'
import lightLogo from '../../assets/images/light-logo.png'
const navItems = [
  { title: 'Jewelry', submenu: [
     { label: 'Gifts for her', img: './src/assets/images/jewellry1.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/jewellry2.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/jewellry3.jpg' },
      { label: 'Unisex gifts', img: './src/assets/images/jewellry4.png' },
  ] },
  { title: 'HIGH JEWELLERY ', submenu: [
     { label: 'Gifts for her', img: '/images/for-her.jpg' },
      { label: 'Gifts for him', img: '/images/for-him.jpg' },
      { label: 'Unisex gifts', img: '/images/unisex.jpg' },
  ] },
  { title: 'Fragrance', submenu: [
     { label: 'Gifts for her', img: './src/assets/images/fragnance1.png' },
      { label: 'Gifts for him', img: './src/assets/images/fragnance.png' },
      { label: 'Unisex gifts', img: './src/assets/images/f.png' },
  ] },
  { title: 'Services', submenu: [
     { label: 'Gifts for her', img: '/images/for-her.jpg' },
      { label: 'Gifts for him', img: '/images/for-him.jpg' },
      { label: 'Unisex gifts', img: '/images/unisex.jpg' },
  ] },
  { title: 'About Us', submenu: [
     { label: 'Gifts for her', img: '/images/for-her.jpg' },
      { label: 'Gifts for him', img: '/images/for-him.jpg' },
      { label: 'Unisex gifts', img: '/images/unisex.jpg' },
  ] },
  {title: 'Blogs', submenu: [
     { label: 'Gifts for her', img: '/images/for-her.jpg' },
      { label: 'Gifts for him', img: '/images/for-him.jpg' },
      { label: 'Unisex gifts', img: '/images/unisex.jpg' },
  ]},
  { title: 'News & Events', submenu: [
     { label: 'Gifts for her', img: '/images/for-her.jpg' },
      { label: 'Gifts for him', img: '/images/for-him.jpg' },
      { label: 'Unisex gifts', img: '/images/unisex.jpg' },
  ] },
];
const Navbar = () => {
  const [hovered, setHovered] = useState(null);
  const isNavActive = Boolean(hovered);
  return (
   <>
   <Header />
   <nav  className={`navbar max-sm:hidden`}
        role="navigation"
        aria-label="Main navigation"
        >
    <div className='navTop relative '>
        <div className='flex justify-between  w-72 font-light'>
            <CiSearch size={25} aria-hidden="true"/>
            <h4>Contact us</h4>
            <h4>book an appointment</h4>
            {/* <button className='bg-[#f5e6d7] px-6 py-1 text-black rounded-xl font-semibold '>Contact us</button> */}
        </div>
        {/* <img className='light-logo h-18 w-60 ' src="./src/assets/images/light-logo.png" alt="" />
        <img  className='dark-logo h-18 w-60 absolute left-[43.2%] top-1 ' src="./src/assets/images/logo-main.png" alt="" /> */}
        
            <img
              className="h-18 w-60 object-contain  transition duration-500"
              src={isNavActive ? darkLogo : lightLogo}
              alt="Dark logo"
            />
          

         <div className='flex items-center justify-end w-72 '>
          <CiHeart size={24} aria-hidden="true" />
          <CiUser size={22} aria-hidden="true" />
          <IoBagHandleOutline size={22} aria-hidden="true" />

         </div>
    </div>
    <div className='flex-center '>
       {navItems.map((item, idx) => (
          <NavItem
            key={idx}
            item={item}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
    </div>
   </nav>
   </>
  );
}

export default Navbar;