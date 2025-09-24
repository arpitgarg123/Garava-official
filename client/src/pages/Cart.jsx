// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { IoBagHandleOutline } from 'react-icons/io5';
// import { RiDeleteBin6Line } from 'react-icons/ri';

// const Cart = ({ items = [], onUpdateQuantity, onRemoveItem }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="bg-white min-h-[60vh]">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

//         {items.length === 0 ? (
//           <div className="flex flex-col items-center justify-center space-y-4">
//             <IoBagHandleOutline size={60} className="text-gray-300" />
//             <p className="text-gray-500">Your cart is empty</p>
//             <button 
//               onClick={() => navigate('/jewellery')}
//               className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               {items.map((item) => (
//                 <div key={item._id} className="flex border-b py-4 space-x-4">
//                   <img 
//                     src={item.heroImage} 
//                     alt={item.name}
//                     className="w-24 h-24 object-cover"
//                   />
//                   <div className="flex-1 space-y-2">
//                     <h3 className="font-medium">{item.name}</h3>
//                     <p className="text-sm text-gray-500">{item.variantSku}</p>
//                     <div className="flex items-center space-x-4">
//                       <select 
//                         value={item.quantity}
//                         onChange={(e) => onUpdateQuantity(item._id, Number(e.target.value))}
//                         className="border p-1"
//                       >
//                         {[1,2,3,4,5].map(num => (
//                           <option key={num} value={num}>{num}</option>
//                         ))}
//                       </select>
//                       <button
//                         onClick={() => onRemoveItem(item._id)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         <RiDeleteBin6Line size={20} />
//                       </button>
//                     </div>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-semibold">₹{item.unitPrice}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="lg:col-span-1">
//               <div className="border p-6 space-y-4">
//                 <h3 className="text-lg font-semibold">Order Summary</h3>
//                 <div className="space-y-2">
//                   <div className="flex justify-between">
//                     <span>Subtotal</span>
//                     <span>₹{items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span>Shipping</span>
//                     <span>Free</span>
//                   </div>
//                   <div className="border-t pt-2 font-semibold flex justify-between">
//                     <span>Total</span>
//                     <span>₹{items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0)}</span>
//                   </div>
//                 </div>
//                 <button 
//                   onClick={() => navigate('/checkout')}
//                   className="w-full bg-black text-white py-3 hover:bg-gray-800 transition"
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Cart;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoBagHandleOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';

// Dummy cart items
const dummyItems = [
  {
    _id: '1',
    name: 'Diamond Solitaire Ring',
    heroImage: '/images/jewelry1.jpg',
    variantSku: 'RING-001',
    quantity: 1,
    unitPrice: 75000,
    color: 'Rose Gold'
  },
  {
    _id: '2',
    name: 'Sapphire Pendant',
    heroImage: '/images/jewelry2.jpg',
    variantSku: 'PEN-002',
    quantity: 1,
    unitPrice: 45000,
    color: 'White Gold'
  },
  {
    _id: '3',
    name: 'Pearl Necklace',
    heroImage: '/images/jewelry3.jpg',
    variantSku: 'NECK-003',
    quantity: 2,
    unitPrice: 35000,
    color: 'Silver'
  }
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState(dummyItems);

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(items => 
      items.map(item => 
        item._id === itemId ? {...item, quantity: newQuantity} : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(items => items.filter(item => item._id !== itemId));
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
  };

  return (
    <div className="bg-white min-h-[60vh] p-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <IoBagHandleOutline size={60} className="text-gray-300" />
            <p className="text-gray-500">Your cart is empty</p>
            <button 
              onClick={() => navigate('/jewellery')}
              className="bg-black text-white px-8 py-2 hover:bg-gray-800 transition"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item._id} className="flex border-b py-4 space-x-4">
                  <img 
                    src={item.heroImage} 
                    alt={item.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.variantSku}</p>
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                    <div className="flex items-center space-x-4">
                      <select 
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item._id, Number(e.target.value))}
                        className="border p-1"
                      >
                        {[1,2,3,4,5].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <RiDeleteBin6Line size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.unitPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="border p-6 space-y-4 sticky top-24">
                <h3 className="text-lg font-semibold">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-2 font-semibold flex justify-between">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black text-white py-3 hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;