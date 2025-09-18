import { motion, AnimatePresence } from 'framer-motion';
import Submenu from './Submenu';

const NavItem = ({ item, hovered, setHovered }) => {
  return (
    <div
      className="relative nav-items mt-2"
      onMouseEnter={() => setHovered(item.title)}
      onMouseLeave={() => setHovered(null)}
    >
      <button className="uppercase font-medium text-sm tracking-wide  ">
        {item.title} 
      </button>

      <AnimatePresence>
        {hovered === item.title && item.submenu.length > 0 && (
          <div
            initial={{ opacity: 0, duration:0.2 }}
            animate={{ opacity: 1, duration:0.2}}
            exit={{ opacity: 0, duration:0.2 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex-center  w-screen fixed left-0 top-[18%]  p-8  z-40"
          >
            {item.submenu.map((sub, i) => (
              <Submenu key={i} sub={sub} />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavItem;