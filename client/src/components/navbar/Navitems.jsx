import { motion, AnimatePresence } from 'framer-motion';
import Submenu from './Submenu';

const NavItem = ({ item, hovered, setHovered }) => {
  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(item.title)}
      onMouseLeave={() => setHovered(null)}
    >
      <button className="uppercase font-medium tracking-wide hover:text-primary transition-colors">
        {item.title} 
      </button>

      <AnimatePresence>
        {hovered === item.title && item.submenu.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="flex-center  w-screen fixed left-0 top-36  bg-white shadow-xl rounded-2xl p-6  z-40"
          >
            {item.submenu.map((sub, i) => (
              <Submenu key={i} sub={sub} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default NavItem;