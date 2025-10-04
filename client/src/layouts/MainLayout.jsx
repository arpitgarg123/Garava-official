import React, { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster, toast } from 'react-hot-toast';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import Navbar from '../components/navbar/Navbar';
import NetworkStatusIndicator from '../components/ui/NetworkStatusIndicator';
import { selectIsAuthenticated, selectAuthStatus, selectAuthError } from '../features/auth/selectors';
import { fetchCart } from '../features/cart/slice';
import { fetchWishlist } from '../features/wishlist/slice';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLocomotiveScroll } from '../hooks/useLocomotiveScroll';

const MainLayout = ({children}) => {
  const { updateScroll } = useLocomotiveScroll();
      const location = useLocation();
      const dispatch = useDispatch();
      const isAuthenticated = useSelector(selectIsAuthenticated);
      const isOnline = useOnlineStatus();
      const authStatus = useSelector(selectAuthStatus);
      const authError = useSelector(selectAuthError);
      const cartStatus = useSelector(state => state.cart.status);
      const wishlistStatus = useSelector(state => state.wishlist.status);
      
      // Track if we've already initiated fetches for this auth session
      const hasInitiatedFetch = useRef(false);
      const hasShownAuthError = useRef(false);

        useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    // Update scroll when route changes
    updateScroll();
  }, [location.pathname, updateScroll]);

  // Fetch cart and wishlist when user is authenticated - with smart timing
  useEffect(() => {
    if (isAuthenticated && !hasInitiatedFetch.current && isOnline) {
      hasInitiatedFetch.current = true;
      
      // Initial fetch with force option to ensure data loads
      dispatch(fetchCart({ force: true }))
        .unwrap()
        .catch((error) => {
          console.error('MainLayout - Cart fetch failed:', error);
          if (error !== 'Already loading' && error !== 'Too soon') {
            if (error.includes('401') || error.includes('Unauthorized')) {
              console.log('MainLayout - Authentication invalid, clearing auth state');
            } else if (error.includes('timeout') || error.includes('ECONNABORTED')) {
              console.warn('MainLayout - Cart fetch timeout, will retry when online');
              // Don't show error toast for timeouts when offline
              if (isOnline) {
                toast.error('Failed to load cart. Please try refreshing the page.', {
                  duration: 3000,
                  id: 'cart-error'
                });
              }
            }
          }
        });
      
      dispatch(fetchWishlist({ force: true }))
        .unwrap()
        .catch((error) => {
          console.error('MainLayout - Wishlist fetch failed:', error);
          if (error !== 'Already loading' && error !== 'Too soon') {
            if (error.includes('401') || error.includes('Unauthorized')) {
              console.log('MainLayout - Authentication invalid, clearing auth state');
            } else if (error.includes('timeout') || error.includes('ECONNABORTED')) {
              console.warn('MainLayout - Wishlist fetch timeout, will retry when online');
              // Don't show error toast for timeouts when offline
              if (isOnline) {
                toast.error('Failed to load wishlist. Please try refreshing the page.', {
                  duration: 3000,
                  id: 'wishlist-error'
                });
              }
            }
          }
        });
    } else if (!isAuthenticated) {
      // Reset the flag when user logs out
      hasInitiatedFetch.current = false;
      hasShownAuthError.current = false;
    }
  }, [dispatch, isAuthenticated, isOnline]);

  // Retry fetching data when user comes back online
  const lastRetryTime = useRef(0);
  
  useEffect(() => {
    if (isOnline && isAuthenticated && hasInitiatedFetch.current) {
      const now = Date.now();
      // Prevent retries more than once per minute
      if (now - lastRetryTime.current < 60000) {
        console.log('MainLayout - Skipping retry, too soon since last attempt');
        return;
      }
      
      lastRetryTime.current = now;
      
      // Small delay to ensure connection is stable
      const retryTimer = setTimeout(() => {
        console.log('MainLayout - Connection restored, retrying data fetch...');
        dispatch(fetchCart({ force: true })).unwrap().catch(() => {});
        dispatch(fetchWishlist({ force: true })).unwrap().catch(() => {});
      }, 2000);

      return () => clearTimeout(retryTimer);
    }
  }, [isOnline, isAuthenticated, dispatch]);

  // Handle authentication errors with user-friendly messages
  useEffect(() => {
    if (authStatus === 'failed' && authError && !hasShownAuthError.current) {
      hasShownAuthError.current = true;
      
      if (authError.includes('Connection timeout') || authError.includes('Network Error')) {
        toast.error('Connection timeout. Please check your internet connection.', {
          duration: 4000,
          id: 'network-error'
        });
      } else if (authError.includes('Session expired') || authError.includes('unauthorized')) {
        toast.error('Your session has expired. Please log in again.', {
          duration: 4000,
          id: 'auth-error'
        });
      } else if (authError.includes('Authentication failed')) {
        toast.error('Authentication service temporarily unavailable. Please try again.', {
          duration: 4000,
          id: 'auth-error'
        });
      }
    }
    
    // Reset error flag when status changes
    if (authStatus !== 'failed') {
      hasShownAuthError.current = false;
    }
  }, [authStatus, authError]);
  return (
   <>
   <NetworkStatusIndicator />
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