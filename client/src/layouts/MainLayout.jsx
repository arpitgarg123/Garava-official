import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';
import { selectIsAuthenticated } from '../features/auth/selectors';
import { fetchCart } from '../features/cart/slice';

const MainLayout = ({children}) => {
      const location = useLocation();
      const dispatch = useDispatch();
      const isAuthenticated = useSelector(selectIsAuthenticated);

        useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);
  return (
   <>
   <Navbar />
    <main id="main-content" className="min-h-screen">
        <Outlet />
        {children}
      </main>
      <Footer />
      <Toaster position="top-right" />
   </>
  )
}

export default MainLayout