import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';
import { CiSearch } from "react-icons/ci";
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
     { label: 'fragnance', img: './src/assets/images/fragnance1.png' },
      { label: 'jewelry', img: './src/assets/images/jewellry4.png' },
      { label: 'jewelry', img: './src/assets/images/fragnance.png' },
  ] },
  { title: 'Fragrance', submenu: [
     { label: 'Gifts for her', img: './src/assets/images/fragnance1.png' },
      { label: 'Gifts for him', img: './src/assets/images/fragnance.png' },
      { label: 'Unisex gifts', img: './src/assets/images/f.png' },
  ] },
  { title: 'Services', submenu: [
     { label: 'book an appointment', img: '/images/for-her.jpg' },
      { label: 'FAQ', img: '/images/for-him.jpg' },

  ] },
  { title: 'About Us', submenu: [
     { label: 'Our Story', img: '/images/for-her.jpg' },
  ] },
  {title: 'Blogs', submenu: [
     { label: 'Jewelry', img: '/images/for-her.jpg' },
      { label: 'Fragnance', img: '/images/for-him.jpg' },
      { label: 'GARAVA', img: '/images/unisex.jpg' },
  ]},
  { title: 'News & Events', submenu: [
     { label: 'Media Covarage', img: '/images/for-her.jpg' },
      { label: 'Events', img: '/images/for-him.jpg' },
  ] },
];
const Navbar = () => {
  const location = useLocation();
  const isHeroPage = location.pathname === '/';
  const [hovered, setHovered] = useState(null);
  const isNavActive = Boolean(hovered);
  const [lastScrollY, setLastScrollY] = useState(0); // Keeps track of last scroll position
  const [isHidden, setIsHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down
        setIsHidden(true);
      } else {
        // Scrolling up
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const navTextColor = isHeroPage && !scrolled ? 'text-white' : 'text-black';

    const getLogoSrc = () => {
    if (isHeroPage) {
      return (scrolled || isNavActive) ? darkLogo : lightLogo;
    } else {
      return darkLogo;
    }
  };
  const shouldShowNavItems = isHeroPage && !scrolled;

  return (
   <>
   <Header />
   <nav  className={`navbar max-sm:hidden ${
    isHidden ? '-translate-y-48 duration-700' : 'translate-y-0 duration-700'
   }  ${navTextColor} ${scrolled ? 'visible' : 'bg-transparent'}`}
        role="navigation"
        aria-label="Main navigation"
        >
    <div className='navTop relative '>
        <div className='flex justify-between  w-72 bg-amber-00 font-light'>
            <CiSearch size={25} aria-hidden="true"/>
            <h4 className='font-medium text-sm'>Contact us</h4>
            <h4 className='font-medium text-sm'>book an appointment</h4>
            {/* <button className='bg-[#f5e6d7] px-6 py-1 text-black rounded-xl font-semibold '>Contact us</button> */}
        </div>
      
        
            <img
              className="h-18 w-60 object-contain  "
              src={getLogoSrc()}
              alt="Dark logo"
            />
          

         <div className='flex items-center justify-end w-72 '>
          <CiHeart size={24} aria-hidden="true" />
          <CiUser size={22} aria-hidden="true" />
          <IoBagHandleOutline size={22} aria-hidden="true" />

         </div>
    </div>
    {shouldShowNavItems && (
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
    )}
   </nav>
   </>
  );
}

export default Navbar;