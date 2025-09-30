import React from 'react'
import Dot from './Dot';

const TypingBubble = () => {
  return (
   
    <div className="max-w-[70%] rounded-2xl bg-white px-3 py-2 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-1 py-0.5">
        <Dot />
        <Dot delay="150ms" />
        <Dot delay="300ms" />
      </div>
    </div>
  );

}

export default TypingBubble