import { motion, AnimatePresence } from 'framer-motion';
import Submenu from './Submenu';

const NavItem = ({ item, hovered, setHovered }) => {
  
  return (
    <div
      className="relative nav-items mt-5"
      onMouseEnter={() => setHovered(item.title)}
      onMouseLeave={() => setHovered(null)}
    >
      <button className="uppercase font-medium text-sm tracking-wide  ">
        {item.title} 
      </button>
 <AnimatePresence>
        {hovered === item.title && item.submenu.length > 0 && (
          <div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1}}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex-center w-screen fixed left-0 top-[45%]  z-40 text-black"
          >
            {/* Add an invisible bridge to prevent gap */}
            <div className="absolute -top-16 left-0 w-full h-16 bg-transparent" />
            
            <div className="py-5 w-full ">
              <div className="flex justify-center gap-8">
                {item.submenu.map((sub, i) => (
                  <Submenu key={i} sub={sub} parentTitle={item.title} />
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavItem;