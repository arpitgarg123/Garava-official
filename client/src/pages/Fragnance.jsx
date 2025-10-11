import React, { useEffect, useState, useRef } from 'react'
import Card from '../components/Products/Card'
import { Link } from 'react-router-dom';
import PageHeader from '../components/header/PageHeader';
import { listProductsApi } from '../features/product/api';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Fragnance = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

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
          const transformedProducts = apiProducts.map(product => ({
            id: product._id || product.id,
            img: product.heroImage?.url || product.heroImage || 'https://via.placeholder.com/300x300?text=No+Image',
            title: product.name || "Fragrance Product",
            price: `₹${product.defaultVariant?.price?.toLocaleString('en-IN') || product.priceRange?.min?.toLocaleString('en-IN') || '0'}.0`,
            slug: product.slug
          }));
          
          setProducts(transformedProducts);
        } else {
          // Set empty array if no products found
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching fragrance products:', error);
        // Set empty array on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFragranceProducts();
  }, []);
  return (
     <div className='w-full py-6'>
       <PageHeader title="Fragnance" />
         <section className="w-[98%] mx-auto py-10">
        <div className="mx-auto w-[95%] max-w-7xl">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading fragrance products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No fragrance products available</p>
            </div>
          ) : (
          <>
          {/* Horizontal scrollable container */}
          <div className="relative group">
           
            
            <div 
              ref={scrollRef}
              className="overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
            >
              <div className="flex gap-6 sm:gap-8 md:gap-10 min-w-max px-4 py-4">
                {products.map((p) => (
                  <div key={p.id} className="w-[250px] sm:w-[280px] md:w-[300px] flex-shrink-0">
                    <Card 
                      img={p.img} 
                      title={p.title} 
                      price={p.price} 
                      slug={p.slug} 
                      id={p.id} 
                      isHorizontal={true}
                    />
                  </div>
                ))}
              </div>
            </div>
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
          </>
          )}
        </div>
      </section>

     
    </div>
  )
}

export default Fragnance