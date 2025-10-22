import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const textOnlyMenus = ["Maison", "Blogs", "News & Events"];

const Submenu = ({ sub, parentTitle, isMobile = false, onClickItem = () => {} }) => {
  const isTextOnly = textOnlyMenus.includes(parentTitle);

  const handleEnter = (e) => {
    if (isMobile || isTextOnly) return;
    const img = e.currentTarget.querySelector('img');
    if (img) {
      gsap.to(img, { 
        scale: 1.05, 
        duration: 0.3, 
        ease: 'power2.out'
      });
    }
  };

  const handleLeave = (e) => {
    if (isMobile || isTextOnly) return;
    const img = e.currentTarget.querySelector('img');
    if (img) {
      gsap.to(img, { 
        scale: 1, 
        duration: 0.3, 
        ease: 'power2.out'
      });
    }
  };
  const Content = () => (
    <>
      {isTextOnly ? (
        <div className="bg-gray-200  rounded-full text-black flex items-center px-4 justify-center h-28 w-28 sm:h-42 sm:w-44 text-center font-semibold text-[1.0625rem]">
          {sub.label}
        </div>
      ) : (
        <img
          src={sub.img}
          alt={sub.label}
          className="h-32 w-32 sm:h-40 sm:w-40 object-cover mb-2 transition-transform duration-300"
          loading="eager"
        />
      )}
      {!isTextOnly && (
        <span className="text-[1.0625rem]  font-playfair text-center">{sub.label}</span>
      )}
    </>
  );
   const Wrapper = sub.to ? Link : 'div';
  const wrapperProps = sub.to
    ? { to: sub.to, onClick: onClickItem, 'aria-label': sub.label }
    : { onClick: onClickItem, role: 'menuitem', tabIndex: 0, onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onClickItem() };
  return (
    <motion.div
      className={`flex flex-col items-center ${isMobile ? 'w-32' : 'w-40'} cursor-pointer group`}
      whileHover={isMobile ? undefined : { scale: 1.05 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onClick={onClickItem}
      role="menuitem"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClickItem()}
    >
  
       <Wrapper {...wrapperProps} className="flex flex-col items-center">
        <Content />
      </Wrapper>
    </motion.div>
  );
};

export default Submenu;
