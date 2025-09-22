import React, { useRef, useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import f1 from "../../assets/images/f-front.png";
import f2 from "../../assets/images/fragnance.png";
import f3 from "../../assets/images/fragnance1.png";
import f4 from "../../assets/images/essential-f.png";

// import './product.css'
import { Link } from 'react-router-dom'
import Card from '../Products/Card';

const Recommendation = ({img,title = "Product", price = ""}) => {
     const [isDragging, setIsDragging] = useState(false);
    const scrollRef = useRef(null);
    
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);
    const handleMouseLeave = () => setIsDragging(false);
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const slider = scrollRef.current;
      slider.scrollLeft -= e.movementX;
    };

    const products = [
            { id: 1, img: f1, title: "Fragnance 1", price: "₹79,153.0" },
            { id: 2, img: f2, title: "Classic fragnance", price: "₹129,999.0" },
            { id: 3, img: f3, title: "Statement fragnance", price: "₹54,200.0" },
            { id: 4, img: f4, title: "Everyday fragnance", price: "₹24,500.0" },
                    { id: 5, img: f1, title: "Fragnance 1", price: "₹79,153.0" },
                       { id: 6, img: f2, title: "Classic fragnance", price: "₹129,999.0" },
          ];

  return (
      <div className="w-full py-12 px-4 flex-center flex-col">
     <header className=" w-fit  ">
         
            <h2 className="head-text text-3xl md:text-4xl">Recommendation</h2>
            <div className=" h-[0.5px] mt-2 bg-black w-full"></div>
        
        </header>
        <div className="max-w-[95%] mx-auto relative group">
       
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 cursor-pointer p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-white"
            onClick={() => scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })}
          >
            <IoIosArrowBack size={24} />
          </button>
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hover:bg-white"
            onClick={() => scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })}
          >
            <IoIosArrowForward size={24} />
          </button>

          <div 
            ref={scrollRef}
            className={`overflow-x-auto scrollbar-hide ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <div className="flex gap-6 min-w-max px-4">
              {products.map((p) => (
                <div key={p.id} className="w-[400px] flex-shrink-0">
                  <Card img={p.img} title={p.title} price={p.price} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  )
}

export default Recommendation
