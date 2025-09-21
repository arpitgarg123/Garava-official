import { motion, AnimatePresence } from "framer-motion";
import Submenu from "./Submenu";

const NavItem = ({ item, hovered, setHovered }) => {
  return (
    <div
      className="relative nav-items py-3 group"
      onMouseEnter={() => setHovered(item.title)}
      onMouseLeave={() => setHovered(null)}
    >
      <button className="uppercase font-medium font-[montserrat] text-sm tracking-wide  ">
        {item.title}
                <span className="absolute bottom-[-8px] left-0 w-full h-[1px] bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

      </button>
       <div className="absolute bottom-2 left-0 w-full h-[2px] bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />

      <AnimatePresence>
        {hovered === item.title && item.submenu.length > 0 && (
         <>
          <div className="absolute h-8 w-full -bottom-8 bg-transparent" />
         <motion.div
            initial={{ opacity: 0,  }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="submenu-container w-screen fixed bg-white left-0 top-[130px] py-8  z-40"
          >
            {/* Add an invisible bridge to prevent gap */}

            <div className="max-w-7xl mx-auto">
                <div className="flex-center">
                  {item.submenu.map((sub, i) => (
                    <Submenu key={i} sub={sub} parentTitle={item.title} />
                  ))}
                </div>
              </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavItem;
