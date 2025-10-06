import React, { useEffect, useState } from 'react'
import Card from '../components/Products/Card'
import f1 from "../assets/images/f-front.png";
import f2 from "../assets/images/fragnance.png";
import f3 from "../assets/images/fragnance1.png";
import f4 from "../assets/images/essential-f.png";
import { Link } from 'react-router-dom';
import PageHeader from '../components/header/PageHeader';
import { listProductsApi } from '../features/product/api';

const Fragnance = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fallback static products (same as before to maintain exact UI)
  const staticProducts = [
    { id: 1, img: f1, title: "Fragnance 1", price: "₹79,153.0" },
    { id: 2, img: f2, title: "Classic fragnance", price: "₹129,999.0" },
    { id: 3, img: f3, title: "Statement fragnance", price: "₹54,200.0" },
    { id: 4, img: f4, title: "Everyday fragnance", price: "₹24,500.0" },
  ];

  useEffect(() => {
    const fetchFragranceProducts = async () => {
      try {
        setLoading(true);
        const { data } = await listProductsApi({
          type: 'fragrance',
          limit: 4,
          page: 1
        });
        
        let apiProducts = [];
        if (Array.isArray(data)) {
          apiProducts = data;
        } else if (data?.products) {
          apiProducts = data.products;
        } else if (data?.items) {
          apiProducts = data.items;
        }

        if (apiProducts && apiProducts.length > 0) {
          // Transform backend data to match UI expectations
          const transformedProducts = apiProducts.slice(0, 4).map(product => ({
            id: product._id || product.id,
            img: product.heroImage?.url || product.heroImage || staticProducts[0].img,
            title: product.name || "Fragrance Product",
            price: `₹${product.defaultVariant?.price?.toLocaleString('en-IN') || product.priceRange?.min?.toLocaleString('en-IN') || '0'}.0`,
            slug: product.slug
          }));
          
          // If we have enough products from API, use them; otherwise mix with static
          if (transformedProducts.length >= 4) {
            setProducts(transformedProducts);
          } else {
            const combined = [...transformedProducts];
            const remaining = 4 - transformedProducts.length;
            combined.push(...staticProducts.slice(0, remaining));
            setProducts(combined);
          }
        } else {
          // Use static products as fallback
          setProducts(staticProducts);
        }
      } catch (error) {
        console.error('Error fetching fragrance products:', error);
        // Use static products as fallback on error
        setProducts(staticProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchFragranceProducts();
  }, []);
  return (
     <div className='w-full py-6'>
       <PageHeader title="Fragnance" />
         <section className="bg-gray-50 w-[98%] mx-auto py-10 ">
        <div className="mx-auto w-[95%] h-[80%] ">
      
          <div className="products-grid">
            {products.map((p) => (
              <Card key={p.id} img={p.img} title={p.title} price={p.price} slug={p.slug} id={p.id} />
            ))}
          </div>

          <div className="flex-center mt-12  text-center  cursor-pointer"  >
             <Link  to='/products/Fragrance'>
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