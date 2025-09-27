import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import ProductDetails from "./pages/products/ProductDetails.jsx";
import OurStory from "./pages/OurStory.jsx";
import { ProtectedRoute, AdminRoute, GuestRoute } from "./shared/auth/ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import BookAnAppointment from "./pages/Appointment/BookAnAppointment.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import BlogList from "./components/blogs/BlogList.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const ProductPage = lazy(() => import("./pages/products/ProductPage.jsx"));
const Login = lazy(() => import("./features/auth/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));
const Blogs = lazy(()=> import("./components/blogs/BlogList.jsx"))

const App = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        {/* Auth routes - only accessible to guests */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        <Route path="/verify-email" element={<GuestRoute><VerifyEmail /></GuestRoute>} />
        <Route path="/resend-verification" element={<GuestRoute><ResendVerification /></GuestRoute>} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<OurStory />} />
          <Route path="blogs" element={<Blogs />} />
          {/* <Route path="jewellery" element={<jewellery />} /> */}
          <Route path="products/:category" element={<ProductPage />} />
          {/* <Route path="product/:id" element={<ProductDetails />} /> */}
          <Route path="/product_details/:slug" element={<ProductDetails />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/appointment" element={<ProtectedRoute><BookAnAppointment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Admin routes - require admin role */}
          <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
