import React, { useEffect, useRef } from "react";

const MobileNav = ({ open, onClose, navItems = [] }) => {
    const panelRef = useRef(null);

  // prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [open]);

  if (!open) return null;
  return (
     <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <aside
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-sm bg-white text-black shadow-xl overflow-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="font-playfair text-lg">GARAVA</div>
            <button onClick={onClose} aria-label="Close menu" className="p-2">✕</button>
          </div>

          <nav className="mt-6">
            <ul className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <li key={i} className="border-b border-gray-100">
                  <details className="group">
                    <summary className="py-4 px-2 cursor-pointer flex justify-between items-center">
                      <span className="font-medium">{item.title}</span>
                      {item.submenu?.length > 0 && <span className="text-md group-open:rotate-180 transition-transform">▾</span>}
                    </summary>

                    {item.submenu?.length > 0 && (
                      <div className="px-4 pb-4">
                        <ul className="flex flex-col gap-2">
                          {item.submenu.map((s, j) => (
                            <li key={j}>
                              <a href="#" className="block py-2 text-gray-700 hover:text-black">{s.label}</a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </details>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 border-t pt-4 flex gap-4">
            <a href="#" className="text-gray-700">Privacy</a>
            <a href="#" className="text-gray-700">Help</a>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default MobileNav