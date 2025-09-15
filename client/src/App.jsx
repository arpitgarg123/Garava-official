import { Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import MainLayout from './layouts/MainLayout.jsx';
import ProductDetails from './components/Products/ProductDetails.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Fragrance = lazy(() => import('./pages/products/Fragnance.jsx'))
const Jewelry = lazy(() => import('./pages/products/Jewellry.jsx'))

const App = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <Routes>
        <Route path='/' element={<MainLayout />}>
  <Route index element={<Home />} />
        <Route path="about" element={<About />} />
         <Route path="jewelry" element={<Jewelry />} />
          <Route path="fragrance" element={<Fragrance />} />
              <Route path="product/:id" element={<ProductDetails />} />
        </Route>
      
      </Routes>
    </Suspense>
  )
}

export default App