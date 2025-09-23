import React from 'react'
import Card from '../components/Products/Card'
import f1 from "../assets/images/f-front.png";
import f2 from "../assets/images/fragnance.png";
import f3 from "../assets/images/fragnance1.png";
import f4 from "../assets/images/essential-f.png";
import { Link } from 'react-router-dom';

const Fragnance = () => {
    const products = [
      { id: 1, img: f1, title: "Fragnance 1", price: "₹79,153.0" },
      { id: 2, img: f2, title: "Classic fragnance", price: "₹129,999.0" },
      { id: 3, img: f3, title: "Statement fragnance", price: "₹54,200.0" },
      { id: 4, img: f4, title: "Everyday fragnance", price: "₹24,500.0" },
    ];
  return (
     <div className='w-full py-6'>
       <header className="head">
          <div className="head-inner max-w-6xl mx-auto ">
            <h2 className="head-text text-3xl md:text-4xl">Fragnance</h2>
            <div className="head-line "></div>
          </div>
        </header>
         <section className="bg-gray-100 w-[98%] mx-auto py-10 ">
        <div className="mx-auto w-[95%] h-[80%] ">
      
          <div className="products-grid">
            {products.map((p) => (
              <Card key={p.id} img={p.img} title={p.title} price={p.price} />
            ))}
          </div>

          <div className="flex-center mt-12  text-center">
             <Link  to='/products'>
            <button 
            
              className="btn"
              aria-label="View more products"
            >
              View More..
            </button>
           </Link>
          </div>
        </div>
      </section>

     
    </div>
  )
}

export default Fragnance