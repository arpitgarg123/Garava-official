// // import { useEffect, useState } from 'react';
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { useSelector, useDispatch } from 'react-redux';
// // import { AnimatePresence, motion } from 'framer-motion';

// // import NavItem from './Navitems.jsx';
// // import Header from '../header/Header.jsx';

// // import { CiSearch, CiUser, CiHeart } from "react-icons/ci";
// // import { IoBagHandleOutline } from "react-icons/io5";
// // import { PiBagLight } from "react-icons/pi";
// // import { FiLogOut } from "react-icons/fi";
// // import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

// // import lightLogo from '../../assets/images/light-logo.png';
// // import darkLogo from '../../assets/images/logo-main.png';

// // import { selectIsAuthenticated, selectUser, selectIsAdmin } from '../../features/auth/selectors.js';
// // import { doLogout } from '../../features/auth/slice.js';
// // import { selectCartItemCount } from '../../features/cart/selectors.js';

// // const navItems = [
// //   { title: 'jewellery', submenu: [
// //      { label: 'Splitaire Studs',   img: './src/assets/images/jewellry1.jpg', to: '/jewellery/solitaire-studs' },
// //      { label: 'Daily Earrings ',    img: './src/assets/images/jewellry2.jpg', to: '/jewellery/daily-earrings' },
// //      { label: 'Pendants',           img: './src/assets/images/jewellry3.jpg', to: '/jewellery/pendants' },
// //      { label: 'Splitaire Rings',    img: './src/assets/images/jewellry4.png', to: '/jewellery/solitaire-rings' },
// //   ]},
// //   { title: 'HIGH JEWELLERY ', submenu: [
// //      { label: 'Daily Earrings',     img: './src/assets/images/fragnance1.png', to: '/high-jewellery/daily-earrings' },
// //      { label: 'Splitaire Rings',    img: './src/assets/images/jewellry4.png',  to: '/high-jewellery/solitaire-rings' },
// //      { label: 'Splitaire Studs',    img: './src/assets/images/fragnance.png',  to: '/high-jewellery/solitaire-studs' },
// //   ]},
// //   { title: 'Fragrance', submenu: [
// //      { label: 'Sila',               img: './src/assets/images/fragnance1.png', to: '/fragrance/sila' },
// //      { label: 'Sayonee',            img: './src/assets/images/fragnance.png',  to: '/fragrance/sayonee' },
// //      { label: 'Mangata',            img: './src/assets/images/f.png',          to: '/fragrance/mangata' },
// //   ]},
// //   { title: 'Services', submenu: [
// //      { label: 'book an appointment', img: '/images/for-her.jpg',               to: '/appointment' },
// //      { label: 'FAQ',                  img: '/images/for-him.jpg',              to: '/faq' },
// //   ]},
// //   { title: 'About Us', submenu: [
// //      { label: 'Our Story',           img: '/images/for-her.jpg',               to: '/about' },
// //   ]},
// //   { title: 'Blogs', submenu: [
// //      { label: 'jewellery',           img: '/images/for-her.jpg',               to: '/blogs/category/jewellery' },
// //      { label: 'Fragnance',           img: '/images/for-him.jpg',               to: '/blogs/category/fragrance' },
// //      { label: 'GARAVA',              img: '/images/unisex.jpg',                to: '/blogs/category/garava' },
// //   ]},
// //   { title: 'News & Events', submenu: [
// //      { label: 'Media Covarage',      img: '/images/for-her.jpg',               to: '/media' },
// //      { label: 'Events',              img: '/images/for-him.jpg',               to: '/events' },
// //   ]},
// // ];

// // const Navbar = () => {
// //   const location = useLocation();
// //   const dispatch = useDispatch();
// //   const navigate = useNavigate();

// //   // Auth state
// //   const isAuthenticated = useSelector(selectIsAuthenticated);
// //   const user = useSelector(selectUser);
// //   const isAdmin = useSelector(selectIsAdmin);
// //   const cartItemCount = useSelector(selectCartItemCount);

// //   // UI state
// //   const isHeroPage = location.pathname === '/';
// //   const [hovered, setHovered] = useState(null);
// //   const [showUserMenu, setShowUserMenu] = useState(false);
// //   const isNavActive = Boolean(hovered);
// //   const [lastScrollY, setLastScrollY] = useState(0);
// //   const [isHidden, setIsHidden] = useState(false);
// //   const [scrolled, setScrolled] = useState(false);

// //   // Mobile menu state
// //   const [mobileOpen, setMobileOpen] = useState(false);

// //   // Hide on scroll (desktop)
// //   useEffect(() => {
// //     const handleScroll = () => {
// //       const currentScrollY = window.scrollY;
// //       setScrolled(currentScrollY > 10);
// //       if (currentScrollY > lastScrollY && currentScrollY > 10) {
// //         setIsHidden(true);
// //       } else {
// //         setIsHidden(false);
// //       }
// //       setLastScrollY(currentScrollY);
// //     };
// //     window.addEventListener('scroll', handleScroll);
// //     return () => window.removeEventListener('scroll', handleScroll);
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [lastScrollY]);

// //   // Close user menu on outside click
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (showUserMenu && !event.target.closest('.user-menu-container')) {
// //         setShowUserMenu(false);
// //       }
// //     };
// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => document.removeEventListener('mousedown', handleClickOutside);
// //   }, [showUserMenu]);

// //   // Lock body scroll when mobile menu is open
// //   useEffect(() => {
// //     document.body.style.overflow = mobileOpen ? 'hidden' : '';
// //   }, [mobileOpen]);

// //   const navTextColor = isHeroPage && !scrolled && !isNavActive ? 'text-white' : 'text-black';
// //   const shouldShowNavItemsDesktop = isHeroPage && !scrolled;
  

// //   const navbarClass = `navbar hidden md:block mt-6 transition-transform duration-300 ease-out ${
// //     isHidden ? '-translate-y-48' : 'translate-y-0'
// //   } ${navTextColor} ${scrolled || !isHeroPage || isNavActive ? 'bg-white' : 'bg-transparent'} ${
// //     isNavActive ? 'expanded' : ''
// //   } `;

// //   return (
// //     <>
// //       <Header />

// //       <nav
// //         className={`md:hidden sticky top-0 z-50 ${
// //           scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur'
// //         } transition`}
// //         role="navigation"
// //         aria-label="Mobile navigation"
// //       >
// //         <div className="flex items-center justify-between px-4 py-3">
// //           {/* Hamburger */}
// //           <button
// //             aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
// //             onClick={() => setMobileOpen((v) => !v)}
// //             className="p-2 rounded-md border border-black/10"
// //           >
// //             {mobileOpen ? <RxCross2 size={20} /> : <RxHamburgerMenu size={20} />}
// //           </button>

// //           {/* Logo (center) */}
// //           <img
// //             className="h-10 w-auto object-contain cursor-pointer"
// //             src={darkLogo}
// //             alt="Garava"
// //             onClick={() => navigate('/')}
// //           />

// //           {/* Right icons */}
// //           <div className="flex items-center gap-3">
// //             <CiSearch 
// //               size={22} 
// //               className="cursor-pointer hover:opacity-70 transition-opacity" 
// //               onClick={() => navigate('/search')}
// //             />
// //             <CiHeart size={22} className="cursor-pointer" onClick={() => navigate('/wishlist')} />
// //             <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
// //               <PiBagLight size={22} />
// //               {cartItemCount > 0 && (
// //                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
// //                   {cartItemCount > 99 ? '99+' : cartItemCount}
// //                 </span>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Mobile slide-down panel (animated) */}
// //         <AnimatePresence>
// //           {mobileOpen && (
// //             <motion.div
// //               key="mobile-panel"
// //               initial={{ opacity: 0, y: -8 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               exit={{ opacity: 0, y: -8 }}
// //               transition={{ duration: 0.22, ease: 'easeOut' }}
// //               className="border-t bg-white"
// //             >
// //               {/* Top links row like desktop navTop */}
// //               <div className="flex items-center justify-between px-4 py-2 text-sm">
// //                 <Link to="/contact" onClick={() => setMobileOpen(false)} className="font-medium">
// //                   Contact us
// //                 </Link>
// //                 <button
// //                   onClick={() => {
// //                     setMobileOpen(false);
// //                     navigate('/appointment');
// //                   }}
// //                   className="font-medium"
// //                 >
// //                   book an appointment
// //                 </button>
// //               </div>

// //               {/* Nav items list */}
// //               <ul className="divide-y divide-gray-300 mt-5">
// //                 {navItems.map((item, idx) => (
// //                   <li key={idx} className="px-5 py-4">
// //                     <NavItem
// //                       item={item}
// //                       hovered={null}         // mobile: hover नहीं
// //                       setHovered={() => {}}
// //                       isMobile               // IMPORTANT: mobile mode
// //                       onNavigate={() => setMobileOpen(false)}
// //                     />
// //                   </li>
// //                 ))}
// //               </ul>

// //               {/* Auth area */}
// //               <div className="px-4 py-3 border-t">
// //                 {isAuthenticated ? (
// //                   <div className="flex items-center justify-between">
// //                     <div className="text-sm">
// //                       <div className="font-medium">{user?.name}</div>
// //                       <div className="text-xs text-gray-500">{user?.email}</div>
// //                       {isAdmin && <div className="text-xs text-black font-medium">Admin</div>}
// //                     </div>
// //                     <div className="flex items-center gap-3">
// //                       <button
// //                         onClick={() => { setMobileOpen(false); navigate('/profile'); }}
// //                         className="text-sm underline underline-offset-4"
// //                       >
// //                         Profile
// //                       </button>
// //                       <button
// //                         onClick={() => { setMobileOpen(false); navigate('/orders'); }}
// //                         className="text-sm underline underline-offset-4"
// //                       >
// //                         Orders
// //                       </button>
// //                       {isAdmin && (
// //                         <button
// //                           onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}
// //                           className="text-sm underline underline-offset-4 text-blue-600"
// //                         >
// //                           Admin
// //                         </button>
// //                       )}
// //                       <button
// //                         onClick={() => { setMobileOpen(false); dispatch(doLogout()); navigate('/'); }}
// //                         className="flex items-center text-sm text-red-600"
// //                       >
// //                         <FiLogOut className="mr-1" /> Logout
// //                       </button>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <button
// //                     onClick={() => { setMobileOpen(false); navigate('/login'); }}
// //                     className="w-full bg-black text-white py-2 rounded-md font-medium"
// //                   >
// //                     Login
// //                   </button>
// //                 )}
// //               </div>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>
// //       </nav>

// //       {/* DESKTOP NAVBAR (md and up) */}
// //       <nav
// //         className={navbarClass}
// //         role="navigation"
// //         aria-label="Main navigation"
// //       >
// //         <div className="navTop relative px-10">
// //           <div className="flex justify-between w-60 font-light">
// //             <Link to="/contact" className="font-medium text-sm">Contact us</Link>
// //             <h4
// //               className="font-medium text-sm cursor-pointer"
// //               onClick={() => navigate('/appointment')}
// //             >
// //               book an appointment
// //             </h4>
// //           </div>

// //           {/* <img
// //             className="h-18 w-60 mt-2 object-contain cursor-pointer"
// //             src={darkLogo}
// //             alt="Dark logo"
// //             onClick={() => navigate('/')}
// //           /> */}
// //            <img
// //             className="h-18 w-60 mt-2 mix-blend-difference object-contain cursor-pointer"
// //             src={lightLogo}
// //             alt="Dark logo"
// //             onClick={() => navigate('/')}
// //           />

// //           <div className="flex items-center justify-end w-72 space-x-4">
// //             {isAuthenticated ? (
// //               <>
// //                 <CiSearch 
// //                   size={25} 
// //                   aria-hidden="true" 
// //                   className="cursor-pointer hover:opacity-70 transition-opacity" 
// //                   onClick={() => navigate('/search')}
// //                 />
// //                 <CiHeart size={24} aria-hidden="true" className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/wishlist')} />
// //                 <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/cart')}>
// //                   <IoBagHandleOutline size={22} aria-hidden="true" />
// //                   {cartItemCount > 0 && (
// //                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
// //                       {cartItemCount > 99 ? '99+' : cartItemCount}
// //                     </span>
// //                   )}
// //                 </div>

// //                 {/* User menu */}
// //                <div className="relative user-menu-container">
// //   <button
// //     onClick={() => setShowUserMenu(!showUserMenu)}
// //     onKeyDown={(e) => e.key === "Escape" && setShowUserMenu(false)}
// //     className="flex items-center space-x-1 cursor-pointer hover:opacity-70 transition-opacity"
// //     aria-label="User menu"
// //     aria-expanded={showUserMenu}
// //     aria-haspopup="menu"
// //   >
// //     <CiUser size={22} aria-hidden="true" />
// //     <span className="text-sm font-medium">{user?.role || 'User'}</span>
// //   </button>

// //   {/* Caret + Menu (animated) */}
// //   <AnimatePresence>
// //     {showUserMenu && (
// //       <motion.div
// //         key="user-menu"
// //         initial={{ opacity: 0, y: -6, scale: 0.98 }}
// //         animate={{ opacity: 1, y: 0, scale: 1 }}
// //         exit={{ opacity: 0, y: -6, scale: 0.98 }}
// //         transition={{ duration: 0.18, ease: "easeOut" }}
// //         className="absolute right-0 mt-2 z-50 w-56 sm:w-56 max-w-[80vw]"
// //         role="menu"
// //         aria-orientation="vertical"
// //       >
// //         {/* caret */}
// //         <div className="relative">
// //           <div className="absolute right-6 -top-2 h-3 w-3 rotate-45 rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_6px_16px_-2px_rgba(0,0,0,0.15)]" />
// //         </div>

// //         {/* panel */}
// //         <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-[2px]">
// //           <div className="py-1">
// //             <div className="px-4 py-2 text-sm text-gray-700 border-b bg-gradient-to-b from-white to-gray-50">
// //               <div className="font-medium">{user?.name}</div>
// //               <div className="text-xs text-gray-500">{user?.email}</div>
// //               {isAdmin && <div className="text-xs text-black font-medium">Admin</div>}
// //             </div>

// //             <button
// //               onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
// //               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
// //               role="menuitem"
// //             >
// //               Profile
// //             </button>
// //             <button
// //               onClick={() => { setShowUserMenu(false); navigate('/orders'); }}
// //               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
// //               role="menuitem"
// //             >
// //               Orders
// //             </button>

// //             {isAdmin && (
// //               <button
// //                 onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
// //                 className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-blue-50 font-medium"
// //                 role="menuitem"
// //               >
// //                 Admin Dashboard
// //               </button>
// //             )}

// //             <div className="border-t">
// //               <button
// //                 onClick={() => { setShowUserMenu(false); dispatch(doLogout()); navigate('/'); }}
// //                 className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
// //                 role="menuitem"
// //               >
// //                 <FiLogOut className="mr-2" size={16} />
// //                 Logout
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </motion.div>
// //     )}
// //   </AnimatePresence>
// // </div>

// //               </>
// //             ) : (
// //               <div className="flex items-center space-x-4">
// //                 <CiSearch 
// //                   size={25} 
// //                   aria-hidden="true" 
// //                   className="cursor-pointer hover:opacity-70 transition-opacity" 
// //                   onClick={() => navigate('/search')}
// //                 />
// //                 <button
// //                   onClick={() => navigate('/login')}
// //                   className="bg-black text-white px-6 py-2 cursor-pointer font-medium hover:bg-gray-800 transition-colors"
// //                 >
// //                   Login
// //                 </button>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         {shouldShowNavItemsDesktop && (
// //           <div className="flex-center">
// //             {navItems.map((item, idx) => (
// //               <NavItem
// //                 key={idx}
// //                 item={item}
// //                 hovered={hovered}
// //                 setHovered={setHovered}
// //               />
// //             ))}
// //           </div>
// //         )}
// //       </nav>
// //     </>
// //   );
// // };

// // export default Navbar;


// import { useEffect, useState } from 'react';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { AnimatePresence, motion } from 'framer-motion';

// import NavItem from './Navitems.jsx';
// import Header from '../header/Header.jsx';

// import { CiSearch, CiUser, CiHeart } from "react-icons/ci";

// import { PiBagLight } from "react-icons/pi";
// import { FiLogOut } from "react-icons/fi";
// import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

// import lightLogo from '../../assets/images/light-logo.png';
// import darkLogo from '../../assets/images/logo-main.png';

// import { selectIsAuthenticated, selectUser, selectIsAdmin } from '../../features/auth/selectors.js';
// import { doLogout } from '../../features/auth/slice.js';
// import { selectCartItemCount } from '../../features/cart/selectors.js';

// const navItems = [
//   { title: 'jewellery', submenu: [
//      { label: 'Splitaire Studs',   img: './src/assets/images/jewellry1.jpg', to: '/jewellery/solitaire-studs' },
//      { label: 'Daily Earrings ',    img: './src/assets/images/jewellry2.jpg', to: '/jewellery/daily-earrings' },
//      { label: 'Pendants',           img: './src/assets/images/jewellry3.jpg', to: '/jewellery/pendants' },
//      { label: 'Splitaire Rings',    img: './src/assets/images/jewellry4.png', to: '/jewellery/solitaire-rings' },
//   ]},
//   { title: 'HIGH JEWELLERY ', submenu: [
//      { label: 'Daily Earrings',     img: './src/assets/images/fragnance1.png', to: '/high-jewellery/daily-earrings' },
//      { label: 'Splitaire Rings',    img: './src/assets/images/jewellry4.png',  to: '/high-jewellery/solitaire-rings' },
//      { label: 'Splitaire Studs',    img: './src/assets/images/fragnance.png',  to: '/high-jewellery/solitaire-studs' },
//   ]},
//   { title: 'Fragrance', submenu: [
//      { label: 'Sila',               img: './src/assets/images/fragnance1.png', to: '/fragrance/sila' },
//      { label: 'Sayonee',            img: './src/assets/images/fragnance.png',  to: '/fragrance/sayonee' },
//      { label: 'Mangata',            img: './src/assets/images/f.png',          to: '/fragrance/mangata' },
//   ]},
//   { title: 'Services', submenu: [
//      { label: 'book an appointment', img: '/images/for-her.jpg',               to: '/appointment' },
//      { label: 'FAQ',                  img: '/images/for-him.jpg',              to: '/faq' },
//   ]},
//   { title: 'About Us', submenu: [
//      { label: 'Our Story',           img: '/images/for-her.jpg',               to: '/about' },
//   ]},
//   { title: 'Blogs', submenu: [
//      { label: 'jewellery',           img: '/images/for-her.jpg',               to: '/blogs/category/jewellery' },
//      { label: 'Fragnance',           img: '/images/for-him.jpg',               to: '/blogs/category/fragrance' },
//      { label: 'GARAVA',              img: '/images/unisex.jpg',                to: '/blogs/category/garava' },
//   ]},
//   { title: 'News & Events', submenu: [
//      { label: 'Media Covarage',      img: '/images/for-her.jpg',               to: '/media' },
//      { label: 'Events',              img: '/images/for-him.jpg',               to: '/events' },
//   ]},
// ];

// // Mobile NavItem Component for direct navigation
// const MobileNavItem = ({ item, onNavigate }) => {
//   const navigate = useNavigate();
//   const [expanded, setExpanded] = useState(false);

//   const handleMainClick = () => {
//     if (item.submenu && item.submenu.length > 0) {
//       setExpanded(!expanded);
//     } else {
//       onNavigate();
//       navigate('/products'); // fallback navigation
//     }
//   };

//   const handleSubItemClick = (subItem) => {
//     onNavigate();
//     navigate(subItem.to);
//   };

//   return (
//     <div>
//       <button
//         onClick={handleMainClick}
//         className="flex items-center justify-between w-full text-left font-medium text-lg hover:text-gray-600 transition-colors"
//       >
//         {item.title}
//         {item.submenu && item.submenu.length > 0 && (
//           <span className={`transform transition-transform ${expanded ? 'rotate-180' : ''}`}>
//             ↓
//           </span>
//         )}
//       </button>
      
//       {expanded && item.submenu && (
//         <div className="mt-2 ml-4 space-y-2">
//           {item.submenu.map((subItem, idx) => (
//             <button
//               key={idx}
//               onClick={() => handleSubItemClick(subItem)}
//               className="block w-full text-left text-sm text-gray-600 hover:text-black transition-colors py-1"
//             >
//               {subItem.label}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// const Navbar = () => {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   // Auth state
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const user = useSelector(selectUser);
//   const isAdmin = useSelector(selectIsAdmin);
//   const cartItemCount = useSelector(selectCartItemCount);

//   // UI state
//   const isHeroPage = location.pathname === '/';
//   const [hovered, setHovered] = useState(null);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const isNavActive = Boolean(hovered);
//   const [lastScrollY, setLastScrollY] = useState(0);
//   const [isHidden, setIsHidden] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // Mobile menu state
//   const [mobileOpen, setMobileOpen] = useState(false);

//   // Hide on scroll (desktop)
//   useEffect(() => {
//     const handleScroll = () => {
//       const currentScrollY = window.scrollY;
//       setScrolled(currentScrollY > 10);
//       if (currentScrollY > lastScrollY && currentScrollY > 10) {
//         setIsHidden(true);
//       } else {
//         setIsHidden(false);
//       }
//       setLastScrollY(currentScrollY);
//     };
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [lastScrollY]);

//   // Close user menu on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (showUserMenu && !event.target.closest('.user-menu-container')) {
//         setShowUserMenu(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showUserMenu]);

//   // Lock body scroll when mobile menu is open
//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? 'hidden' : '';
//   }, [mobileOpen]);

//   const navTextColor = isHeroPage && !scrolled && !isNavActive ? 'text-white' : 'text-black';
//   const shouldShowNavItemsDesktop = isHeroPage && !scrolled;
  
//   const navbarClass = `navbar hidden md:block mt-6 transition-transform duration-300 ease-out ${
//     isHidden ? '-translate-y-48' : 'translate-y-0'
//   } ${navTextColor} ${scrolled || !isHeroPage || isNavActive ? 'bg-white' : 'bg-transparent'} ${
//     isNavActive ? 'expanded' : ''
//   } `;

//   return (
//     <>
//       <Header />

//       <nav
//         className={`md:hidden sticky top-0 z-50 ${
//           scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur'
//         } transition`}
//         role="navigation"
//         aria-label="Mobile navigation"
//       >
//         <div className="flex items-center justify-between px-4 py-3">
//           {/* Hamburger */}
//           <button
//             aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
//             onClick={() => setMobileOpen((v) => !v)}
//             className="p-2 rounded-md border border-black/10"
//           >
//             {mobileOpen ? <RxCross2 size={20} /> : <RxHamburgerMenu size={20} />}
//           </button>

//           {/* Logo (center) */}
//           <img
//             className="h-10 w-auto object-contain cursor-pointer"
//             src={darkLogo}
//             alt="Garava"
//             onClick={() => navigate('/')}
//           />

//           {/* Right icons */}
//           <div className="flex items-center gap-3">
//             <CiSearch 
//               size={22} 
//               className="cursor-pointer hover:opacity-70 transition-opacity" 
//               onClick={() => navigate('/search')}
//             />
//             <CiHeart size={22} className="cursor-pointer" onClick={() => navigate('/wishlist')} />
//             <div className="relative cursor-pointer" onClick={() => navigate('/cart')}>
//               <PiBagLight size={2}  />
//               {cartItemCount > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
//                   {cartItemCount > 99 ? '99+' : cartItemCount}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Mobile slide-down panel (animated) */}
//         <AnimatePresence>
//           {mobileOpen && (
//             <motion.div
//               key="mobile-panel"
//               initial={{ opacity: 0, y: -8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -8 }}
//               transition={{ duration: 0.22, ease: 'easeOut' }}
//               className="border-t bg-white"
//             >
//               {/* Top links row like desktop navTop */}
//               <div className="flex items-center justify-between px-4 py-2 text-sm">
//                 <Link to="/contact" onClick={() => setMobileOpen(false)} className="font-medium">
//                   Contact us
//                 </Link>
//                 <button
//                   onClick={() => {
//                     setMobileOpen(false);
//                     navigate('/appointment');
//                   }}
//                   className="font-medium"
//                 >
//                   book an appointment
//                 </button>
//               </div>

//               {/* Nav items list - FIXED VERSION */}
//               <ul className="divide-y divide-gray-300 mt-5">
//                 {navItems.map((item, idx) => (
//                   <li key={idx} className="px-5 py-4">
//                     <MobileNavItem
//                       item={item}
//                       onNavigate={() => setMobileOpen(false)}
//                     />
//                   </li>
//                 ))}
//               </ul>

//               {/* Auth area */}
//               <div className="px-4 py-3 border-t">
//                 {isAuthenticated ? (
//                   <div className="flex items-center justify-between">
//                     <div className="text-sm">
//                       <div className="font-medium">{user?.name}</div>
//                       <div className="text-xs text-gray-500">{user?.email}</div>
//                       {isAdmin && <div className="text-xs text-black font-medium">Admin</div>}
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => { setMobileOpen(false); navigate('/profile'); }}
//                         className="text-sm underline underline-offset-4"
//                       >
//                         Profile
//                       </button>
//                       <button
//                         onClick={() => { setMobileOpen(false); navigate('/orders'); }}
//                         className="text-sm underline underline-offset-4"
//                       >
//                         Orders
//                       </button>
//                       {isAdmin && (
//                         <button
//                           onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}
//                           className="text-sm underline underline-offset-4 text-blue-600"
//                         >
//                           Admin
//                         </button>
//                       )}
//                       <button
//                         onClick={() => { setMobileOpen(false); dispatch(doLogout()); navigate('/'); }}
//                         className="flex items-center text-sm text-red-600"
//                       >
//                         <FiLogOut className="mr-1" /> Logout
//                       </button>
//                     </div>
//                   </div>
//                 ) : (
//                   <button
//                     onClick={() => { setMobileOpen(false); navigate('/login'); }}
//                     className="w-full bg-black text-white py-2 rounded-md font-medium"
//                   >
//                     Login
//                   </button>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </nav>

//       {/* DESKTOP NAVBAR (md and up) */}
//       <nav
//         className={navbarClass}
//         role="navigation"
//         aria-label="Main navigation"
//       >
//         <div className="navTop relative px-10">
//           <div className="flex justify-between w-60 font-light">
//             <Link to="/contact" className="font-medium text-sm">Contact us</Link>
//             <h4
//               className="font-medium text-sm cursor-pointer"
//               onClick={() => navigate('/appointment')}
//             >
//               book an appointment
//             </h4>
//           </div>

//           <img
//             className="h-18 w-60 mt-2 mix-blend-difference object-contain cursor-pointer"
//             src={lightLogo}
//             alt="Garava Logo"
//             onClick={() => navigate('/')}
//           />

//           <div className="flex items-center justify-end w-72 space-x-4">
//             {isAuthenticated ? (
//               <>
//                 <CiSearch 
//                   size={25} 
//                   aria-hidden="true" 
//                   className="cursor-pointer hover:opacity-70 transition-opacity" 
//                   onClick={() => navigate('/search')}
//                 />
//                 <CiHeart size={24} aria-hidden="true" className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/wishlist')} />
//                 <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/cart')}>
//                   <PiBagLight size={22} aria-hidden="true" />
//                   {cartItemCount > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
//                       {cartItemCount > 99 ? '99+' : cartItemCount}
//                     </span>
//                   )}
//                 </div>

//                 {/* User menu */}
//                <div className="relative user-menu-container">
//   <button
//     onClick={() => setShowUserMenu(!showUserMenu)}
//     onKeyDown={(e) => e.key === "Escape" && setShowUserMenu(false)}
//     className="flex items-center space-x-1 cursor-pointer hover:opacity-70 transition-opacity"
//     aria-label="User menu"
//     aria-expanded={showUserMenu}
//     aria-haspopup="menu"
//   >
//     <CiUser size={22} aria-hidden="true" />
//     <span className="text-sm font-medium">{user?.role || 'User'}</span>
//   </button>

//   {/* Caret + Menu (animated) */}
//   <AnimatePresence>
//     {showUserMenu && (
//       <motion.div
//         key="user-menu"
//         initial={{ opacity: 0, y: -6, scale: 0.98 }}
//         animate={{ opacity: 1, y: 0, scale: 1 }}
//         exit={{ opacity: 0, y: -6, scale: 0.98 }}
//         transition={{ duration: 0.18, ease: "easeOut" }}
//         className="absolute right-0 mt-2 z-50 w-56 sm:w-56 max-w-[80vw]"
//         role="menu"
//         aria-orientation="vertical"
//       >
//         {/* caret */}
//         <div className="relative">
//           <div className="absolute right-6 -top-2 h-3 w-3 rotate-45 rounded-sm bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_6px_16px_-2px_rgba(0,0,0,0.15)]" />
//         </div>

//         {/* panel */}
//         <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xl ring-1 ring-black/5 backdrop-blur-[2px]">
//           <div className="py-1">
//             <div className="px-4 py-2 text-sm text-gray-700 border-b bg-gradient-to-b from-white to-gray-50">
//               <div className="font-medium">{user?.name}</div>
//               <div className="text-xs text-gray-500">{user?.email}</div>
//               {isAdmin && <div className="text-xs text-black font-medium">Admin</div>}
//             </div>

//             <button
//               onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//               role="menuitem"
//             >
//               Profile
//             </button>
//             <button
//               onClick={() => { setShowUserMenu(false); navigate('/orders'); }}
//               className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//               role="menuitem"
//             >
//               Orders
//             </button>

//             {isAdmin && (
//               <button
//                 onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
//                 className="block w-full text-left px-4 py-2 text-sm text-black hover:bg-blue-50 font-medium"
//                 role="menuitem"
//               >
//                 Admin Dashboard
//               </button>
//             )}

//             <div className="border-t">
//               <button
//                 onClick={() => { setShowUserMenu(false); dispatch(doLogout()); navigate('/'); }}
//                 className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                 role="menuitem"
//               >
//                 <FiLogOut className="mr-2" size={16} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     )}
//   </AnimatePresence>
// </div>

//               </>
//             ) : (
//               <div className="flex items-center space-x-4">
//                 <CiSearch 
//                   size={25} 
//                   aria-hidden="true" 
//                   className="cursor-pointer hover:opacity-70 transition-opacity" 
//                   onClick={() => navigate('/search')}
//                 />
//                 <button
//                   onClick={() => navigate('/login')}
//                   className="bg-black text-white px-6 py-2 cursor-pointer font-medium hover:bg-gray-800 transition-colors"
//                 >
//                   Login
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>

//         {shouldShowNavItemsDesktop && (
//           <div className="flex-center">
//             {navItems.map((item, idx) => (
//               <NavItem
//                 key={idx}
//                 item={item}
//                 hovered={hovered}
//                 setHovered={setHovered}
//               />
//             ))}
//           </div>
//         )}
//       </nav>
//     </>
//   );
// };

// export default Navbar;

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

import NavItem from './Navitems.jsx';
import Header from '../header/Header.jsx';

import { CiSearch, CiUser, CiHeart } from "react-icons/ci";
import { PiBagLight } from "react-icons/pi";
import { FiLogOut } from "react-icons/fi";
import { RxHamburgerMenu, RxCross2 } from "react-icons/rx";

import lightLogo from '../../assets/images/light-logo.png';
import darkLogo from '../../assets/images/logo-main.png';

import { selectIsAuthenticated, selectUser, selectIsAdmin } from '../../features/auth/selectors.js';
import { doLogout } from '../../features/auth/slice.js';
import { selectCartItemCount } from '../../features/cart/selectors.js';

const navItems = [
  { title: 'jewellery', submenu: [
    { 
        label: 'Solitaire Studs', 
        img: './src/assets/images/jewellry1.jpg', 
        to: '/products/jewellery?subcategory=solitaire-studs',
        subcategory: 'solitaire-studs'
      },
      { 
        label: 'Daily Earrings', 
        img: './src/assets/images/jewellry2.jpg', 
        to: '/products/jewellery?subcategory=daily-earrings',
        subcategory: 'daily-earrings'
      },
    { 
        label: 'Pendants', 
        img: './src/assets/images/jewellry3.jpg', 
        to: '/products/jewellery?subcategory=pendants',
        subcategory: 'pendants'
      },
      { 
        label: 'Solitaire Rings', 
        img: './src/assets/images/jewellry4.png', 
        to: '/products/jewellery?subcategory=solitaire-rings',
        subcategory: 'solitaire-rings'
      },
     ]},
  { title: 'HIGH JEWELLERY', submenu: [
   { 
        label: 'Daily Earrings', 
        img: './src/assets/images/fragnance1.png', 
        to: '/products/high-jewellery?subcategory=daily-earrings',
        subcategory: 'daily-earrings'
      },
      { 
        label: 'Solitaire Rings', 
        img: './src/assets/images/jewellry4.png', 
        to: '/products/high-jewellery?subcategory=solitaire-rings',
        subcategory: 'solitaire-rings'
      },
      { 
        label: 'Solitaire Studs', 
        img: './src/assets/images/fragnance.png', 
        to: '/products/high-jewellery?subcategory=solitaire-studs',
        subcategory: 'solitaire-studs'
      },
     
    ]},
  { title: 'Fragrance', submenu: [
     { 
        label: 'Sila', 
        img: './src/assets/images/fragnance1.png', 
        to: '/products/fragrance?subcategory=sila',
        subcategory: 'sila'
      },
      { 
        label: 'Sayonee', 
        img: './src/assets/images/fragnance.png', 
        to: '/products/fragrance?subcategory=sayonee',
        subcategory: 'sayonee'
      },
      { 
        label: 'Mangata', 
        img: './src/assets/images/f.png', 
        to: '/products/fragrance?subcategory=mangata',
        subcategory: 'mangata'
      },
  ]},
  { title: 'Services', submenu: [
     { label: 'book an appointment', img: '/images/for-her.jpg', to: '/appointment' },
     { label: 'FAQ', img: '/images/for-him.jpg', to: '/faq' },
  ]},
  { title: 'About Us', submenu: [
     { label: 'Our Story', img: '/images/for-her.jpg', to: '/about' },
  ]},
  { 
    title: 'Blogs', 
    submenu: [
      { 
        label: 'Jewellery', 
        img: '/images/blog-jewellery.jpg', 
        to: '/blogs?category=jewellery',
        category: 'jewellery'
      },
      { 
        label: 'Fragrance', 
        img: '/images/blog-fragrance.jpg', 
        to: '/blogs?category=fragrance',
        category: 'fragrance'
      },
      { 
        label: 'GARAVA', 
        img: '/images/blog-garava.jpg', 
        to: '/blogs?category=garava',
        category: 'garava'
      },
     
    ]
  },
  { title: 'News & Events', submenu: [
     { label: 'Media Coverage', img: '/images/for-her.jpg', to: '/media' },
     { label: 'Events', img: '/images/for-him.jpg', to: '/events' },
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
              className="block w-full text-left text-sm text-gray-600 hover:text-black transition-colors py-1"
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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY && currentScrollY > 10) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
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
  const shouldShowNavItemsDesktop = isHeroPage && !scrolled;
  
  const navbarClass = `navbar hidden md:block mt-6 transition-transform duration-300 ease-out ${
    isHidden ? '-translate-y-48' : 'translate-y-0'
  } ${navTextColor} ${scrolled || !isHeroPage || isNavActive ? 'bg-white' : 'bg-transparent'} ${
    isNavActive ? 'expanded' : ''
  }`;

  return (
    <>
      <Header />

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden sticky top-0 z-50 ${
          scrolled ? 'bg-white shadow-sm' : 'bg-white/80 backdrop-blur'
        } transition`}
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
              className="border-t bg-white"
            >
              <div className="flex items-center justify-between px-4 py-2 text-sm">
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
                  book an appointment
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

              <div className="px-4 py-3 border-t">
                {isAuthenticated ? (
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-gray-500">{user?.email}</div>
                      {isAdmin && <div className="text-xs text-black font-medium">Admin</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/profile'); }}
                        className="text-sm underline underline-offset-4"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => { setMobileOpen(false); navigate('/orders'); }}
                        className="text-sm underline underline-offset-4"
                      >
                        Orders
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { setMobileOpen(false); navigate('/dashboard'); }}
                          className="text-sm underline underline-offset-4 text-blue-600"
                        >
                          Admin
                        </button>
                      )}
                      <button
                        onClick={() => { setMobileOpen(false); dispatch(doLogout()); navigate('/'); }}
                        className="flex items-center text-sm text-red-600"
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
        <div className="navTop relative px-10">
          <div className="flex justify-between w-60 font-light">
            <Link to="/contact" className="font-medium text-sm">Contact us</Link>
            <h4
              className="font-medium text-sm cursor-pointer"
              onClick={() => navigate('/appointment')}
            >
              book an appointment
            </h4>
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
                <CiHeart size={24} aria-hidden="true" className="cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/wishlist')} />
                <div className="relative cursor-pointer hover:opacity-70 transition-opacity" onClick={() => navigate('/cart')}>
                  <PiBagLight size={22} aria-hidden="true" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount > 99 ? '99+' : cartItemCount}
                    </span>
                  )}
                </div>

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
                    <span className="text-sm font-medium">{user?.role || 'User'}</span>
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
                            <div className="px-4 py-2 text-sm text-gray-700 border-b bg-gradient-to-b from-white to-gray-50">
                              <div className="font-medium">{user?.name}</div>
                              <div className="text-xs text-gray-500">{user?.email}</div>
                              {isAdmin && <div className="text-xs text-black font-medium">Admin</div>}
                            </div>

                            <button
                              onClick={() => { setShowUserMenu(false); navigate('/profile'); }}
                              className="block w-full text-left  cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              Profile
                            </button>
                            <button
                              onClick={() => { setShowUserMenu(false); navigate('/orders'); }}
                              className="block w-full text-left cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                              role="menuitem"
                            >
                              Orders
                            </button>

                            {isAdmin && (
                              <button
                                onClick={() => { setShowUserMenu(false); navigate('/dashboard'); }}
                                className="block w-full cursor-pointer text-left px-4 py-2 text-sm text-black hover:bg-blue-50 font-medium"
                                role="menuitem"
                              >
                                Admin Dashboard
                              </button>
                            )}

                            <div className="border-t">
                              <button
                                onClick={() => { setShowUserMenu(false); dispatch(doLogout()); navigate('/'); }}
                                className="flex items-center cursor-pointer w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
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
                <button
                  onClick={() => navigate('/login')}
                  className=" text-white px-6 py-2 cursor-pointer font-medium  "
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>

        {shouldShowNavItemsDesktop && (
          <div className="flex-center ">
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
};

export default Navbar;