import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';

const textOnlyMenus = ["Services", "About Us", "Blogs", "News & Events"];

const Submenu = ({ sub, parentTitle, isMobile = false, onClickItem = () => {} }) => {
  const isTextOnly = textOnlyMenus.includes(parentTitle);

  const handleEnter = (e) => {
    if (isMobile || isTextOnly) return;
    const img = e.currentTarget.querySelector('img');
    if (img) {
      gsap.to(img, { scale: 1.1, duration: 0.4, ease: 'power3.out' });
    }
  };

  const handleLeave = (e) => {
    if (isMobile || isTextOnly) return;
    const img = e.currentTarget.querySelector('img');
    if (img) {
      gsap.to(img, { scale: 1, duration: 0.4, ease: 'power3.out' });
    }
  };
  const Content = () => (
    <>
      {isTextOnly ? (
        <div className="bg-gray-200  rounded-full text-black flex items-center justify-center h-28 w-28 sm:h-42 sm:w-42 mb-2 text-center font-semibold text-sm">
          {sub.label}
        </div>
      ) : (
        <img
          src={sub.img}
          alt={sub.label}
          className="h-28 w-28 sm:h-36 sm:w-36 object-cover mb-2 transition-transform duration-300"
          loading="lazy"
        />
      )}
      {!isTextOnly && (
        <span className="text-lg   font-playfair text-center">{sub.label}</span>
      )}
    </>
  );
   const Wrapper = sub.to ? Link : 'div';
  const wrapperProps = sub.to
    ? { to: sub.to, onClick: onClickItem, 'aria-label': sub.label }
    : { onClick: onClickItem, role: 'menuitem', tabIndex: 0, onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && onClickItem() };
  return (
    <motion.div
      className={`flex flex-col items-center ${isMobile ? 'w-28' : 'w-32'} cursor-pointer group`}
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
