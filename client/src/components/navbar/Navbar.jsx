import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';

import { CiSearch, CiUser, CiHeart, CiCalendarDate  } from "react-icons/ci";
import { PiBagLight , PiPhoneIncomingThin } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

import lightLogo from '../../assets/images/light-logo.png';
import darkLogo from '../../assets/images/logo-main.png';

// Jewellery images
import jewellry1 from '../../assets/images/earring.jpg';
import jewellry2 from '../../assets/images/jewellry2.webp';
import jewellry from '../../assets/images/jewellry1.webp';
import jewellry3 from '../../assets/images/pendant.jpg';
import jewellry4 from '../../assets/images/jewellry4.png';
import jewellry5 from '../../assets/images/ring.jpg';
import jewellry6 from '../../assets/images/bracelet.jpg';

// Fragrance images
import silaImg from '../../assets/images/sila.webp';
import evaraImg from '../../assets/images/evara.webp';
import mangataImg from '../../assets/images/mangata.webp';
import wayfarerImg from '../../assets/images/wayfarer.webp';

import { selectIsAuthenticated, selectUser, selectIsAdmin } from '../../features/auth/selectors.js';
import { doLogout } from '../../features/auth/slice.js';
import { selectCartItemCount } from '../../features/cart/selectors.js';

const navItems = [
  { title: 'jewellery', to: '/products/jewellery', submenu: [
    { 
        label: 'Rings', 
        img: jewellry5, 
        to: '/products/jewellery?category=rings',
        category: 'rings'
      },
     
    { 
        label: 'Earrings', 
        img: jewellry1, 
        to: '/products/jewellery?category=earrings',
        category: 'earrings'
      },
     
    { 
        label: 'Pendants', 
        img: jewellry3, 
        to: '/products/jewellery?category=pendants',
        category: 'pendants'
      },
        { 
        label: 'Bracelets', 
        img: jewellry6, 
        to: '/products/jewellery?category=bracelets',
        category: 'bracelets'
      },
     ]},
  { title: 'HIGH JEWELLERY', to: '/products/high-jewellery', submenu: [
    { 
        label: 'Daily Rrings', 
        img: jewellry2, 
        to: '/products/high-jewellery?category=daily-earrings',
        category: 'daily-earrings'
      },
      { 
        label: 'Solitaire Rings', 
        img: jewellry4, 
        to: '/products/high-jewellery?category=solitaire-rings',
        category: 'solitaire-rings'
      },
      { 
        label: 'Solitaire Studs', 
        img: jewellry, 
        to: '/products/high-jewellery?category=solitaire-studs',
        category: 'solitaire-studs'
      },
     
    ]},
  { title: 'Fragrance', to: '/products/fragrance', submenu: [
     { 
        label: 'Sila', 
        img: silaImg, 
        to: '/products/fragrance?category=sila',
        category: 'sila'
      },
       { 
        label: 'Evara', 
        img: evaraImg, 
        to: '/products/fragrance?category=evara',
        category: 'evara'
      },
       { 
        label: 'Mangata', 
        img: mangataImg, 
        to: '/products/fragrance?category=mangata',
        category: 'mangata'
      },
       { 
        label: 'Wayfarer', 
        img: wayfarerImg, 
        to: '/products/fragrance?category=wayfarer',
        category: 'wayfarer'
      },
  ]},
  { title: 'Maison', to: '/about', submenu: [
     { label: 'Book an Appointment',  to: '/appointment' },
     { label: 'FAQ',  to: '/faq' },
     { label: 'About',  to: '/detailed-about' },
     { label: 'Our Story',  to: '/our-story' },
  ]},
  { 
    title: 'Blogs',  to: '/blogs',
    submenu: [
      { 
        label: 'Jewellery', 
         
        to: '/blogs?category=jewellery',
        category: 'jewellery'
      },
      { 
        label: 'Fragrance',  
        to: '/blogs?category=fragrance',
        category: 'fragrance'
      },
      { 
        label: 'GARAVA', 
        img: '/images/blog-garava.webp', 
        to: '/blogs?category=garava',
        category: 'garava'
      },
     
    ]
  },
  { title: 'News & Events', to: '/events', submenu: [
     { label: 'Media Coverage', img: '/images/for-her.webp', to: '/media' },
     { label: 'Events', img: '/images/for-him.webp', to: '/events' },
  ]},
];

// Mobile NavItem Component for direct navigation
const MobileNavItem = ({ item, onNavigate }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleMainClick = () => {
    if (item.submenu && item.submenu.length > 0) {
      setExpanded(!expanded);
    } else {
      onNavigate();
      navigate('/products');
    }
  };

  const handleSubItemClick = (subItem) => {
    onNavigate();
    navigate(subItem.to);
  };

  return (
    <div>
      <button
        onClick={handleMainClick}
        className="flex items-center justify-between w-full text-left font-medium text-lg hover:text-gray-600 transition-colors"
      >
        {item.title}
        {item.submenu && item.submenu.length > 0 && (
          <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
            ↓
          </span>
        )}
      </button>
      
      {expanded && item.submenu && (
        <div className="mt-2 ml-4 space-y-2">
          {item.submenu.map((subItem, idx) => (
            <button
              key={idx}
              onClick={() => handleSubItemClick(subItem)}
              className="block w-full  text-left text-[1.0625rem] text-gray-600 hover:text-black transition-colors py-1"
            >
              {subItem.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Rest of your existing Navbar component code remains the same...
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

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide on scroll (desktop)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const scrollThreshold = 50; // Minimum scroll amount before hiding
          
          setScrolled(currentScrollY > 10);
          
          // Hide navbar when scrolling down past threshold
          if (currentScrollY > lastScrollY && currentScrollY > scrollThreshold) {
            setIsHidden(true);
          } 
          // Show navbar when scrolling up or at top
          else if (currentScrollY < lastScrollY || currentScrollY <= scrollThreshold) {
            setIsHidden(false);
          }
          
          setLastScrollY(currentScrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showUserMenu && !event.target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showUserMenu]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  const navTextColor = isHeroPage && !scrolled && !isNavActive ? 'text-white' : 'text-black';
  const shouldShowNavItemsDesktop = !scrolled;

  const navbarClass = `navbar hidden md:block py-3.5 transition-all duration-500 ease-out ${
    isHidden ? '-translate-y-96' : 'translate-y-0'
  }   ${navTextColor} ${scrolled || !isHeroPage || isNavActive ? 'bg-white'  : 'bg-transparent'}    ${
    
    isNavActive ? 'expanded' : ''
  }`;

  return (
    <>
 {isHeroPage && !scrolled && <Header />}
      

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden sticky top-0 z-50 ${
          scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur'
        } `}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2 rounded-md border border-black/10"
          >
            {mobileOpen ? <RxCross2 size={20} /> : <RxHamburgerMenu size={20} />}
          </button>

          <img
            className="h-10 w-auto object-contain cursor-pointer"
            src={darkLogo}
            alt="Garava"
            onClick={() => navigate('/')}
          />

          <div className="flex items-center gap-3">
            <CiSearch 
              size={22} 
              className="cursor-pointer hover:opacity-70 transition-opacity" 
              onClick={() => navigate('/search')}
            />
            <CiHeart size={22} className="cursor-pointer" onClick={() => navigate('/wishlist')} />
            <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
              <PiBagLight size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              key="mobile-panel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="border-t "
            >
              <div className="flex items-center  justify-between px-4 py-2 text-[1.0625rem]">
                <Link to="/contact" onClick={() => setMobileOpen(false)} className="font-medium">
                  Contact us
                </Link>
               
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/appointment');
                  }}
                  className="font-medium"
                >
                Book an Appointment
                </button>
              
              </div>

              <ul className="divide-y divide-gray-300 mt-5 ">
                {navItems.map((item, idx) => (
                  <li key={idx} className="px-5 py-4">
                    <MobileNavItem
                      item={item}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  </li>
                ))}
              </ul>

              <div className="px-4 py-3 border-t w-full">
                {isAuthenticated ? (
                  <div className="flex items-center ">
                    
                    <div className="flex items-start gap-9 text-start self-start py-6 justify-between w-full ">
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/profile'); }}
                        className="text-[1.0625rem] underline underline-offset-4"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/orders'); }}
                        className="text-[1.0625rem] underline  underline-offset-4"
                      >
                        Orders
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}
                          className="text-[1.0625rem] underline underline-offset-4 text-blue-600"
                        >
                          Admin
                        </button>
                      )}
                      <button
                        onClick={() => { setMobileOpen(false); dispatch(doLogout()); navigate('/'); }}
                        className="flex items-center  text-[1.0625rem] text-red-600"
                      >
                        <FiLogOut className="mr-1" /> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => { setMobileOpen(false); navigate('/login'); }}
                    className="w-full bg-black text-white py-2 rounded-md font-medium"
                  >
                    Login
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Desktop Navigation */}
      <nav className={navbarClass} role="navigation" aria-label="Main navigation">
       {
        shouldShowNavItemsDesktop && (
           <div className="navTop relative px-10">
          <div className="flex justify-between w-89   max-xl:w-89 max-lg:w-89 font-light">
   

<div className='flex items-center justify-center'>
  <PiPhoneIncomingThin size={23} className="" />
  <Link to="/contact" className="tracking-wide text-[1.0625rem] "> 
    Contact us
  </Link>
</div>
<div className='flex items-center '>
  <CiCalendarDate className='' size={20} />
  <h4
    className=" tracking-wide text-[1.0625rem]  cursor-pointer"
    onClick={() => navigate('/appointment')}
  >
    Book an Appointment
  </h4>
</div>


          </div>

          <img
            className="h-18 w-60 mt-2 mix-blend-difference object-contain cursor-pointer"
            src={lightLogo}
            alt="Garava Logo"
            onClick={() => navigate('/')}
          />

          <div className="flex items-center justify-end w-72 space-x-4">
            {isAuthenticated ? (
              <>
                <CiSearch 
                  size={25} 
                  aria-hidden="true" 
                  className="cursor-pointer hover:opacity-70 transition-opacity" 
                  onClick={() => navigate('/search')}
                />
                <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/cart')}>
                  <PiBagLight size={22} aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[1.0625rem] rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </div>
                <CiHeart size={24} aria-hidden="true" className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/wishlist')} />

                <div className="relative user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    onKeyDown={(e) => e.key === "Escape" && setShowUserMenu(false)}
                    className="flex items-center space-x-1 cursor-pointer hover:opacity-70 transition-opacity"
                    aria-label="User menu"
                    aria-expanded={showUserMenu}
                    aria-haspopup="menu"
                  >
                    <CiUser size={22} aria-hidden="true" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        key="user-menu"
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute right-0 mt-2 z-50 w-56 sm:w-56 max-w-[80vw]"
                        role="menu"
                        aria-orientation="vertical"
                      >
                        <div className="relative">
                          <div className="absolute right-6 -top-2 h-3 w-3 rotate-45 rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_6px_16px_-2px_rgba(0,0,0,0.15)]" />
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-[2px]">
                          <div className="py-1">
                            <div className="px-4 py-2 text-[1.0625rem] text-gray-700 border-b bg-gradient-to-b from-white to-gray-50">
                              <div className="font-medium">{user?.name}</div>
                              <div className="text-[1.0625rem] text-gray-500">{user?.email}</div>
                              {isAdmin && <div className="text-[1.0625rem] text-black font-medium">Admin</div>}
                            </div>

                            <button
                              onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                              className="block w-full text-left  cursor-pointer px-4 py-2 text-[1.0625rem] text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => { setShowUserMenu(false); navigate('/orders'); }}
                              className="block w-full text-left cursor-pointer px-4 py-2 text-[1.0625rem] text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              Orders
                            </button>

                            {isAdmin && (
                              <button
                                onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
                                className="block w-full cursor-pointer text-left px-4 py-2 text-[1.0625rem] text-black hover:bg-blue-50 font-medium"
                                role="menuitem"
                              >
                                Admin Dashboard
                              </button>
                            )}

                            <div className="border-t">
                              <button
                                onClick={() => { setShowUserMenu(false); dispatch(doLogout()); navigate('/'); }}
                                className="flex items-center cursor-pointer w-full text-left px-4 py-2 text-[1.0625rem] text-red-600 hover:bg-red-50"
                                role="menuitem"
                              >
                                <FiLogOut className="mr-2" size={16} />
                                Logout
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <CiSearch 
                  size={25} 
                  aria-hidden="true" 
                  className="cursor-pointer hover:opacity-70 transition-opacity" 
                  onClick={() => navigate('/search')}
                />
                                <CiHeart size={24} aria-hidden="true" className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/wishlist')} />
 <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
              <PiBagLight size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </div>
                <button
                  onClick={() => navigate('/login')}
                  className="tracking-wide  text-[1.0625rem]  cursor-pointer  "
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
        )
       }

        {/* {shouldShowNavItemsDesktop && ( */}
          <div className="flex-center">
            <div 
              className='flex items-center justify-center gap-8'
              onMouseLeave={() => setHovered(null)}
            >
            {navItems.map((item, idx) => (
              <NavItem
                key={idx}
                item={item}
                hovered={hovered}
                setHovered={setHovered}
              />
            ))}
          </div>
          </div>
        {/* )} */}
      </nav>
    </>
  );
};

export default Navbar;