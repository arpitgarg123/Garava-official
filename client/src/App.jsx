import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import ProductDetails from "./pages/products/ProductDetails.jsx";
import OurStory from "./pages/OurStory.jsx";
import { GuestOnly } from "./shared/auth.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ResendVerification from "./pages/ResendVerification.jsx";
import BookAnAppointment from "./pages/Appointment/BookAnAppointment.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Fragrance = lazy(() => import("./pages/products/Fragnance.jsx"));
const Jewelry = lazy(() => import("./pages/products/Jewellry.jsx"));
const ProductPage = lazy(() => import("./pages/products/ProductPage.jsx"));
const Login = lazy(() => import("./features/auth/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.jsx"));

const App = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        {/* auth routes */}
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/resend-verification" element={<ResendVerification />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<OurStory />} />
          <Route path="jewelry" element={<Jewelry />} />
          <Route path="products" element={<ProductPage />} />
          {/* <Route path="product/:id" element={<ProductDetails />} /> */}
          <Route path="product_details" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/dashboard" element={< Dashboard/>} />
          <Route path="/appointment" element={< BookAnAppointment/>} />

        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
