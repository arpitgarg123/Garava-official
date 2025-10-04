import { Routes, Route } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import Home from './pages/Home.jsx'
import ProductDetails from "./pages/products/ProductDetails.jsx";
import OurStory from "./pages/OurStory.jsx";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./shared/auth/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import BookAnAppointment from "./pages/Appointment/BookAnAppointment.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import PaymentSimulator from "./pages/PaymentSimulator.jsx";
import PaymentCallback from "./pages/PaymentCallback.jsx";
import PaymentFailure from "./pages/PaymentFailure.jsx";
import PaymentTest from "./pages/PaymentTest.jsx";
import EventsPage from "./pages/newsEvents/Events.jsx";
import { MediaCoveragePage } from "./pages/newsEvents/MediaCoverage.jsx";
import AuthCallback from "./components/auth/AuthCallback.jsx";
// import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ShippingPolicy from "./pages/ShippingPolicy.jsx";
import RefundReturn from "./pages/RefundReturn.jsx";
import TermCondition from "./pages/TermCondition.jsx";
import WebsiteLoader from "./layouts/WebsiteLoader.jsx";
// import AuthDebugger from "./components/auth/AuthDebugger.jsx";

const ProductPage = lazy(() => import("./pages/products/ProductPage.jsx"));
const Login = lazy(() => import("./features/auth/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Blogs = lazy(()=> import("./pages/blogs/BlogList.jsx"))
const BlogDetails = lazy(()=> import("./pages/blogs/BlogDetails.jsx"))
const EventDetails = lazy(()=> import("./pages/newsEvents/EventDetails.jsx"))
const Contact = lazy(()=> import("./pages/Contact.jsx"))
const SearchResults = lazy(() => import("./pages/SearchResults.jsx"))

const App = () => {
   const [isWebsiteLoading, setIsWebsiteLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Handle initial website loading
  const handleLoadingComplete = () => {
    setIsWebsiteLoading(false);
    setIsInitialized(true);
  };
  if (isWebsiteLoading) {
    return (
      <WebsiteLoader
        onLoadingComplete={handleLoadingComplete}
        minLoadTime={3000}
        showProgress={true}
      />
    );
  }
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AuthCallback /> {/* Handle OAuth callbacks and welcome messages */}
      {/* {process.env.NODE_ENV === 'development' && <AuthDebugger />} Debug component for development */}
      <Routes>
        {/* Auth routes - only accessible to guests */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        <Route path="/verify-email" element={<GuestRoute><VerifyEmail /></GuestRoute>} />
        <Route path="/resend-verification" element={<GuestRoute><ResendVerification /></GuestRoute>} />
        
        {/* Payment callback routes - standalone without layout */}
        <Route path="/payment/success" element={<PaymentCallback />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/about" element={<OurStory />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event_details/:slug" element={<EventDetails />} />
          <Route path="/media" element={<MediaCoveragePage  />} />
          {/* <Route path="/privacy-policy" element={<PrivacyPolicy />} /> */}
          <Route path="/terms-and-conditions" element={<TermCondition />} />
          <Route path="/refund-return" element={<RefundReturn />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />


          {/* <Route path="jewellery" element={<jewellery />} /> */}
          <Route path="products/:category" element={<ProductPage />} />
          {/* <Route path="product/:id" element={<ProductDetails />} /> */}
          <Route path="/product_details/:slug" element={<ProductDetails />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:orderId" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/appointment" element={<ProtectedRoute><BookAnAppointment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Payment simulator for development */}
          <Route path="/simulate-payment" element={<PaymentSimulator />} />
          
          {/* Admin routes - require admin role */}
        </Route>
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
      </Routes>
    </Suspense>
  );
};

export default App;
