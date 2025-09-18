import { motion } from 'framer-motion';
import { gsap } from 'gsap';

const Submenu = ({ sub }) =>{
  return (
    <motion.div
      className="flex flex-col items-center w-32 cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      onMouseEnter={(e) => {
        gsap.to(e.currentTarget.querySelector('img'), {
          scale: 1.1,
          duration: 0.4,
          ease: 'power3.out',
        });
      }}
      onMouseLeave={(e) => {
        gsap.to(e.currentTarget.querySelector('img'), {
          scale: 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      }}
    >
      <img
        src={sub.img}
        alt={sub.label}
        className="rounded-full h-20 w-20 object-cover mb-2 transition-transform duration-300"
      />
      <span className="text-sm font-medium group-hover:text-primary">
        {sub.label}
      </span>
    </motion.div>
  );
}

export default Submenu;