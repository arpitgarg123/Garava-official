import React from 'react'

const Summary = ({ title, children }) => {
  return (
     
    <details className=" p-3 ">
      <summary className="cursor-pointer select-none text-sm font-medium">{title}</summary>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </details>
  );

}

export default Summary