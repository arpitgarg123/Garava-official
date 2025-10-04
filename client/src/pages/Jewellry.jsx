import Card from '../components/Products/Card'
import jFront from "../assets/images/j-front.jpg";
import jBack from "../assets/images/j-back.jpg";
import j from "../assets/images/jewellry4.png";
import j2 from "../assets/images/j.jpg";
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/header/PageHeader';

const Jewellry = () => {
  const navigate = useNavigate()
    const products = [
    { id: 1, img: jBack, title: "Round Solitaire Ring", price: "₹79,153.0" },
    { id: 2, img: jFront, title: "Classic Necklace", price: "₹129,999.0" },
    { id: 3, img: j, title: "Statement Earrings", price: "₹54,200.0" },
    { id: 4, img: j2, title: "Everyday Band", price: "₹24,500.0" },
  ];
  return (
    <div className='w-full py-6 '>
        <PageHeader title="Jewellery" />
       <section className="bg-gray-50  w-[98%] mx-auto py-10  ">
        <div className="mx-auto  w-[95%] h-[80%]">
      
          <div className="products-grid">
           
             {products.map((p) => (
            
              <Card key={p.id} img={p.img} title={p.title} price={p.price}  />
            
            ))}
            
          
          </div>

          <div className="flex-center mt-10 text-center ">
           <Link  to='/products/jewellery'>
            <button 
            
              className="btn "
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

export default Jewellry