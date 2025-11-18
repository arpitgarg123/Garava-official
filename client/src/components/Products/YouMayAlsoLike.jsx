import React, { useRef, useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { listProductsApi } from '../../features/product/api';
import Card from './Card';
import { getProductImage } from '../../utils/imageValidation';

const YouMayAlsoLike = ({ currentProduct }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const slider = scrollRef.current;
    slider.scrollLeft -= e.movementX;
  };

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (!currentProduct?.type) return;
      
      setLoading(true);
      try {
        // Fetch products of the SAME type for "You May Also Like"
        const response = await listProductsApi({
          type: currentProduct.type,
          limit: 12,
          page: 1
        });
        
        const products = response.data?.products || response.data?.data || [];
        
        // Filter out the current product and take first 6
        const filtered = products
          .filter(product => product._id !== currentProduct._id)
          .slice(0, 6);
        
        setSimilarProducts(filtered);
      } catch (error) {
        console.error('Failed to fetch similar products:', error);
        setSimilarProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarProducts();
  }, [currentProduct?._id, currentProduct?.type]);

  if (loading) {
    return (
      <div className="w-full py-12 px-4 flex-center flex-col">
        <header className="w-fit">
          <h2 className="head-text text-3xl md:text-4xl">You may also like</h2>
          <div className="h-[0.5px] mt-2 bg-black w-full"></div>
        </header>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    );
  }

  if (similarProducts.length === 0 && !loading) {
    return (
      <div className="w-full py-12 px-4 flex-center flex-col">
        <header className="w-fit">
          <h2 className="head-text text-3xl md:text-4xl">You may also like</h2>
          <div className="h-[0.5px] mt-2 bg-black w-full"></div>
        </header>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No similar products found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 flex-center flex-col">
      <header className="w-fit">
        <h2 className="head-text text-3xl md:text-4xl">You may also like</h2>
        <div className="h-[0.5px] mt-2 bg-black w-full"></div>
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
            {similarProducts.map((product, index) => {
              // Get the first available image using utility function
              const productImage = getProductImage(product, '/placeholder.webp');
              
              // Get the price - prefer variant price over base price
              const productPrice = product.variants?.[0]?.price || 
                                 product.defaultVariant?.price || 
                                 product.price;
              
              // Get variant data for cart operations
              const variantId = product.defaultVariant?._id || product.variants?.[0]?._id || null;
              const variantSku = product.defaultVariant?.sku || product.variants?.[0]?.sku || null;
              
              return (
                <div key={product._id || `product-${index}`} className="w-[260px] flex-shrink-0">
                  <Card 
                    product={product}
                    img={productImage}
                    title={product.name}
                    price={productPrice ? `₹${productPrice.toLocaleString('en-IN')}` : 'Price on Request'}
                    slug={product.slug}
                    id={product._id}
                    type={product.type}
                    variantId={variantId}
                    variantSku={variantSku}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouMayAlsoLike;