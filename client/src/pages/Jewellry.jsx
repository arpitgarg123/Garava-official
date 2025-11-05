import Card from '../components/Products/Card'
import { Link, useNavigate } from 'react-router-dom';
import PageHeader from '../components/header/PageHeader';
import { useEffect, useState, useRef } from 'react';
import { listProductsApi } from '../features/product/api';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const Jewellry = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  useEffect(() => {
    const fetchJewelleryProducts = async () => {
      try {
        setLoading(true);
        const { data } = await listProductsApi({
          type: 'jewellery',
          limit: 12,
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
          const transformedProducts = apiProducts
            .filter(product => product && product._id) // Filter out only completely invalid products
            .map(product => {
            // Check if product is price on request
            const isPriceOnDemand = product.isPriceOnDemand || product.defaultVariant?.isPriceOnDemand;
            const price = (isPriceOnDemand  || "0")
              ? "Price on Request" 
              : `₹${product.defaultVariant?.price?.toLocaleString('en-IN') || product.priceRange?.min?.toLocaleString('en-IN') || '0'}.0`;
              
            return {
              id: product._id || product.id,
              img: product.heroImage?.url || product.heroImage || 'https://via.placeholder.com/300x300?text=No+Image',
              title: product.name || "Jewellery Product",
              price: price,
              slug: product.slug,
              variantId: product.defaultVariant?._id || product.variants?.[0]?._id || null,
              variantSku: product.defaultVariant?.sku || product.variants?.[0]?.sku || null
            };
          });
          
          setProducts(transformedProducts);
        } else {
          // Set empty array if no products found
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching jewellery products:', error);
        // Set empty array on error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJewelleryProducts();
  }, []);
  return (
    <div className='w-full py-6'>
        <PageHeader title="Jewellery" />
       <section className="w-full mx-auto py-10">
        {/* 
          Optimized for exactly 5 cards:
          - Container: max-w-[1408px] fits viewport
          - Card width: 260px × 5 = 1,300px
          - Gap: 17px × 4 = 68px
          - Total: 1,368px (fits perfectly)
        */}
        <div className="mx-auto w-full max-w-[1408px] px-4">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading jewellery products...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600">No jewellery products available</p>
            </div>
          ) : (
          <>
          {/* Horizontal scrollable container with arrows */}
          <div className="relative group w-full">
            {/* Left Arrow */}
            <button
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({ left: -554, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-[45%] -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
              aria-label="Scroll left"
            >
              <IoIosArrowBack className="text-2xl text-gray-800" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => {
                if (scrollRef.current) {
                  scrollRef.current.scrollBy({ left: 554, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-[45%] -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center"
              aria-label="Scroll right"
            >
              <IoIosArrowForward className="text-2xl text-gray-800" />
            </button>
            
            <div 
              ref={scrollRef}
              className="overflow-x-auto w-full scrollbar-hide cursor-grab active:cursor-grabbing"
            >
              <div className="flex gap-[17px] min-w-max py-4">
                {products.map((p) => (
                  <div key={p.id} className="w-[260px] flex-shrink-0">
                    <Card 
                      img={p.img} 
                      title={p.title} 
                      price={p.price} 
                      slug={p.slug} 
                      id={p.id}
                      type="jewellery" 
                      isHorizontal={true}
                      variantId={p.variantId}
                      variantSku={p.variantSku}
                    />
                  </div>
                ))}
              </div>
            </div>
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
          </>
          )}
        </div>
      </section>

     
    </div>
  )
}

export default Jewellry