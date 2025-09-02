import { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';
import { CiSearch } from "react-icons/ci";
import { FaUserLarge } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
const navItems = [
  { title: 'Jewelry', submenu: [
     { label: 'Gifts for her', img: './src/assets/images/jewellry1.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/jewellry2.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/jewellry3.jpg' },
      { label: 'Unisex gifts', img: './src/assets/images/jewellry4.png' },
  ] },
  { title: 'Fragrance', submenu: [
     { label: 'Gifts for her', img: './src/assets/images/fragnance1.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/fragnance2.jpg' },
      { label: 'Unisex gifts', img: './src/assets/images/fragnance3.jpg' },
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

  return (
   <>
   <Header />
   <nav className={`navbar `}>
    <div className='navTop relative'>
        <div className='flex'>
            <CiSearch size={25}/>
            <h2 className='text-lg'>Search</h2>
        </div>
        <img className='h-20 w-80 ' src="./src/assets/images/logo-main.png" alt="" />
         <div className='flex'>
          <FaUserLarge size={24} />
          <FaShoppingCart size={28} />

         </div>
    </div>
    <div className='flex-center'>
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