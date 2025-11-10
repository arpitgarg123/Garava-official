import { motion, AnimatePresence } from "framer-motion";
import Submenu from "./Submenu";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const NavItem = ({ item, hovered, setHovered, isMobile = false, onNavigate = () => {} }) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const [submenuTop, setSubmenuTop] = useState(130);
  const navigate = useNavigate();

  const isOpenMobile = isMobile && hovered === item.title;
  const handleEnter = () => !isMobile && setHovered(item.title);
  // Calculate dynamic submenu position
  useEffect(() => {
    const calculateSubmenuPosition = () => {
      const navbar = document.querySelector('.navbar');
      const header = document.querySelector('.header');
      if (navbar && header) {
        const navbarHeight = navbar.offsetHeight;
        const headerHeight = header.offsetHeight;
        setSubmenuTop(navbarHeight + headerHeight);
      } else {
        // Fallback calculation for ultra-wide screens
        const vwHeight = window.innerWidth * 0.06; // 6vw
        const headerVwHeight = window.innerWidth * 0.023; // 2.3vw
        const calculatedTop = vwHeight + headerVwHeight + 20;
        // Cap the maximum top position for ultra-wide screens
        const maxTop = window.innerWidth >= 2400 ? 180 : 200;
        setSubmenuTop(Math.min(calculatedTop, maxTop));
      }
    };
    calculateSubmenuPosition();
    window.addEventListener('resize', calculateSubmenuPosition);
    return () => window.removeEventListener('resize', calculateSubmenuPosition);
  }, []);
const handleToggleMobile = () => {
    if (!isMobile) return;
    setHovered(isOpenMobile ? null : item.title);
  };

  // ✅ New: Desktop click handler
  const handleDesktopClick = () => {
    if (!isMobile && item.to) {
      navigate(item.to);
      onNavigate(); // in case you use drawer close function etc.
    }
  };

  return (
    <div
      className={`relative nav-items ${isMobile ? 'py-0' : 'py-3'} group`}
      onMouseEnter={handleEnter}
    >
      {/* Trigger */}
      <button
        className="uppercase w-full cursor-pointer text-left z-50 font-medium text-[1.0625rem] tracking-wide flex items-center justify-between px-3"
        onClick={isMobile ? handleToggleMobile : handleDesktopClick}
        aria-expanded={isMobile ? !!isOpenMobile : hovered === item.title}
        aria-controls={isMobile ? `${item.title}-submenu` : undefined}
      >
        <span className="whitespace-nowrap">{item.title}</span>
      </button>

      {!isMobile && (
        <div className="absolute bottom-2 left-0 w-full h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      )}

      {/* Desktop submenu (hover) */}
      {!isMobile && (
        <AnimatePresence>
          {hovered === item.title && hasSubmenu && (
            <>
              {/* <div className="absolute left-0 h-8 w-full  -bottom-8 bg-red-500" /> */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="submenu-container w-full h-[19vw] fixed  bg-white  max-xl:h-[24vw] text-black left-0 -top-36 py-8 "
              >
                <div className="max-w-7xl mx-auto flex flex-col  items-center justify-center h-full  ">
                  <div className={`${["Maison", "Blogs", "News & Events",'jewellery', 'HIGH JEWELLERY' ].includes(item.title) ? "flex-center" : "flex items-center justify-center gap-12"}`}>
                    {item.submenu.map((sub, i) => (
                      <Submenu key={i} sub={sub} parentTitle={item.title} />
                    ))}
                  </div>
                  {['jewellery', 'Fragrance', 'HIGH JEWELLERY'].includes(item.title) && (
                    <Link
                      className="mt-2   underline tracking-wider text-[1.0625rem]"
                      to={
                        item.title === 'jewellery' ? '/products/jewellery'
                        : item.title === 'Fragrance' ? '/products/fragrance'
                        : item.title === 'HIGH JEWELLERY' ? '/products/high-jewellery'
                        : '/products'
                      }
                    >
                      View All Products
                    </Link>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      )}

      {/* Mobile submenu (collapse) */}
      {isMobile && hasSubmenu && (
        <motion.div
           id={`${item.title}-submenu`}
    initial={false}
    animate={isOpenMobile ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
    transition={{ duration: 0.24, ease: "easeOut" }}
    className="overflow-hidden"
        >
          <div className="py-3">
            <div className="flex flex-wrap gap-4 px-2">
              {item.submenu.map((sub, i) => (
                <Submenu
                  key={i}
                  sub={sub}
                  parentTitle={item.title}
                  isMobile
                  onClickItem={() => onNavigate()}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default NavItem;
