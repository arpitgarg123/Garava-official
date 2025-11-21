import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaUser, 
  FaUsers,
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
import { Link, useNavigate } from 'react-router-dom';

// Lazy load all admin dashboard sections - only load when tab is accessed
const Products = lazy(() => import('./../components/DashboardSections/Products'));
const Orders = lazy(() => import('./../components/DashboardSections/Orders'));
const Appointment = lazy(() => import('../components/DashboardSections/Appointment'));
const Reviews = lazy(() => import('./../components/DashboardSections/Reviews'));
const Newsletter = lazy(() => import('../components/DashboardSections/Newsletter'));
const Customers = lazy(() => import('../components/DashboardSections/Customers'));
const Blogs = lazy(() => import('../components/DashboardSections/BlogsAdmin'));
const FAQAdmin = lazy(() => import('../components/DashboardSections/FAQAdmin'));
const TestimonialAdmin = lazy(() => import('../components/DashboardSections/TestimonialAdmin'));
const Overview = lazy(() => import('../components/DashboardSections/Overview'));
const NotificationsDashboard = lazy(() => import('../components/DashboardSections/NotificationsDashboard'));
const NewsEventsAdmin = lazy(() => import('../components/DashboardSections/NewsEventsAdmin'));
const InstagramAdmin = lazy(() => import('../components/DashboardSections/InstagramAdmin'));

// Redux imports for real data
import { fetchOrdersAdmin } from '../features/order/adminSlice';
import { fetchProductsAdmin } from '../features/product/adminSlice';
import { fetchReviewsAdmin } from '../features/reviews/reviewAdminSlice';
import { fetchAppointmentsAdmin } from '../features/appointment/adminSlice';
import { fetchBlogsAdmin } from '../features/blogs/blogAdminSlice';
import { fetchTestimonials } from '../features/testimonial/slice';
import { fetchDashboardStats } from '../features/dashboard/dashboardSlice';
import { fetchNewsletterSubscribers, setFilters as setNewsletterFilters, setPage as setNewsletterPage } from '../features/newsletter/slice';
import { fetchCustomersAdmin, fetchCustomerStats } from '../features/customers/adminSlice';

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
  const newsletterSubscribers = useSelector(state => state.newsletter?.subscribers || []);
  const newsletterPagination = useSelector(state => state.newsletter?.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 });
  const newsletterLoading = useSelector(state => state.newsletter?.loading || false);
  const customers = useSelector(state => state.customerAdmin?.customers || []);
  const customerStats = useSelector(state => state.customerAdmin?.stats || {});
  const customerPagination = useSelector(state => state.customerAdmin?.pagination || {});
  
  // Dashboard stats from dedicated endpoint
  const dashboardStats = useSelector(state => state.dashboard?.stats || {});
  const statsLoading = useSelector(state => state.dashboard?.loading || false);

  // Loading states
  const ordersLoading = useSelector(state => state.orderAdmin?.loading || false);
  const productsLoading = useSelector(state => state.productAdmin?.loading || false);
  const reviewsLoading = useSelector(state => state.reviewAdmin?.loading || false);
  const customersLoading = useSelector(state => state.customerAdmin?.loading || false);

  // Fetch real data on component mount
  useEffect(() => {
    // Fetch accurate dashboard stats
    dispatch(fetchDashboardStats());
    
    // Fetch recent data for display (limited to 10 for performance)
    dispatch(fetchOrdersAdmin({ limit: 10, sort: '-createdAt' }));
    dispatch(fetchProductsAdmin({ limit: 10 }));
    dispatch(fetchReviewsAdmin({ limit: 10, sort: '-createdAt' }));
    dispatch(fetchAppointmentsAdmin({ limit: 10, sort: 'appointmentAt' }));
    dispatch(fetchBlogsAdmin({ limit: 5, sort: '-createdAt' }));
    dispatch(fetchTestimonials({ limit: 5, sort: '-createdAt' }));
    dispatch(fetchNewsletterSubscribers({ page: 1, limit: 20 }));
    
    // Fetch customer data and stats
    dispatch(fetchCustomersAdmin({ limit: 20, page: 1 }));
    dispatch(fetchCustomerStats());
  }, [dispatch]);

  // Calculate real statistics  
  // Use dashboard stats from dedicated endpoint for accurate totals
  const overviewStats = {
    revenueINR: dashboardStats.revenue?.total || 0,
    todayRevenueINR: dashboardStats.revenue?.today || 0,
    orders: dashboardStats.orders?.total || 0,
    products: dashboardStats.products?.total || 0,
    avgRating: dashboardStats.reviews?.avgRating || 0,
    // New Orders and Completed Orders
    newOrders: dashboardStats.orders?.pending || 0,
    completedOrders: dashboardStats.orders?.delivered || 0,
    // Action Required Stats
    pendingOrders: dashboardStats.orders?.needsAttention || 0,
    pendingReviews: dashboardStats.reviews?.needsAttention || 0,
    lowStockProducts: dashboardStats.products?.needsAttention || 0,
    pendingAppointments: dashboardStats.appointments?.needsAttention || 0,
    newCustomers: dashboardStats.customers?.new || 0,
  };

  // Get recent data
  // Note: order.grandTotal is already in rupees from admin API
  const recentOrders = orders.slice(0, 5).map(order => ({
    ...order,
    totalINR: order.grandTotal || 0
  }));

  const recentReviews = reviews.slice(0, 5).map(review => ({
    _id: review._id,
    userName: review.userName || review.customerName || review.user?.name || 'Anonymous',
    rating: review.rating || 0,
    comment: review.comment || review.content || review.description || '',
    productName: review.productName || review.product?.name || '',
    createdAt: review.createdAt
  }));

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.appointmentAt) >= new Date())
    .slice(0, 5);

  // Top products by sales or popularity
  const topProducts = products.slice(0, 5).map(product => {
    // Get base price (already in rupees from backend)
    const basePrice = product.basePrice || product.price || 0;
    const stockQty = product.stockQuantity || 0;
    
    return {
      _id: product._id,
      name: product.name || product.title,
      image: product.heroImage?.url || product.images?.[0]?.url,
      priceINR: basePrice, // Display product price
      salesINR: basePrice * Math.min(stockQty, 10), // Estimated sales (price × min stock/10)
      units: stockQty
    };
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: MdDashboard },
    { id: "products", label: "Products", icon: FaBoxOpen },
    { id: "orders", label: "Orders", icon: FaBoxOpen },
    { id: "bookings", label: "Bookings", icon: MdEventAvailable },
    { id: "customers", label: "Customers", icon: FaUsers },
    { id: "reviews", label: "Reviews", icon: FaStar },
    { id: "testimonials", label: "Testimonials", icon: FaComments },
    { id: "blogs", label: "Blogs", icon: FaBlog },
    { id: "newsevents", label: "News & Events", icon: FaNewspaper },
    { id: "instagram", label: "Instagram", icon: FaInstagram },
    { id: "faq", label: "FAQ", icon: FaQuestionCircle },
    { id: "notifications", label: "Notifications", icon: FaBell },
    { id: "newsletter", label: "Newsletter", icon: FaEnvelope },
  ];

  // Newsletter dummy data (keeping this as it might not have a Redux slice yet)
  const items = [
    { _id:"1", email:"a@x.com", status:"subscribed", createdAt:"2025-09-01T09:00:00Z" },
    { _id:"2", email:"b@x.com", status:"unsubscribed", createdAt:"2025-09-05T12:00:00Z" }
  ];

  // Loading fallback component for lazy-loaded sections
  const SectionLoader = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading section...</p>
      </div>
    </div>
  );

  const renderContent = () => {
    // Wrap each lazy-loaded component with Suspense
    switch (activeTab) {
      case "overview":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Overview
              stats={overviewStats}
              revenueTrend={[12000, 18000, 26000, 31000, 29000, 34000, 36000]} // Keep trend data as is
              topProducts={topProducts}
              recentOrders={recentOrders}
              recentReviews={recentReviews}
              upcomingAppointments={upcomingAppointments}
              loading={statsLoading || ordersLoading || productsLoading || reviewsLoading}
            />
          </Suspense>
        );
      case "products":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Products />
          </Suspense>
        );
      case "orders":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Orders />
          </Suspense>
        );
      case "bookings":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Appointment />
          </Suspense>
        );
      case "reviews":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Reviews   
              reviews={reviews}
              pagination={{ page: 1, limit: 20, total: reviews.length, totalPages: Math.ceil(reviews.length / 20) }}
              onAction={(action, review) => {/* TODO: Implement review actions */}}
              onPageChange={(newPage) => {/* TODO: Implement pagination */}}
              onFilterChange={(filters) => {/* TODO: Implement filters */}}
              onClearFilters={() => {/* TODO: Implement clear filters */}} 
            />
          </Suspense>
        );
      case "customers":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Customers 
              customers={customers}
              stats={customerStats}
              pagination={customerPagination}
              loading={customersLoading}
              onFilterChange={(filters) => {
                dispatch(fetchCustomersAdmin({ ...filters, page: 1 }));
              }}
              onPageChange={(page) => {
                dispatch(fetchCustomersAdmin({ page }));
              }}
            />
          </Suspense>
        );
      case "testimonials":
        return (
          <Suspense fallback={<SectionLoader />}>
            <TestimonialAdmin />
          </Suspense>
        );
      case "blogs":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Blogs />
          </Suspense>
        );
      case "newsevents":
        return (
          <Suspense fallback={<SectionLoader />}>
            <NewsEventsAdmin />
          </Suspense>
        );
      case "instagram":
        return (
          <Suspense fallback={<SectionLoader />}>
            <InstagramAdmin />
          </Suspense>
        );
      case "faq":
        return (
          <Suspense fallback={<SectionLoader />}>
            <FAQAdmin />
          </Suspense>
        );
      case "notifications":
        return (
          <Suspense fallback={<SectionLoader />}>
            <NotificationsDashboard />
          </Suspense>
        );
      case "newsletter":
        return (
          <Suspense fallback={<SectionLoader />}>
            <Newsletter  
              subscribers={newsletterSubscribers}
              pagination={newsletterPagination}
            loading={newsletterLoading}
              onFilterChange={(filters) => {
              dispatch(setNewsletterFilters(filters));
              dispatch(fetchNewsletterSubscribers({ 
                page: 1, 
                limit: newsletterPagination.limit, 
                status: filters.status || '' 
              }));
            }}
              onPageChange={(newPage) => {
              dispatch(setNewsletterPage(newPage));
              dispatch(fetchNewsletterSubscribers({ 
                page: newPage, 
                limit: newsletterPagination.limit 
              }));
            }} 
            />
          </Suspense>
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
            <h2 className="text-[1.0625rem] font-medium uppercase tracking-wider 
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
              <span className="text-[1.0625rem] font-medium text-gray-700">Admin</span>
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
      <aside className={`fixed top-20 left-0 z-40 w-64 h-[calc(100vh-5rem)] bg-white border-r border-gray-200 transform transition-transform duration-200 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full flex flex-col">
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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
          <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
            <div className="text-center">
              <p className="text-[1.0625rem] text-gray-500">Garava Admin v2.0</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-[1.0625rem] text-gray-400">Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Clean Main Content */}
      <main className="lg:ml-64 pt-16">
        <div className="min-h-[calc(100vh-4rem)]">
          {/* Content Header - Hidden for tabs with their own headers */}
          {!['customers', 'products', 'orders'].includes(activeTab) && (
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {tabs.find(t => t.id === activeTab)?.label}
                  </h1>
                  <p className="text-[1.0625rem] text-gray-600 mt-1">
                    Manage your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()}
                  </p>
                </div>
              
              {/* <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 ">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-[1.0625rem] font-medium text-green-700">Live</span>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white  text-[1.0625rem] font-medium hover:bg-blue-700 transition-colors">
                  Export
                </button>
              </div> */}
            </div>
          </div>
          )}

          {/* Content Area */}
          <div className={`${!['customers', 'products', 'orders'].includes(activeTab) ? 'bg-gray-50 p-6' : 'h-full'}`}>
            <div className={`${!['customers', 'products', 'orders'].includes(activeTab) ? 'bg-white rounded-lg border border-gray-200' : 'h-full'}`}>
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;