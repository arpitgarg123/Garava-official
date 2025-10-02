import React, { useState } from 'react';
import Products from './../components/DashboardSections/Products';
import Orders from './../components/DashboardSections/Orders';
import { 
  FaUser, 
  FaBoxOpen, 
  FaStar, 
  FaBlog, 
  FaEnvelope, 
  FaBars,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaQuestionCircle
} from "react-icons/fa";
import { MdDashboard, MdEventAvailable } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import f1 from "../assets/images/f-front.png";
import f2 from "../assets/images/fragnance.png";
import f3 from "../assets/images/fragnance1.png";
import f4 from "../assets/images/essential-f.png";
import Appointment from '../components/DashboardSections/Appointment';
import Reviews from './../components/DashboardSections/Reviews';
import Newsletter from '../components/DashboardSections/Newsletter';
import Blogs from '../components/DashboardSections/BlogsAdmin';
import FAQAdmin from '../components/DashboardSections/FAQAdmin';
import Overview from '../components/DashboardSections/Overview';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "products", label: "Products", icon: FaBoxOpen },
    { id: "orders", label: "Orders", icon: FaBoxOpen },
    { id: "bookings", label: "Bookings", icon: MdEventAvailable },
    { id: "reviews", label: "Reviews", icon: FaStar },
    { id: "blogs", label: "Blogs", icon: FaBlog },
    { id: "faq", label: "FAQ", icon: FaQuestionCircle },
    { id: "newsletter", label: "Newsletter", icon: FaEnvelope },
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
          unitPrice: 75000
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
          unitPrice: 45000
        },
        {
          productSnapshot: {
            name: 'Emerald Earrings',
            heroImage: {
              url: '/images/jewelry3.jpg'
            }
          },
          quantity: 2,
          unitPrice: 35000
        }
      ],
      grandTotal: 115000
    },
  ];

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
    { _id:"1", email:"a@x.com", status:"subscribed", createdAt:"2025-09-01T09:00:00Z" },
    { _id:"2", email:"b@x.com", status:"unsubscribed", createdAt:"2025-09-05T12:00:00Z" }
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
        );
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "bookings":
        return <Appointment />;
      case "reviews":
        return (
          <Reviews   
            reviews={dummyReviews}
            pagination={{ page: 1, limit: 20, total: 2, totalPages: 1 }}
            onAction={(action, review) => console.log("Action:", action, review)}
            onPageChange={(newPage) => console.log("Go to page:", newPage)}
            onFilterChange={(filters) => console.log("Apply filters:", filters)}
            onClearFilters={() => console.log("Filters cleared")} 
          />
        );
      case "blogs":
        return <Blogs />;
      case "faq":
        return <FAQAdmin />;
      case "newsletter":
        return (
          <Newsletter  
            subscribers={items}
            pagination={{ page:1, limit:20, total:2, totalPages:1 }}
            onFilterChange={(f) => console.log("filters", f)}
            onPageChange={(p) => console.log("page", p)} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <FaBars className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <MdDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Garava Admin</h1>
              </div>
            </div>
          </div>

          {/* Center: Current Page */}
          <div className="hidden md:block">
            <h2 className="text-sm font-medium uppercase tracking-wider font-montserrat
             text-gray-600">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
          

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-md">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <FaUser className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>

            <Link 
              to="/" 
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              title="Back to Site"
            >
              <IoIosArrowBack className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Clean Sidebar */}
      <aside className={`fixed top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full overflow-y-auto">
          <nav className="p-4 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="text-center">
              <p className="text-xs text-gray-500">Garava Admin v2.0</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Clean Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="h-[calc(100vh-4rem)]">
          {/* Content Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}
                </p>
              </div>
              
              {/* <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-md">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs font-medium text-green-700">Live</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                  Export
                </button>
              </div> */}
            </div>
          </div>

          {/* Content Area */}
          <div className="h-[calc(100%-5rem)] bg-gray-50">
            <div className="h-full p-6">
              <div className="h-full bg-white rounded-lg border border-gray-200 overflow-hidden">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;