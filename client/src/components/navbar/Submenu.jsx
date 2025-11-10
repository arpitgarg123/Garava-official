import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const textOnlyMenus = ["Maison", "Blogs", "News & Events"];

const Submenu = ({ sub, parentTitle, isMobile = false, onClickItem = () => {} }) => {
  const isTextOnly = textOnlyMenus.includes(parentTitle);

  const Content = () => (
    <>
      {isTextOnly ? (
        <div className="bg-gray-200  rounded-full text-black flex items-center px-4 justify-center h-28 w-28 sm:h-42 sm:w-44 text-center font-semibold text-[1.0625rem]">
            {sub.label}
        
        </div>
      ) : (
        <div className="flex flex-col  items-center group/item">
          <div className="relative overflow-hidden  mb-2 w-full aspect-square">
            <img
              src={sub.img}
              alt={sub.label}
              className="h-32 w-32 sm:w-40 sm:h-40 object-cover transition-transform duration-700 ease-out group-hover/item:scale-105"
              loading="lazy"
            />
          </div>
          <span className="text-sm  tracking-[0.1em] uppercase text-center hover:opacity-70 transition-opacity">
            {sub.label}
          </span>
        </div>
      )}
    </>
  );

  const Wrapper = sub.to ? Link : 'div';
  const wrapperProps = sub.to
    ? { to: sub.to, onClick: onClickItem, 'aria-label': sub.label }
    : { onClick: onClickItem, role: 'menuitem', tabIndex: 0 };

  return (
    <Wrapper {...wrapperProps} className="flex flex-col cursor-pointer">
      <Content />
    </Wrapper>
  );
};

export default Submenu;
