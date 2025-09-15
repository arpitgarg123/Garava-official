import React from 'react'
import NavItem from './Navitems'

const DesktopNav  = ({ navItems, hovered, setHovered }) => {
  return (
     <div className="flex items-center justify-center">
      <div className="flex-center">
        {navItems.map((item, idx) => (
          <NavItem
            key={idx}
            item={item}
            hovered={hovered}
            setHovered={setHovered}
            variant="desktop"
          />
        ))}
      </div>
    </div>
  )
}

export default DesktopNav 