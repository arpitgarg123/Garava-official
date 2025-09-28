import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';
import { CiSearch } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { CiHeart } from "react-icons/ci";   
import { IoBagHandleOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

import darkLogo from '../../assets/images/logo-main.png'

import { selectIsAuthenticated, selectUser, selectIsAdmin } from '../../features/auth/selectors.js';
import { doLogout } from '../../features/auth/slice.js';
import { selectCartItemCount } from '../../features/cart/selectors.js';
const navItems = [
  { title: 'jewellery', submenu: [
     { label: 'Gifts for her', img: './src/assets/images/jewellry1.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/jewellry2.jpg' },
      { label: 'Gifts for him', img: './src/assets/images/jewellry3.jpg' },
      { label: 'Unisex gifts', img: './src/assets/images/jewellry4.png' },
  ] },
  { title: 'HIGH JEWELLERY ', submenu: [
     { label: 'fragnance', img: './src/assets/images/fragnance1.png' },
      { label: 'jewellery', img: './src/assets/images/jewellry4.png' },
      { label: 'jewellery', img: './src/assets/images/fragnance.png' },
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
     { label: 'jewellery', img: '/images/for-her.jpg' },
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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Auth state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isAdmin = useSelector(selectIsAdmin);
  const cartItemCount = useSelector(selectCartItemCount);
  
  // UI state
  const isHeroPage = location.pathname === '/';
  const [hovered, setHovered] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isNavActive = Boolean(hovered);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHidden, setIsHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

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
          <Link to='/contact' className='font-medium text-sm' >Contact us</Link>
            <h4 className='font-medium text-sm cursor-pointer' onClick={() => navigate('/appointment')}>book an appointment</h4>
            {/* <button className='bg-[#f5e6d7] px-6 py-1 text-black rounded-xl font-semibold '>Contact us</button> */}
        </div>
      
        
            <img
              className="h-18 w-60 mt-2 object-contain cursor-pointer"
              // src={getLogoSrc()}
              src={darkLogo}
              alt="Dark logo"
              onClick={() => navigate('/')}
            />
          

         <div className='flex items-center justify-end w-72 space-x-4'>
        {
          isAuthenticated ? (
            <>
              <CiSearch size={25} aria-hidden="true" className='cursor-pointer hover:opacity-70 transition-opacity'/>
              <CiHeart size={24} aria-hidden="true" className='cursor-pointer hover:opacity-70 transition-opacity' onClick={() => navigate('/wishlist')} />
              
              {/* Cart with badge */}
              <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/cart')}>
                <IoBagHandleOutline size={22} aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </div>
              
              {/* User menu */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-1 cursor-pointer hover:opacity-70 transition-opacity"
                  aria-label="User menu"
                >
                  <CiUser size={22} aria-hidden="true" />
                  <span className="text-sm font-medium">{user?.name || 'User'}</span>
                </button>
                
                {/* Dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user?.name}</div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                        {isAdmin && (
                          <div className="text-xs text-blue-600 font-medium">Admin</div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/profile');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </button>
                      
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          navigate('/orders');
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Orders
                      </button>
                      
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            navigate('/dashboard');
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      
                      <div className="border-t">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            dispatch(doLogout());
                            navigate('/');
                          }}
                          className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <FiLogOut className="mr-2" size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-black text-white px-6 py-2 cursor-pointer font-medium hover:bg-gray-800 transition-colors"
            >
              Login
            </button>
          )
        }
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