import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { setTokens } from '../features/auth/slice';

/**
 * AuthCallbackPage Component
 * Handles OAuth callback with tokens in URL parameters
 */
const AuthCallbackPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const welcome = params.get('welcome');
    const error = params.get('error');

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
      
      toast.error(message);
      
      // Redirect to login after showing error
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 2000);
      return;
    }

    // Handle successful OAuth with tokens
    if (accessToken && refreshToken) {
      // Set tokens in Redux store
      dispatch(setTokens({
        accessToken,
        refreshToken
      }));

      // Show welcome message for new users
      if (welcome === 'true') {
        setTimeout(() => {
          toast.success('Welcome to Garava! Your Google account has been successfully linked.');
        }, 500);
      } else {
        setTimeout(() => {
          toast.success('Successfully logged in with Google!');
        }, 500);
      }

      // Redirect to home page
      navigate('/', { replace: true });
      return;
    }

    // If no tokens and no error, something went wrong
    toast.error('Authentication failed. Please try again.');
    navigate('/login', { replace: true });

  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;