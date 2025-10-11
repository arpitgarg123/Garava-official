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
import BackButton from '../components/BackButton';
import PageHeader from '../components/header/PageHeader';

const OrderStatus = ({ status }) => {

  const getColor = () => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'partially_shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending_payment': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-orange-100 text-orange-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-50 text-gray-800';
    }
  };

  const getDisplayText = () => {
    switch (status) {
      case 'pending_payment': return 'Pending Payment';
      case 'paid': return 'Payment Completed';
      case 'processing': return 'Processing';
      case 'partially_shipped': return 'Partially Shipped';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'refunded': return 'Refunded';
      case 'failed': return 'Failed';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${getColor()}`}>
      {getDisplayText()}
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

  const formatCurrency = (rupees) => {
    return `₹${Number(rupees).toLocaleString('en-IN')}`;
  };

  // If viewing single order
  if (orderId) {
    if (isDetailsLoading) {
      return (
        <div className="min-h-screen bg-gray-50 py-8 mt-30">
          <div className="max-w-4xl mx-auto px-4">
            <div className=" p-8">
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
            <div className=" p-8 text-center">
              <p className="text-gray-500">Order not found</p>
              <button 
                onClick={() => navigate('/orders')}
                className="mt-4 btn-black"
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
      <>

      <div className="min-h-screen py-8 mt-30">
         <div className="sticky top-16 z-10 ">
                <BackButton />
              </div>
              {/* <PageHeader title={heading} /> */}
        <div className="max-w-5xl mx-auto px-4">
          <div className="  overflow-hidden">
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
                    {formatCurrency(orderDetails.grandTotal)}
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
                      className="w-16 h-16 object-cover "
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{item.productSnapshot?.name}</h4>
                      <p className="text-gray-500 text-sm my-1">
                        SKU: {item.variantSnapshot?.sku}
                      </p>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatCurrency(item.lineTotal)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatCurrency(item.unitPrice)} each
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
                  <p className="text-gray-600 text-sm">
                    Method: {orderDetails.payment?.method === 'phonepe' ? 'PhonePe Payment Gateway' : 'Cash on Delivery'}
                  </p>
                  <p className="text-gray-600 text-sm">
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
                  <p className="text-gray-600">Total: {formatCurrency(orderDetails.grandTotal)}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t">
              <button
                onClick={() => navigate('/orders')}
                className="btn-black"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // Loading state for orders list
  if (isLoading) {
    return (
      <div className="min-h-screen  py-8 mt-30">
        <div className="max-w-6xl mx-auto px-4">
       <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className=" p-6 animate-pulse">
                <div className="h-6 bg-gray-200  w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200  w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
   <div className=" min-h-[60vh] mt-30">
     <div className="sticky top-20 z-10 ">
        <BackButton />
      </div>

      <div className="max-w-7xl mx-auto px-4 ">
<PageHeader title="My Orders" />
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-4 mt-20">
            <IoBagHandleOutline size={60} className="text-gray-300" />
            <p className="text-gray-500">No orders yet</p>
            <button 
              onClick={() => navigate('/products/jewellery')}
              className="btn"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order._id} 
                className="bg-gray-50 p-8   space-y-4  transition-shadow duration-300 cursor-pointer"
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
                    <div key={idx} className="flex space-x-4 hover:bg-gray-50 p-2 ">
                      <img 
                        src={item.productSnapshot?.heroImage?.url || '/placeholder.jpg'} 
                        alt={item.productSnapshot?.name}
                        className="w-20 h-20 object-cover "
                      />
                      <div>
                        <h3 className="font-medium">{item.productSnapshot?.name}</h3>
                        <p className="text-sm text-gray-500 my-2">Qty: {item.quantity}</p>
                        <p className="text-sm">{formatCurrency(item.unitPrice)}</p>
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
                  <div className="flex justify-between items-center h-16 ">
                    <div className="text-lg font-semibold">
                      <span>Total: {formatCurrency(order.grandTotal)}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/orders/${order._id}`);
                      }}
                      className="btn-black"
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