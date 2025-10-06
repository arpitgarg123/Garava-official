import React from 'react'

const Infotile = ({ title, value, href }) => {
  const Comp = href ? "a" : "div";
  return (
    <Comp
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noreferrer" : undefined}
      className="group flex items-center justify-between rounded-xl border border-gray-400 bg-background px-4 py-3 hover:bg-muted/50"
    >
      <div>
        <div className="text-xs text-muted-foreground">{title}</div>
        <div className="text-md font-medium">{value}</div>
      </div>
      <span className="opacity-40 group-hover:opacity-100">↗</span>
    </Comp>
  );
}

export default Infotile