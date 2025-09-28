import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { IoBagHandleOutline } from 'react-icons/io5';
import { format } from 'date-fns';
import { 
  selectOrders, 
  selectIsOrdersLoading, 
  selectOrdersError,
  selectOrderDetails,
  selectIsOrderDetailsLoading,
  selectOrderDetailsError
} from '../features/order/selectors';
import { fetchUserOrders, fetchOrderById } from '../features/order/slice';
import { toast } from 'react-hot-toast';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { orderId } = useParams();
  
  // Redux state
  const orders = useSelector(selectOrders);
  const isLoading = useSelector(selectIsOrdersLoading);
  const error = useSelector(selectOrdersError);
  const orderDetails = useSelector(selectOrderDetails);
  const isDetailsLoading = useSelector(selectIsOrderDetailsLoading);
  const detailsError = useSelector(selectOrderDetailsError);

  // Fetch orders on component mount
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Fetch specific order if orderId is provided
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  // Show error if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (detailsError) {
      toast.error(detailsError);
    }
  }, [error, detailsError]);

  const formatCurrency = (paise) => {
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
  };

  // If viewing single order
  if (orderId) {
    if (isDetailsLoading) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
                <div className="space-y-4">
                  <div className="h-20 bg-gray-200 rounded"></div>
                  <div className="h-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (!orderDetails) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <p className="text-gray-500">Order not found</p>
              <button 
                onClick={() => navigate('/orders')}
                className="mt-4 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Single order view
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="border-b px-6 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold">Order #{orderDetails.orderNumber}</h1>
                  <p className="text-gray-500 mt-1">
                    Placed on {format(new Date(orderDetails.createdAt), 'PPP')}
                  </p>
                </div>
                <div className="text-right">
                  <OrderStatus status={orderDetails.status} />
                  <p className="text-lg font-semibold mt-2">
                    {formatCurrency(orderDetails.grandTotalPaise || orderDetails.grandTotal)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-6 py-4">
              <h3 className="font-semibold mb-4">Items Ordered</h3>
              <div className="space-y-4">
                {orderDetails.items?.map((item, index) => (
                  <div key={index} className="flex space-x-4 border-b pb-4 last:border-b-0">
                    <img
                      src={item.productSnapshot?.heroImage?.url || '/placeholder.jpg'}
                      alt={item.productSnapshot?.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productSnapshot?.name}</h4>
                      <p className="text-gray-500 text-sm">
                        SKU: {item.variantSnapshot?.sku}
                      </p>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.lineTotalPaise || item.lineTotal)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatCurrency(item.unitPricePaise || item.unitPrice)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="px-6 py-4 border-t">
              <h3 className="font-semibold mb-2">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{orderDetails.shippingAddress?.name}</p>
                <p>{orderDetails.shippingAddress?.addressLine1}</p>
                {orderDetails.shippingAddress?.addressLine2 && (
                  <p>{orderDetails.shippingAddress.addressLine2}</p>
                )}
                <p>
                  {orderDetails.shippingAddress?.city}, {orderDetails.shippingAddress?.state} {orderDetails.shippingAddress?.postalCode}
                </p>
                <p>{orderDetails.shippingAddress?.phone}</p>
              </div>
            </div>

            {/* Payment Information */}
            <div className="px-6 py-4 border-t">
              <h3 className="font-semibold mb-2">Payment Information</h3>
              <div className="flex justify-between">
                <div>
                  <p className="text-gray-600">
                    Method: {orderDetails.payment?.method === 'phonepe' ? 'PhonePe Payment Gateway' : 'Cash on Delivery'}
                  </p>
                  <p className="text-gray-600">
                    Status: <span className={`font-medium ${
                      orderDetails.payment?.status === 'paid' ? 'text-green-600' : 
                      orderDetails.payment?.status === 'failed' ? 'text-red-600' : 
                      'text-yellow-600'
                    }`}>
                      {orderDetails.payment?.status?.charAt(0).toUpperCase() + orderDetails.payment?.status?.slice(1)}
                    </span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Total: {formatCurrency(orderDetails.grandTotalPaise || orderDetails.grandTotal)}</p>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="px-6 py-4 border-t">
              <button
                onClick={() => navigate('/orders')}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state for orders list
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Orders</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Orders list view
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

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <IoBagHandleOutline size={60} className="text-gray-300" />
            <p className="text-gray-500">No orders yet</p>
            <button 
              onClick={() => navigate('/products/jewellery')}
              className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-white border rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow duration-300 cursor-pointer"
                onClick={() => navigate(`/orders/${order._id}`)}
              >
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
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="flex space-x-4 hover:bg-gray-50 p-2 rounded">
                      <img 
                        src={item.productSnapshot?.heroImage?.url || '/placeholder.jpg'} 
                        alt={item.productSnapshot?.name}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium">{item.productSnapshot?.name}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        <p className="text-sm">{formatCurrency(item.unitPricePaise || item.unitPrice)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <p className="text-sm text-gray-500 pl-24">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">
                      <span>Total: {formatCurrency(order.grandTotalPaise || order.grandTotal)}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order._id}`);
                      }}
                      className="text-black border border-black px-4 py-2 rounded hover:bg-black hover:text-white transition-colors"
                    >
                      View Details
                    </button>
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