import { IoBagHandleOutline } from 'react-icons/io5';
import { format } from 'date-fns';

const OrderStatus = ({ status }) => {

  const getColor = () => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getColor()}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Orders = () => {
    const dummyOrders = [
  {
    _id: '1',
    orderNumber: 'GRV2023001',
    createdAt: '2023-09-15T10:30:00Z',
    status: 'delivered',
    items: [
      {
        productSnapshot: {
          name: 'Diamond Solitaire Ring',
          heroImage: {
            url: '/images/jewelry1.jpg'
          }
        },
        quantity: 1,
        unitPricePaise: 7500000 // 75,000 INR
      }
    ],
    grandTotalPaise: 7500000
  },
  {
    _id: '2',
    orderNumber: 'GRV2023002',
    createdAt: '2023-09-10T15:45:00Z',
    status: 'processing',
    items: [
      {
        productSnapshot: {
          name: 'Pearl Necklace Set',
          heroImage: {
            url: '/images/jewelry2.jpg'
          }
        },
        quantity: 1,
        unitPricePaise: 4500000 // 45,000 INR
      },
      {
        productSnapshot: {
          name: 'Emerald Earrings',
          heroImage: {
            url: '/images/jewelry3.jpg'
          }
        },
        quantity: 2,
        unitPricePaise: 3500000 // 35,000 INR
      }
    ],
    grandTotalPaise: 11500000
  },
]
  return (
   <div className="bg-white min-h-[60vh] py-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-8">My Orders</h1>

        {dummyOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <IoBagHandleOutline size={60} className="text-gray-300" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {dummyOrders.map((order) => (
              <div key={order._id} className=" p-6 space-y-4  transition-shadow duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">
                      Placed on {format(new Date(order.createdAt), 'PP')}
                    </p>
                  </div>
                  <OrderStatus status={order.status} />
                </div>

                <div className="space-y-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex space-x-4 hover:bg-gray-50 p-2 rounded">
                      <img 
                        src={item.productSnapshot?.heroImage?.url} 
                        alt={item.productSnapshot?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.productSnapshot?.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm">₹{(item.unitPricePaise / 100).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>₹{(order.grandTotalPaise / 100).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default Orders;