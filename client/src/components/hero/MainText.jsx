import React, { forwardRef } from "react";

const MainText = forwardRef(({ text, highlight }, ref) => {
  return (
    <div
      ref={ref}
      className="text-6xl font-montserrat leading-snug text-gray-900"
    >
      {text.split(highlight)[0]}
      <span className="font-playfair">{highlight}</span>
      {text.split(highlight)[1]}
    </div>
  );
});

export default MainText;
