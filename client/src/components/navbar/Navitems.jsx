import { motion, AnimatePresence } from "framer-motion";
import Submenu from "./Submenu";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const NavItem = ({ item, hovered, setHovered, isMobile = false, onNavigate = () => {} }) => {
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const [submenuTop, setSubmenuTop] = useState(130);
  const [selectedCategory, setSelectedCategory] = useState('ALL COLLECTIONS');
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

  const handleDesktopClick = () => {
    if (!isMobile && item.to) {
      navigate(item.to);
      onNavigate(); // in case you use drawer close function etc.
    }
  };

  return (
    <div
      className={`relative nav-items ${isMobile ? 'py-0' : 'py-2'} group`}
      onMouseEnter={handleEnter}
    >
      {/* Trigger */}
      <button
        className="uppercase cursor-pointer text-left z-50 font-normal text-[17px] tracking-[0.1em] flex items-center justify-center px-4 py-2 hover:opacity-70 transition-opacity duration-200"
        onClick={isMobile ? handleToggleMobile : handleDesktopClick}
        aria-expanded={isMobile ? !!isOpenMobile : hovered === item.title}
        aria-controls={isMobile ? `${item.title}-submenu` : undefined}
      >
        <span className="whitespace-nowrap">{item.title}</span>
      </button>

      {!isMobile  && (
        <div className="absolute bottom-2 left-0 w-full h-[1.5px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
      )}

      {/* Desktop submenu (hover) */}
      {!isMobile && (
        <AnimatePresence>
          {hovered === item.title && hasSubmenu && (
            <>
              {/* <div className="absolute left-0 h-8 w-full  -bottom-8 bg-red-500" /> */}
              <motion.div
                initial={{  y: -1 }}
                animate={{  y: 0 }}
                exit={{  y: -1 }}
                transition={{ duration: 0.3 }}
                className="submenu-container w-full fixed bg-white  text-black left-0 top-full py-8 z-50 "
              >
                <div className="max-w-5xl mx-auto  ">
                  {/* Category Tabs */}
                  {['jewellery', 'Fragrance', 'HIGH JEWELLERY'].includes(item.title) && (
                    <div className="flex items-center justify-start  mb-6 pb-4 overflow-x-auto">
                      <button
                        onMouseEnter={() => setSelectedCategory('ALL COLLECTIONS')}
                        className={`text-sm font-semibold tracking-[0.2em] uppercase whitespace-nowrap pb-2 transition-all ${
                          selectedCategory === 'ALL COLLECTIONS' 
                            ? 'border-b-2 border-black' 
                            : 'hover:opacity-70'
                        }`}
                      >
                        ALL COLLECTIONS
                      </button>
                      {item.submenu
                        .filter(sub => !sub.isAllCollection) // Skip ALL COLLECTIONS items from tabs
                        .map((sub, idx) => (
                          <button
                            key={idx}
                            onMouseEnter={() => setSelectedCategory(sub.label)}
                            className={`text-sm font-normal mx-6 tracking-[0.15em] uppercase whitespace-nowrap pb-2 transition-all ${
                              selectedCategory === sub.label 
                                ? 'border-b-2 border-black font-semibold' 
                                : 'hover:opacity-70'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))
                      }
                    </div>
                  )}
                  
                  {/* Submenu items grid - filtered by selected category */}
                  <div style={{
                    gap:'2.8rem'
                  }} className={`flex-center   w-full ${
                    ['jewellery', 'Fragrance', 'HIGH JEWELLERY'].includes(item.title) 
                      ? 'grid-cols-6 gap-6' 
                      : ["Maison", "Blogs", "News & Events"].includes(item.title)
                      ? 'grid-cols-2 gap-4'
                      : 'grid-cols-6 gap-8'
                  }`}>
                    {(() => {
                      // For jewellery ALL COLLECTIONS - show only isAllCollection items
                      if (item.title === 'jewellery' && selectedCategory === 'ALL COLLECTIONS') {
                        return item.submenu
                          .filter(sub => sub.isAllCollection)
                          .map((sub, i) => (
                            <Submenu key={i} sub={sub} parentTitle={item.title} />
                          ));
                      }
                      
                      // For ALL COLLECTIONS (other sections) - show all items
                      if (selectedCategory === 'ALL COLLECTIONS') {
                        return item.submenu.flatMap((sub, i) => {
                          // Skip isAllCollection items for non-jewellery sections
                          if (sub.isAllCollection) return [];
                          
                          // If item has subcategories (like FLAME SERIES), render those
                          if (sub.subcategories) {
                            return sub.subcategories.map((subcat, j) => (
                              <Submenu key={`${i}-${j}`} sub={subcat} parentTitle={item.title} />
                            ));
                          }
                          // Otherwise render the item itself
                          return <Submenu key={i} sub={sub} parentTitle={item.title} />;
                        });
                      }
                      
                      // For specific category selection (FLAME SERIES, etc.)
                      const selectedItem = item.submenu.find(sub => sub.label === selectedCategory);
                      
                      // ✅ FLAME SERIES - Show "UPCOMING SERIES" message
                      if (selectedItem?.label === 'FLAME SERIES') {
                        return (
                          <div className="col-span-4 text-center py-12">
                            <h3 className="text-2xl font-semibold tracking-[0.2em] uppercase text-gray-800 mb-2">
                              UPCOMING SERIES
                            </h3>
                            <p className="text-sm text-gray-600 tracking-wide">
                              Coming Soon
                            </p>
                          </div>
                        );
                      }
                      
                      // ❌ COMMENTED: Original FLAME SERIES logic (will be enabled after launch)
                      // if (selectedItem?.subcategories) {
                      //   // Show subcategories if exists (like FLAME SERIES -> Rings, Earrings, etc.)
                      //   return selectedItem.subcategories.map((subcat, i) => (
                      //     <Submenu key={i} sub={subcat} parentTitle={item.title} />
                      //   ));
                      // }
                      
                      // For other categories with subcategories
                      if (selectedItem?.subcategories) {
                        return selectedItem.subcategories.map((subcat, i) => (
                          <Submenu key={i} sub={subcat} parentTitle={item.title} />
                        ));
                      } else if (selectedItem) {
                        // Show single selected item
                        return <Submenu sub={selectedItem} parentTitle={item.title} />;
                      }
                      return null;
                    })()}
                  </div>
                  
                  {/* View All link - hide for FLAME SERIES */}
                  {['jewellery', 'Fragrance', 'HIGH JEWELLERY'].includes(item.title) && 
                   selectedCategory !== 'FLAME SERIES' && (
                    <div className="mt-6 text-center">
                      <Link
                        className="text-xs font-medium tracking-[0.15em] uppercase underline hover:opacity-70 transition-opacity"
                        to={
                          item.title === 'jewellery' ? '/products/jewellery'
                          : item.title === 'Fragrance' ? '/products/fragrance'
                          : item.title === 'HIGH JEWELLERY' ? '/products/high-jewellery'
                          : '/products'
                        }
                      >
                        View all
                      </Link>
                    </div>
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
    className="overflow-hidden "
        >
          <div className="py-3 ">
            <div className="flex flex-wrap  gap-4 px-2">
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
