import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { initAuth } from '../../features/auth/slice';

/**
 * AuthCallback Component
 * Handles OAuth success/error parameters and welcome messages
 */
const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { accessToken, user, status } = useSelector((state) => state.auth);
  const hasTriggeredInitAuth = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    const welcome = params.get('welcome');

    console.log('AuthCallback - Checking URL params:', { error, welcome, pathname: location.pathname });

    // Handle OAuth errors
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
      
      console.log('AuthCallback - OAuth error detected:', message);
      toast.error(message);
      
      // Clear error from URL and redirect to login
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
      return;
    }

    // Handle welcome message for new users from Google OAuth
    if (welcome === 'true') {
      console.log('AuthCallback - Welcome parameter detected, Google OAuth completed');
      
      // Force auth initialization regardless of current state
      console.log('AuthCallback - Forcing auth initialization for Google OAuth completion');
      dispatch(initAuth());
      
      // Show welcome message after a delay
      setTimeout(() => {
        toast.success('Welcome to Garava! Your Google account has been successfully linked.');
      }, 1500);
      
      // Clear welcome parameter from URL
      const newParams = new URLSearchParams(location.search);
      newParams.delete('welcome');
      const newSearch = newParams.toString();
      const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
      
      navigate(newUrl, { replace: true });
      return;
    }

    // Only trigger auth initialization once on first visit to home page
    // This handles the case where user comes back from Google OAuth redirect
    if (location.pathname === '/' && !accessToken && status === 'idle' && !hasTriggeredInitAuth.current) {
      console.log('AuthCallback - First home page visit without token, attempting auth restoration...');
      console.log('AuthCallback - Current auth state:', { accessToken: !!accessToken, user: !!user, status });
      
      // Mark that we've triggered the auth initialization to prevent loops
      hasTriggeredInitAuth.current = true;
      
      // Trigger auth initialization
      console.log('AuthCallback - Triggering one-time auth initialization...');
      dispatch(initAuth());
    }

    // Reset the flag when user successfully authenticates or navigates away from home
    if (accessToken || location.pathname !== '/') {
      hasTriggeredInitAuth.current = false;
    }
  }, [location, navigate, dispatch, accessToken, user, status]);

  return null; // This component doesn't render anything
};

export default AuthCallback;