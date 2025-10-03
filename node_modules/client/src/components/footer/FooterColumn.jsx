import React from "react";

const FooterColumn = ({ title, links = [] }) => {
  return (
    <div className="min-w-[160px]">
      <h4 className="text-sm tracking-widest uppercase text-gray-800 mb-4">{title}</h4>
      <ul className="space-y-3">
        {links.map((l, i) => (
          <li key={i}>
            <a
              href={l.href || "#"}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterColumn;
