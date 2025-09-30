import React from 'react'

const Dot = ({ delay = "0ms" }) => {
  return (
   <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-neutral-500"
      style={{ animationDelay: delay }}
    />
  )
}

export default Dot
