import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';
import { CiSearch } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";
import { IoBagHandleOutline } from "react-icons/io5";

import darkLogo from '../../assets/images/logo-main.png'
import lightLogo from '../../assets/images/light-logo.png'
const navItems = [
  { title: 'jewellery', submenu: [
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
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
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

  //   const getLogoSrc = () => {
  //   if (isHeroPage) {
  //     return (scrolled || isNavActive) ? darkLogo : darkLogo;
  //   } else {
  //     return darkLogo;
  //   }
  // };
  const shouldShowNavItems = isHeroPage && !scrolled;

  const navbarClass = `navbar max-sm:hidden mt-6 ${
    isHidden ? '-translate-y-48 duration-300' : 'translate-y-0 duration-300'
  } ${navTextColor} ${scrolled || !isHeroPage || isNavActive ? 'bg-white' : 'bg-transparent'} ${
    isNavActive ? 'expanded' : ''
  }`;

  return (
   <>
   <Header />
   <nav  className={navbarClass}
        role="navigation"
        aria-label="Main navigation"
        >
    <div className='navTop relative px-10'>
        <div className='flex justify-between  w-60 bg-amber-00 font-light'>
            <h4 className='font-medium text-sm'>Contact us</h4>
            <h4 className='font-medium text-sm'>book an appointment</h4>
            {/* <button className='bg-[#f5e6d7] px-6 py-1 text-black rounded-xl font-semibold '>Contact us</button> */}
        </div>
      
        
            <img
              className="h-18 w-60 mt-2 object-contain cursor-pointer"
              // src={getLogoSrc()}
              src={darkLogo}
              alt="Dark logo"
              onClick={() => navigate('/')}
            />
          

         <div className='flex items-center justify-end w-72 '>
                      <CiSearch size={25} aria-hidden="true"/>

          <CiHeart size={24} aria-hidden="true" className='cursor-pointer' onClick={() => navigate('/wishlist')} />
          <CiUser size={22} aria-hidden="true" className='cursor-pointer' />
          <IoBagHandleOutline size={22} aria-hidden="true" className='cursor-pointer' onClick={() => navigate('/cart')} />

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