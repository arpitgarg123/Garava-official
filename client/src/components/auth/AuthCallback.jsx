import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { initAuth } from '../../features/auth/slice';

/**
 * AuthCallback Component
 * Handles OAuth error parameters and session restoration
 */
const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, status } = useSelector((state) => state.auth);
  const hasTriggeredInitAuth = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');

    // Handle OAuth errors on any route
    if (error) {
      let message = 'Authentication failed';
      
      switch (error) {
        case 'oauth_error':
          message = 'Google OAuth authentication failed. Please try again.';
          break;
        case 'oauth_failed':
          message = 'Unable to complete Google authentication. Please try again.';
          break;
        case 'auth_error':
          message = 'Authentication error occurred. Please try logging in again.';
          break;
        default:
          message = 'Authentication failed. Please try again.';
      }
      
      toast.error(message);
      
      // Clear error from URL and redirect to login
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
      return;
    }

    // Only trigger auth initialization once on first visit to home page
    if (location.pathname === '/' && !accessToken && status === 'idle' && !hasTriggeredInitAuth.current) {
      hasTriggeredInitAuth.current = true;
      dispatch(initAuth());
    }

    // Reset the flag when user successfully authenticates or navigates away from home
    if (accessToken || location.pathname !== '/') {
      hasTriggeredInitAuth.current = false;
    }
  }, [location, navigate, dispatch, accessToken, status]);

  return null; // This component doesn't render anything
};

export default AuthCallback;