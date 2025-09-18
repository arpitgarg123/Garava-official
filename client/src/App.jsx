import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import MainLayout from "./layouts/MainLayout.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";


const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Fragrance = lazy(() => import("./pages/products/Fragnance.jsx"));
const Jewelry = lazy(() => import("./pages/products/Jewellry.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"))
const Signup = lazy(() => import("./pages/Signup.jsx"))

const App = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
           {/* auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} /> 
        <Route path="about" element={<About />} />
        <Route path="jewelry" element={<Jewelry />} />
        <Route path="fragrance" element={<Fragrance />} />
        {/* <Route path="product/:id" element={<ProductDetails />} />  this route use after integration */}
        {/* this route only testing */}
        <Route path="product_details" element={<ProductDetails />} />
        </Route>
      
      </Routes>
    </Suspense>
  );
};

export default App;
