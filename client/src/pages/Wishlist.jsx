import { useState } from 'react';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

const dummyProducts = [
  {
    productId: '1',
    product: {
      name: 'Diamond Eternity Ring',
      heroImage: {
        url: '/images/jewelry1.jpg'
      },
      price: 89999,
      type: 'Ring'
    }
  },
  {
    productId: '2',
    product: {
      name: 'Sapphire Drop Earrings',
      heroImage: {
        url: '/images/jewelry2.jpg'
      },
      price: 45999,
      type: 'Earrings'
    }
  },]
const Wishlist = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState(dummyProducts);

   const handleRemove = (productId) => {
    setProducts(prev => prev.filter(item => item.productId !== productId));
  };

  const handleMoveToCart = (productId) => {
    // Here you would typically:
    // 1. Add to cart
    // 2. Remove from wishlist
    handleRemove(productId);
    navigate('/cart');
  };

  return (
  <div className="bg-white min-h-[60vh] py-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">My Wishlist</h1>

        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <CiHeart size={60} className="text-gray-300" />
            <p className="text-gray-500">Your wishlist is empty</p>
            <button 
              onClick={() => navigate('/jewelry')}
              className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <div key={item.productId} className=" p-4 space-y-3 ">
                <div className="relative group cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                  <img 
                    src={item.product?.heroImage?.url} 
                    alt={item.product?.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">{item.product?.name}</h3>
                  <p className="text-gray-600">{item.product?.type}</p>
                  <p className="font-semibold">₹{item.product?.price.toLocaleString()}</p>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => handleMoveToCart(item.productId)}
                    className="bg-black text-white px-4 py-2 text-sm hover:bg-gray-800 transition"
                  >
                    Move to Cart
                  </button>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;