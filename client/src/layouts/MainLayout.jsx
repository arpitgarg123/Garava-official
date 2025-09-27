import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';
import { selectIsAuthenticated } from '../features/auth/selectors';
import { fetchCart } from '../features/cart/slice';
import { fetchWishlist } from '../features/wishlist/slice';

const MainLayout = ({children}) => {
      const location = useLocation();
      const dispatch = useDispatch();
      const isAuthenticated = useSelector(selectIsAuthenticated);

        useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Fetch cart and wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
        .unwrap()
        .catch((error) => {
          console.error('MainLayout - Cart fetch failed:', error);
          if (error.includes('401') || error.includes('Unauthorized')) {
            console.log('MainLayout - Authentication invalid, clearing auth state');
            // Don't dispatch logout here to avoid circular issues
          }
        });
      
      dispatch(fetchWishlist())
        .unwrap()
        .catch((error) => {
          console.error('MainLayout - Wishlist fetch failed:', error);
          if (error.includes('401') || error.includes('Unauthorized')) {
            console.log('MainLayout - Authentication invalid, clearing auth state');
          }
        });
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