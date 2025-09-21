import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import OurStory from "./pages/OurStory.jsx";
import { GuestOnly } from "./shared/auth.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const Fragrance = lazy(() => import("./pages/products/Fragnance.jsx"));
const Jewelry = lazy(() => import("./pages/products/Jewellry.jsx"));
const Login = lazy(() => import("./features/auth/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));

const App = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        {/* auth routes */}
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<OurStory />} />
          <Route path="jewelry" element={<Jewelry />} />
          <Route path="fragrance" element={<Fragrance />} />
          {/* <Route path="product/:id" element={<ProductDetails />} /> */}
          <Route path="product_details" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
