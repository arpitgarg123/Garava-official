// import React, { useEffect, useState } from "react";

// import { MdTrendingUp } from "react-icons/md";
// import { BiPackage } from "react-icons/bi";
// import { BsCart3 } from "react-icons/bs";
// import { AiOutlineStar } from "react-icons/ai";
// import TabsNav from "../components/admin/TabsNav";
// import Overview from "../components/DashboardSections/Overview";
// import Products from "../components/DashboardSections/Products";
// import Orders from "../components/DashboardSections/Orders";
// import Reviews from "../components/DashboardSections/Reviews";

// /**
//  * This page wires everything:
//  * - Replace mock endpoints with your real ones.
//  * - The example uses useFetch for initial loads and sets state into local arrays.
//  */

// export default function DashboardPage() {
//   const [activeTab, setActiveTab] = useState("overview");
//   const [products, setProducts] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [reviews, setReviews] = useState([]);
// //   const { data: pData, loading: pLoading, refetch: refetchProducts } = useFetch(() => api.get("/products"), []);
// //   const { data: oData, loading: oLoading, refetch: refetchOrders } = useFetch(() => api.get("/orders"), []);
// //   const { data: rData, loading: rLoading, refetch: refetchReviews } = useFetch(() => api.get("/reviews"), []);

// //   useEffect(() => {
// //     // If backend not ready yet, fallback to local mock data
// //     if (pData?.data) setProducts(pData.data);
// //     if (oData?.data) setOrders(oData.data);
// //     if (rData?.data) setReviews(rData.data);

// //     // fallback: if your API returns directly the array (res.data vs res)
// //     if (Array.isArray(pData)) setProducts(pData);
// //     if (Array.isArray(oData)) setOrders(oData);
// //     if (Array.isArray(rData)) setReviews(rData);
// //   }, [pData, oData, rData]);

//   // handlers call APIs then update local state
// //   const handleStatusChange = async (orderId, newStatus) => {
// //     try {
// //       await api.patch(`/orders/${orderId}`, { status: newStatus });
// //       setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
// //     } catch (err) {
// //       console.error(err);
// //       // show toast
// //     }
// //   };

// //   const handleProductDelete = async (productId) => {
// //     if (!window.confirm("Archive this product?")) return;
// //     try {
// //       await api.delete(`/products/${productId}`);
// //       setProducts((prev) => prev.map((p) => (p._id === productId ? { ...p, status: "archived" } : p)));
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const handleReviewApproval = async (reviewId, approve) => {
// //     try {
// //       await api.patch(`/reviews/${reviewId}`, { isApproved: approve });
// //       setReviews((prev) => prev.map((r) => (r._id === reviewId ? { ...r, isApproved: approve } : r)));
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

//   const tabs = [
//     { id: "overview", label: "Overview", icon: MdTrendingUp, component: <Overview products={products} orders={orders} reviews={reviews} /> },
//     { id: "products", label: "Products", icon: BiPackage, component: <Products products={products} 
//     // onDelete={handleProductDelete} 
//     /> 
// },
//     { id: "orders", label: "Orders", icon: BsCart3, component: <Orders orders={orders}
//     //  onStatusChange={handleStatusChange}
//       /> },
//     { id: "reviews", label: "Reviews", icon: AiOutlineStar, component: <Reviews reviews={reviews}
//     //  onApprove={(id) => handleReviewApproval(id, true)} onReject={(id) => handleReviewApproval(id, false)}
//       />
//      },
//   ];

//   const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component ?? null;

// //   const loading = pLoading || oLoading || rLoading;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
//               <p className="text-gray-600">Manage your e-commerce store</p>
//             </div>
//             <div className="flex items-center gap-4">
//               <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
//                 {new Date().toLocaleDateString()}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <TabsNav tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
//         {/* <main>{loading ? <div>Loading...</div> : ActiveComponent}</main> */}
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react'
import Products from './../components/DashboardSections/Products'
import Orders from './../components/DashboardSections/Orders'
import { FaUser, FaBoxOpen, FaBookOpen, FaStar, FaBlog, FaEnvelope } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { MdEventAvailable } from "react-icons/md"; 
import { IoIosArrowBack } from "react-icons/io";


import f1 from "../assets/images/f-front.png";
import f2 from "../assets/images/fragnance.png";
import f3 from "../assets/images/fragnance1.png";
import f4 from "../assets/images/essential-f.png";
import Appointment from '../components/DashboardSections/Appointment';
import Reviews from './../components/DashboardSections/Reviews';
import Newsletter from '../components/DashboardSections/Newsletter';
import Blogs from '../components/DashboardSections/Blogs';
import Overview from '../components/DashboardSections/Overview';
import { Link, useNavigate } from 'react-router-dom';


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("overview");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate()

  const tabs = [
   { id: "overview", label: "Overview", icon: <MdDashboard /> },
  { id: "products", label: "Products", icon: <FaBoxOpen /> },
  { id: "orders", label: "Orders", icon: <FaBoxOpen /> },
  { id: "bookings", label: "Bookings", icon: <MdEventAvailable /> },
  { id: "reviews", label: "Reviews", icon: <FaStar /> },
  { id: "blogs", label: "Blogs", icon: <FaBlog /> },
  { id: "newsletter", label: "Newsletter", icon: <FaEnvelope /> },
  ];
   const products = [
        { id: 1, img: f1, title: "Fragnance 1", price: "₹79,153.0" },
        { id: 2, img: f2, title: "Classic fragnance", price: "₹129,999.0" },
        { id: 3, img: f3, title: "Statement fragnance", price: "₹54,200.0" },
        { id: 4, img: f4, title: "Everyday fragnance", price: "₹24,500.0" },
      ];

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
        unitPrice: 75000 // 75,000 INR in rupees
      }
    ],
    grandTotal: 75000
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
        unitPrice: 45000 // 45,000 INR in rupees
      },
      {
        productSnapshot: {
          name: 'Emerald Earrings',
          heroImage: {
            url: '/images/jewelry3.jpg'
          }
        },
        quantity: 2,
        unitPrice: 35000 // 35,000 INR in rupees
      }
    ],
    grandTotal: 115000
  },
]

 const sampleAppointments = [
    {
      _id: "1",
      customerName: "Rahul Kumar",
      customerEmail: "rahul@example.com",
      serviceType: "consultation",
      status: "pending",
      appointmentAt: "2025-09-26T10:00:00.000Z",
      adminNotes: "First consultation"
    },
    {
      _id: "2",
      customerName: "Sneha Verma",
      customerEmail: "sneha@example.com",
      serviceType: "repair",
      status: "confirmed",
      appointmentAt: "2025-09-27T15:30:00.000Z",
      adminNotes: "Bring spare parts"
    }
    
  ];

  const dummyReviews = [
    {
      _id: "r1",
      user: { name: "Rahul", email: "rahul@example.com" },
      product: "prod-101",
      rating: 5,
      comment: "Excellent quality!",
      isApproved: true,
      flagged: false,
      createdAt: "2025-09-25T10:00:00.000Z"
    },
    {
      _id: "r2",
      user: { name: "Sneha", email: "sneha@example.com" },
      product: "prod-102",
      rating: 3,
      comment: "Good, but delivery was late.",
      isApproved: false,
      flagged: true,
      createdAt: "2025-09-24T15:30:00.000Z"
    }
  ];

  const items = [
    { _id:"1", email:"a@x.com", status:"subscribed",  createdAt:"2025-09-01T09:00:00Z" },
    { _id:"2", email:"b@x.com",  status:"unsubscribed",  createdAt:"2025-09-05T12:00:00Z" }
  ];

   const posts = [
    {
      _id:"1",
      title:"Autumn Scents: A Guide",
      description:"Warm, woody, and spicy picks for the.",
      coverImageUrl:"https://picsum.photos/seed/wood/800/450",
      status:"published",
      createdAt:"2025-09-10T09:00:00Z",
      author:{ name:"Editorial" }
    },
    {
      _id:"2",
      title:"Behind the Notes",
      description:"Understanding top, middle, base notes.",
      coverImageUrl:"",
      status:"draft",
      createdAt:"2025-09-22T14:30:00Z",
      author:"Team"
    }
  ];
  


   const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="bg-white w-full h-full  rounded-lg shadow-sm border p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-6">Overview</h2>
   <Overview
    stats={{ revenueINR: 250000, orders: dummyOrders.length, products: products.length, avgRating: 4.4 }}
    revenueTrend={[12000, 18000, 26000, 31000, 29000, 34000, 36000]}
    topProducts={[
      { _id: 'p1', name: 'Fragrance 1', image: f1, salesINR: 79153, units: 42 },
      { _id: 'p2', name: 'Classic Fragrance', image: f2, salesINR: 129999, units: 23 },
    ]}
    recentOrders={dummyOrders.map(o => ({ ...o, totalINR: o.grandTotal }))}
    recentReviews={dummyReviews.map(r => ({ _id: r._id, userName: r.user.name, rating: r.rating, comment: r.comment, createdAt: r.createdAt }))}
    upcomingAppointments={sampleAppointments}
    />
          </div>
        );
          case "products":
        return (
          <div className="bg-white w-full h-full rounded-lg shadow-sm border">
            <Products />
          </div>
        );

      case "orders":
        return (
          <div className="bg-white w-full h-full rounded-lg shadow-sm border">
            <Orders />
          </div>
        );

      case "bookings":
        return (
          <div className="bg-white w-full h-full rounded-lg shadow-sm border">
            <Appointment />
          </div>
        );

      case "reviews":
        return (
          <div className="bg-white w-full h-full rounded-lg shadow-sm border p-4 sm:p-6">
                   <h2 className="text-xl font-semibold mb-6">All reviews</h2>
    
           <Reviews   reviews={dummyReviews}
        pagination={{ page: 1, limit: 20, total: 2, totalPages: 1 }}
        onAction={(action, review) => console.log("Action:", action, review)}
        onPageChange={(newPage) => console.log("Go to page:", newPage)}
        onFilterChange={(filters) => console.log("Apply filters:", filters)}
        onClearFilters={() => console.log("Filters cleared")} />
          </div>
        );
         case "blogs":
        return (
          <div className="bg-white w-full h-full rounded-lg shadow-sm border p-4 sm:p-6">
                   <h2 className="text-xl font-semibold mb-6">All Blogs</h2>
        <Blogs posts={posts}/>
          </div>
        );
 case "newsletter":
        return (
          <div className="bg-white w-full h-full rounded-lg shadow-sm border p-4 sm:p-6">
                   <h2 className="text-xl font-semibold mb-6">All Newsletters</h2>
         <Newsletter  subscribers={items}
        pagination={{ page:1, limit:20, total:2, totalPages:1 }}
       
        onFilterChange={(f) => console.log("filters", f)}
        onPageChange={(p) => console.log("page", p)} />
          </div>
        );
    

      default:
        return null;
    }
  };

  return (
  <>
  <Link to='/'>
  <div  className='h-12 w-12 flex items-center justify-center ml-8 rounded-xl bg-gray-100 cursor-pointer mt-20 '>
    <IoIosArrowBack size={24} />

  </div>
  </Link>
    <div className="max-w-7xl mx-auto p-4 sm:p-6 ">
     
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full bg-white border rounded-lg p-4 flex items-center justify-between"
          >
            <span className="font-medium">
              {tabs.find(t => t.id === activeTab)?.icon} {tabs.find(t => t.id === activeTab)?.label}
            </span>
            <span className="text-lg">{sidebarOpen ? "−" : "+"}</span>
          </button>
        </div>

        {/* Sidebar - Hidden on mobile unless sidebarOpen */}
        <div className={`w-full h-screen lg:w-64 lg:flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="h-full rounded-lg shadow-sm border p-4 sm:p-6">
            {/* User Info */}
            <div className="text-center mb-6 pb-6 border-b">
           
              <h3 className="font-semibold text-gray-900 text-xl max-sm:text-base">DASHBOARD</h3>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false); // Close mobile menu after selection
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base sm:text-lg">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

           
          </div>
        </div>

        {/* Main Content */}
        <div className="flex items-start justify-start w-full h-screen">
          {renderContent()}
        </div>
      </div>
    </div>
  </>
  )
}

export default Dashboard