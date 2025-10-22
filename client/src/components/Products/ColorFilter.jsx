import React from 'react'

const COLOR_OPTIONS = [
  { key: "rose", label: "Rose Gold", hex: "#e7b9a4" },
  { key: "silver", label: "Silver", hex: "#d9d9d9" },
  { key: "gold", label: "Golden", hex: "#c79b3a" },
];
const ColorFilter = ({ selected = [], onChange = () => {} }) => {
     const toggle = (key) => {
    if (selected.includes(key)) onChange(selected.filter((k) => k !== key));
    else onChange([...selected, key]);
  };
  return (
   <div aria-labelledby="color-filter">
      <h3 id="color-filter" className="text-lg font-medium text-gray-900 mb-3">Color</h3>

      <div className="flex flex-col items-start justify-start ">
        {COLOR_OPTIONS.map((c) => {
          const active = selected.includes(c.key);
          return (
            <button
              key={c.key}
              onClick={() => toggle(c.key)}
              className={`flex w-full items-center gap-3 px-3 py-2  text-[1.0625rem] transition focus:outline-none ${
                active ? "bg-black text-white" : "bg-white text-gray-800 hover:bg-gray-50 border border-gray-200"
              }`}
              aria-pressed={active}
            >
              <span
                aria-hidden="true"
                className="inline-block w-5 h-5 rounded-full border-2"
                style={{ 
                  background: c.hex, 
                  borderColor: active ? "#fff" : "#e5e7eb",
                  boxShadow: active ? "0 0 0 2px rgba(0,0,0,0.1)" : "none"
                }}
              />
              <span className="flex-1 text-left">{c.label}</span>
              {active && (
                <span className="text-[1.0625rem]">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  )
}

export default ColorFilter