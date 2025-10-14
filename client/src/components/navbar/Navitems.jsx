import { motion, AnimatePresence } from "framer-motion";
import Submenu from "./Submenu";
import { useEffect, useState } from "react";


const NavItem = ({ item, hovered, setHovered, isMobile = false, onNavigate = () => {} }) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
const [submenuTop, setSubmenuTop] = useState(130);

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

  // Mobile local state for expand/collapse
  const isOpenMobile = isMobile && hovered === item.title;

  const handleEnter = () => !isMobile && setHovered(item.title);
  const handleLeave = () => !isMobile && setHovered(null);

  const handleToggleMobile = () => {
    if (!isMobile) return;
    setHovered(isOpenMobile ? null : item.title);
  };

  return (
    <div
      className={`relative nav-items  ${isMobile ? 'py-0' : 'py-3'} group`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Trigger */}
      <button
        className="uppercase w-full cursor-pointer text-left z-50 font-medium text-sm tracking-wide flex items-center justify-between"
        onClick={isMobile ? handleToggleMobile : undefined}
        aria-expanded={isMobile ? !!isOpenMobile : hovered === item.title}
        aria-controls={isMobile ? `${item.title}-submenu` : undefined}
      >
        <span className="whitespace-nowrap">{item.title}</span>
      
      </button>

      {!isMobile && (
        <div className="absolute bottom-2 left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
      )}

      {/* Desktop submenu (hover) */}
      {!isMobile && (
        <AnimatePresence>
          {hovered === item.title && hasSubmenu && (
            <>
              <div className="absolute left-0 h-8 w-full  -bottom-8 bg-transparent" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="submenu-container w-full h-[20vw] fixed  bg-white text-black left-0 -top-36 py-8 "
              >
                <div className="max-w-7xl mx-auto flex  items-center justify-center h-full ">
                  <div className={`${["Maison", "Blogs", "News & Events"].includes(item.title) ? "flex-center" : "flex items-center justify-center gap-8"}`}>
                    {item.submenu.map((sub, i) => (
                      <Submenu key={i} sub={sub} parentTitle={item.title} />
                    ))}
                  </div>
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
};

export default NavItem;
