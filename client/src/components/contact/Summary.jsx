import React from 'react'

const Summary = ({ title, children }) => {
  return (
     
    <details className=" p-3 ">
      <summary className="cursor-pointer select-none text-[1.0625rem] font-medium">{title}</summary>
      <div className="mt-2 text-[1.0625rem] text-muted-foreground">{children}</div>
    </details>
  );

}

export default Summary