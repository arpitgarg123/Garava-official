import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { fetchProducts } from '../../features/product/slice';
import Card from './Card';

const Explore = ({ currentProduct }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [randomProducts, setRandomProducts] = useState([]);
  const scrollRef = useRef(null);
  const dispatch = useDispatch();
  
  const { items: products, status } = useSelector(state => state.product.list);
  
  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const slider = scrollRef.current;
    slider.scrollLeft -= e.movementX;
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    // Fetch products for explore section - prefer jewellery but fallback to all
    dispatch(fetchProducts({
      limit: 20,
      page: 1
    }));
  }, [dispatch]);

  useEffect(() => {
    if (products && products.length > 0) {
      // Determine the alternate product type to show
      const currentType = currentProduct?.type?.toLowerCase();
      let alternateType;
      
      // Show opposite category products
      if (currentType === 'jewellery') {
        alternateType = 'fragrance';
      } else if (currentType === 'fragrance') {
        alternateType = 'jewellery';
      } else if (currentType === 'high-jewellery' || currentType === 'high_jewellery') {
        alternateType = 'fragrance'; // High jewellery also shows fragrance
      } else {
        alternateType = null; // For unknown types, show any
      }
      
      // Filter products: exclude current product and prefer alternate type
      let filtered = products.filter(product => 
        product._id !== currentProduct?._id && 
        (alternateType ? product.type?.toLowerCase() === alternateType : true)
      );
      
      // If no alternate type products found, show any products except current
      if (filtered.length === 0) {
        filtered = products.filter(product => product._id !== currentProduct?._id);
      }
      
      const shuffled = shuffleArray(filtered);
      // Take only 6 random products
      setRandomProducts(shuffled.slice(0, 6));
    }
  }, [products, currentProduct?._id, currentProduct?.type]);

  if (status === 'loading') {
    return (
      <div className="w-full py-12 px-4 flex-center flex-col">
        <header className="w-fit">
          <h2 className="head-text text-3xl md:text-4xl">Explore</h2>
          <div className="h-[0.5px] mt-2 bg-black w-full"></div>
        </header>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading products...</div>
        </div>
      </div>
    );
  }

  // Always show the section, even if no products
  if (randomProducts.length === 0) {
    return (
      <div className="w-full py-12 px-4 flex-center flex-col">
        <header className="w-fit">
          <h2 className="head-text text-3xl md:text-4xl">Explore</h2>
          <div className="h-[0.5px] mt-2 bg-black w-full"></div>
        </header>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No products available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 px-4 flex-center flex-col">
      <header className="w-fit">
        <h2 className="head-text text-3xl md:text-4xl">Explore</h2>
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
          <div className="flex gap-6 sm:gap-8 md:gap-10 min-w-max px-4">
            {randomProducts.map((product, index) => {
              // Get the first available image using the correct structure
              const productImage = product.heroImage?.url || 
                                 product.heroImage || 
                                 product.gallery?.[0]?.url || 
                                 product.gallery?.[0] || 
                                 'https://via.placeholder.com/300x300?text=No+Image';
              
              // Get the price - prefer variant price over base price
              const productPrice = product.variants?.[0]?.price || 
                                 product.defaultVariant?.price || 
                                 product.price;
              
              return (
                <div key={product._id || `explore-product-${index}`} className="w-[300px] flex-shrink-0">
                  <Card 
                    img={productImage}
                    title={product.name}
                    price={productPrice ? `₹${productPrice.toLocaleString('en-IN')}` : 'Price on Request'}
                    slug={product.slug}
                    id={product._id}
                    type={product.type}
                    isHorizontal={true}
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

export default Explore;