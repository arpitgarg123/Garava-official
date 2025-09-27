import React from 'react'

const Summary = ({ title, children }) => {
  return (
     
    <details className="rounded-xl border bg-background p-3 open:shadow-sm">
      <summary className="cursor-pointer select-none text-sm font-medium">{title}</summary>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </details>
  );

}

export default Summary