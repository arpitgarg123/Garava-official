import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const textOnlyMenus = [
  "Services",
  "About Us",
  "Blogs",
  "News & Events"
];
const Submenu = ({ sub,parentTitle }) =>{
   const isTextOnly = textOnlyMenus.includes(parentTitle);
  return (
    <motion.div
      className="flex flex-col items-center w-32 cursor-pointer   group"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={isTextOnly ? undefined : (e) => {
        gsap.to(e.currentTarget.querySelector('img'), {
          scale: 1.1,
          duration: 0.4,
          ease: 'power3.out',
        });
      }}
      onMouseLeave={isTextOnly ? undefined : (e) => {
        gsap.to(e.currentTarget.querySelector('img'), {
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      }}
    >
      {isTextOnly ? (
        <div className=" bg-gray-200 text-black flex items-center justify-center h-32 w-32 mb-2 text-center font-semibold text-sm">
          {sub.label}
        </div>
      ) : (
        <img
          src={sub.img}
          alt={sub.label}
          className=" h-36 w-36 object-cover mb-2 transition-transform duration-300"
        />
      )}
      {!isTextOnly && (
        <span className="text-sm font-medium group-hover:text-primary">
          {sub.label}
        </span>
      )}
    </motion.div>
  );
}

export default Submenu;