import { useState, useEffect } from 'react';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

// Reduced to 4 products for better layout
const dummyProducts = [
  {
    productId: 'w1',
    product: {
      name: 'Mystic Rose Essence',
      type: 'Fragrance',
      price: 8500,
      heroImage: { url: '/src/assets/images/f-front.png' }
    }
  },
  {
    productId: 'w2',
    product: {
      name: 'Golden Celestial Ring',
      type: 'jewellery',
      price: 15000,
      heroImage: { url: '/src/assets/images/j-front.jpg' }
    }
  },
  {
    productId: 'w3',
    product: {
      name: 'Eternal Bloom Perfume',
      type: 'Fragrance',
      price: 12000,
      heroImage: { url: '/src/assets/images/f.png' }
    }
  },
  {
    productId: 'w4',
    product: {
      name: 'Diamond Aurora Necklace',
      type: 'jewellery',
      price: 25000,
      heroImage: { url: '/src/assets/images/j.jpg' }
    }
  }
];

const WishlistContent = ({ compact = false, maxItems = null }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProducts(dummyProducts);
      setLoading(false);
    }, 500);
  }, []);

  const handleRemoveItem = (productId) => {
    setProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const handleMoveToCart = (productId) => {
    console.log('Moving to cart:', productId);
  };

  const displayProducts = maxItems ? products.slice(0, maxItems) : products;

  if (loading) {
    return (
      <div className={`grid grid-cols-2 ${compact ? 'gap-2' : 'lg:grid-cols-4 gap-3'}`}>
        {Array.from({ length: compact ? 2 : 4 }).map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-gray-100 rounded" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CiHeart size={40} className="mx-auto mb-3 text-gray-300" />
        <p className="text-sm">Your wishlist is empty</p>
        {!compact && (
          <button 
            onClick={() => navigate('/jewellery')}
            className="mt-3 bg-black text-white px-4 py-2 text-sm rounded hover:bg-gray-800"
          >
            Start Shopping
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className={`grid grid-cols-2 ${compact ? 'gap-3' : 'lg:grid-cols-4 gap-4'}`}>
        {displayProducts.map((item) => (
          <div key={item.productId} className="group border rounded-lg overflow-hidden hover:shadow-sm transition">
            <div 
              className="relative cursor-pointer" 
              onClick={() => navigate(`/products/${item.productId}`)}
            >
              <div className={`${compact ? 'aspect-[4/3]' : 'aspect-square'} bg-gray-50 overflow-hidden`}>
                <img 
                  src={item.product?.heroImage?.url} 
                  alt={item.product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    e.target.src = '/vite.svg';
                  }}
                />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveItem(item.productId);
                }}
                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full shadow flex items-center justify-center hover:bg-red-50"
                title="Remove"
              >
                <CiHeart className="w-4 h-4 text-red-500 fill-current" />
              </button>
            </div>
            
            <div className={`${compact ? 'p-2' : 'p-3'} space-y-1`}>
              <h3 className={`font-medium text-gray-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-1`}>
                {item.product?.name}
              </h3>
              <p className={`text-gray-500 uppercase tracking-wide ${compact ? 'text-xs' : 'text-sm'}`}>
                {item.product?.type}
              </p>
              <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                ₹{item.product?.price.toLocaleString()}
              </p>
              
              {!compact && (
                <div className="flex gap-1 pt-1">
                  <button 
                    onClick={() => handleMoveToCart(item.productId)}
                    className="flex-1 bg-black text-white py-1.5 px-2 text-xs rounded hover:bg-gray-800"
                  >
                    Add to Cart
                  </button>
                  <button 
                    onClick={() => handleRemoveItem(item.productId)}
                    className="px-2 py-1.5 border text-xs rounded hover:bg-gray-50"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {compact && maxItems && products.length > maxItems && (
        <div className="text-center mt-4">
          <button 
            onClick={() => navigate("/wishlist")} 
            className="text-sm text-black hover:underline"
          >
            View all {products.length} items →
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistContent;