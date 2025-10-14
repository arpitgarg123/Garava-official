import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  FaQuestionCircle,
  FaNewspaper,
  FaComments,
  FaInstagram
} from "react-icons/fa";
import { MdDashboard, MdEventAvailable } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";

import Appointment from '../components/DashboardSections/Appointment';
import Reviews from './../components/DashboardSections/Reviews';
import Newsletter from '../components/DashboardSections/Newsletter';
import Blogs from '../components/DashboardSections/BlogsAdmin';
import FAQAdmin from '../components/DashboardSections/FAQAdmin';
import TestimonialAdmin from '../components/DashboardSections/TestimonialAdmin';
import Overview from '../components/DashboardSections/Overview';
import NotificationsDashboard from '../components/DashboardSections/NotificationsDashboard';
import NotificationDebug from '../components/DashboardSections/NotificationDebug';
import NewsEventsAdmin from '../components/DashboardSections/NewsEventsAdmin';
import InstagramAdmin from '../components/DashboardSections/InstagramAdmin';
import { Link, useNavigate } from 'react-router-dom';

// Redux imports for real data
import { fetchOrdersAdmin } from '../features/order/adminSlice';
import { fetchProductsAdmin } from '../features/product/adminSlice';
import { fetchReviewsAdmin } from '../features/reviews/reviewAdminSlice';
import { fetchAppointmentsAdmin } from '../features/appointment/adminSlice';
import { fetchBlogsAdmin } from '../features/blogs/blogAdminSlice';
import { fetchTestimonials } from '../features/testimonial/slice';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state selectors
  const orders = useSelector(state => state.orderAdmin?.orders || []);
  const products = useSelector(state => state.productAdmin?.products || []);
  const reviews = useSelector(state => state.reviewAdmin?.reviews || []);
  const appointments = useSelector(state => state.appointmentAdmin?.appointments || []);
  const blogs = useSelector(state => state.blogAdmin?.blogs || []);
  const testimonials = useSelector(state => state.testimonials?.testimonials || []);

  // Loading states
  const ordersLoading = useSelector(state => state.orderAdmin?.loading || false);
  const productsLoading = useSelector(state => state.productAdmin?.loading || false);
  const reviewsLoading = useSelector(state => state.reviewAdmin?.loading || false);

  // Fetch real data on component mount
  useEffect(() => {
    dispatch(fetchOrdersAdmin({ limit: 10, sort: '-createdAt' }));
    dispatch(fetchProductsAdmin({ limit: 10 }));
    dispatch(fetchReviewsAdmin({ limit: 10, sort: '-createdAt' }));
    dispatch(fetchAppointmentsAdmin({ limit: 10, sort: 'appointmentAt' }));
    dispatch(fetchBlogsAdmin({ limit: 5, sort: '-createdAt' }));
    dispatch(fetchTestimonials({ limit: 5, sort: '-createdAt' }));
  }, [dispatch]);

  // Calculate real statistics  
  // Note: Backend already converts paise to rupees for admin APIs
  // But if conversion isn't working, apply safety check
  const totalRevenue = orders.reduce((sum, order) => {
    const grandTotal = order.grandTotal || 0;
    // If grandTotal is suspiciously high (> 100,000), it might be in paise, so convert
    const displayTotal = grandTotal > 100000 ? Math.round(grandTotal / 100) : grandTotal;
    return sum + displayTotal;
  }, 0);
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length 
    : 0;

  // Prepare data for Overview component
  const overviewStats = {
    revenueINR: totalRevenue,
    orders: orders.length,
    products: products.length,
    avgRating: parseFloat(avgRating.toFixed(1))
  };

  // Get recent data
  // Note: order.grandTotal is already in rupees from admin API
  const recentOrders = orders.slice(0, 5).map(order => {
    // Debug: Check if prices need conversion (if they're way too high, they might be in paise)
    const grandTotal = order.grandTotal || 0;
    
    // If grandTotal is suspiciously high (> 100,000), it might be in paise, so convert
    const displayTotal = grandTotal > 100000 ? Math.round(grandTotal / 100) : grandTotal;
    
    return {
      ...order,
      totalINR: displayTotal
    };
  });

  const recentReviews = reviews.slice(0, 5).map(review => ({
    _id: review._id,
    userName: review.userName || review.customerName || 'Anonymous',
    rating: review.rating || 0,
    comment: review.comment || review.content || '',
    createdAt: review.createdAt
  }));

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentAt) >= new Date())
    .slice(0, 5);

  // Top products by sales or popularity
  const topProducts = products.slice(0, 5).map(product => ({
    _id: product._id,
    name: product.name || product.title,
    image: product.heroImage?.url || product.images?.[0]?.url ,
    salesINR: product.price || 0,
    units: product.stockQuantity || 0
  }));

  const tabs = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "products", label: "Products", icon: FaBoxOpen },
    { id: "orders", label: "Orders", icon: FaBoxOpen },
    { id: "bookings", label: "Bookings", icon: MdEventAvailable },
    { id: "reviews", label: "Reviews", icon: FaStar },
    { id: "testimonials", label: "Testimonials", icon: FaComments },
    { id: "blogs", label: "Blogs", icon: FaBlog },
    { id: "newsevents", label: "News & Events", icon: FaNewspaper },
    { id: "instagram", label: "Instagram", icon: FaInstagram },
    { id: "faq", label: "FAQ", icon: FaQuestionCircle },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "debug", label: "Debug", icon: FaBell },
    { id: "newsletter", label: "Newsletter", icon: FaEnvelope },
  ];

  // Newsletter dummy data (keeping this as it might not have a Redux slice yet)
  const items = [
    { _id:"1", email:"a@x.com", status:"subscribed", createdAt:"2025-09-01T09:00:00Z" },
    { _id:"2", email:"b@x.com", status:"unsubscribed", createdAt:"2025-09-05T12:00:00Z" }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            stats={overviewStats}
            revenueTrend={[12000, 18000, 26000, 31000, 29000, 34000, 36000]} // Keep trend data as is
            topProducts={topProducts}
            recentOrders={recentOrders}
            recentReviews={recentReviews}
            upcomingAppointments={upcomingAppointments}
            loading={ordersLoading || productsLoading || reviewsLoading}
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
            reviews={reviews}
            pagination={{ page: 1, limit: 20, total: reviews.length, totalPages: Math.ceil(reviews.length / 20) }}
            onAction={(action, review) => {/* TODO: Implement review actions */}}
            onPageChange={(newPage) => {/* TODO: Implement pagination */}}
            onFilterChange={(filters) => {/* TODO: Implement filters */}}
            onClearFilters={() => {/* TODO: Implement clear filters */}} 
          />
        );
      case "testimonials":
        return <TestimonialAdmin />;
      case "blogs":
        return <Blogs />;
      case "newsevents":
        return <NewsEventsAdmin />;
      case "instagram":
        return <InstagramAdmin />;
      case "faq":
        return <FAQAdmin />;
      case "notifications":
        return <NotificationsDashboard />;
      case "debug":
        return <NotificationDebug />;
      case "newsletter":
        return (
          <Newsletter  
            subscribers={items}
            pagination={{ page:1, limit:20, total:items.length, totalPages:Math.ceil(items.length/20) }}
            onFilterChange={(f) => {/* TODO: Implement order filters */}}
            onPageChange={(p) => {/* TODO: Implement order pagination */}} 
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
              className="lg:hidden p-2  text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            >
              <FaBars className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600  flex items-center justify-center">
                <MdDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Garava Admin</h1>
              </div>
            </div>
          </div>

          {/* Center: Current Page */}
          <div className="hidden md:block">
            <h2 className="text-sm font-medium uppercase tracking-wider 
             text-gray-600">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
          

            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 ">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <FaUser className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>

            <Link 
              to="/" 
              className="p-2  text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
      <aside className={`fixed top-20 left-0 z-40 w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transform transition-transform duration-200 ${
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
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left  transition-colors ${
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
              <p className="text-sm text-gray-500">Garava Admin v2.0</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Online</span>
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
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 ">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Live</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white  text-sm font-medium hover:bg-blue-700 transition-colors">
                  Export
                </button>
              </div> */}
            </div>
          </div>

          {/* Content Area */}
          <div className="h-[calc(100%-5rem)] bg-gray-50">
            <div className="h-full p-6">
              <div className="h-full bg-white  border border-gray-200 overflow-hidden">
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