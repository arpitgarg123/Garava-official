import React from 'react'
import PageHeader from '../components/header/PageHeader'
import insta1 from '../assets/images/insta.jpg'
import insta2 from '../assets/images/insta1.jpg'
import insta3 from '../assets/images/insta2.jpg'
import insta4 from '../assets/images/insta3.jpg'
import Card from '../components/Products/Card'
import { Link } from 'react-router-dom'


const InstaPost = () => {
     const products = [
          { id: 1, img: insta1,  },
          { id: 2, img: insta2, },
          { id: 3, img: insta3 },
          { id: 4, img: insta4},
        ];
  return (
    <div className='w-full py-6'>
       <PageHeader title="#Posts"  />
       <p className=' text-center w-full'>Check how GARAVA shares beauty — from sparkling diamonds to signature perfumes — <br /> in our latest Instagram posts.</p>
         <section className="w-[98%] mx-auto py-10 ">
        <div className="mx-auto w-[95%] h-[80%] ">
      
          <div className="products-grid">
            {products.map((p) => (
                 <article key={p.id} className="card " tabIndex="0" >
      <div className="card-img-wrapper">
        <img
          className="card-img"
          src={p.img}
        //   alt={title}
          loading="lazy"
          width="800"
          height="800"
        />
      
      </div>

      {/* <div className="mt-3 text-center ">
        <h3 className="card-title">{title}</h3>
      
      </div> */}
    </article>
            ))}
          </div>

          <div className="flex-center mt-12  text-center  cursor-pointer"  >
             <a
            className="btn "
           
            href="https://www.instagram.com/garavaofficial?igsh=MTE2MWZrMzU1aGMx"
            aria-label="Explore Our Instagram"
          >
            Explore Our Instagram
          </a>
          </div>
        </div>
      </section>

     
    </div>
  )
}

export default InstaPost