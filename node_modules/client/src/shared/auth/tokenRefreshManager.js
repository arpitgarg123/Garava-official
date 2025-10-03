import { refreshApi } from '../../features/auth/api';
import { logout, setTokens } from '../../features/auth/slice';

/**
 * Token Refresh Manager
 * Handles automatic token refresh before expiration
 */
class TokenRefreshManager {
  constructor() {
    this.refreshTimer = null;
    this.store = null;
    this.isRefreshing = false;
  }

  init(store) {
    this.store = store;
  }

  // Start automatic refresh cycle
  startRefreshCycle(accessToken) {
    if (!accessToken) return;
    
    this.clearRefreshTimer();
    
    try {
      // Decode token to get expiry (without verification)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const expiresAt = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;
      
      // Refresh token 1 hour before it expires (or immediately if already expired)
      const refreshBuffer = 60 * 60 * 1000; // 1 hour
      const refreshTime = Math.max(0, timeUntilExpiry - refreshBuffer);
      
      console.log('Token Refresh Manager - Setting refresh timer:', {
        expiresAt: new Date(expiresAt).toISOString(),
        timeUntilExpiry: Math.round(timeUntilExpiry / 1000) + 's',
        refreshIn: Math.round(refreshTime / 1000) + 's'
      });
      
      this.refreshTimer = setTimeout(() => {
        this.performRefresh();
      }, refreshTime);
      
    } catch (error) {
      console.error('Token Refresh Manager - Error parsing token:', error);
      // Fallback: try to refresh in 2 hours
      this.refreshTimer = setTimeout(() => {
        this.performRefresh();
      }, 2 * 60 * 60 * 1000);
    }
  }

  async performRefresh() {
    if (this.isRefreshing) {
      console.log('Token Refresh Manager - Refresh already in progress');
      return;
    }

    if (!this.store) {
      console.error('Token Refresh Manager - Store not initialized');
      return;
    }

    this.isRefreshing = true;
    console.log('Token Refresh Manager - Performing proactive token refresh...');

    try {
      const { data } = await refreshApi();
      
      if (data?.accessToken) {
        console.log('Token Refresh Manager - Proactive refresh successful');
        
        // Update store with new tokens
        this.store.dispatch(setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        }));
        
        // Start next refresh cycle
        this.startRefreshCycle(data.accessToken);
      } else {
        throw new Error('No access token received');
      }
      
    } catch (error) {
      console.error('Token Refresh Manager - Proactive refresh failed:', error);
      
      // If refresh fails, log out the user
      this.store.dispatch(logout());
      this.clearRefreshTimer();
      
    } finally {
      this.isRefreshing = false;
    }
  }

  clearRefreshTimer() {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
      console.log('Token Refresh Manager - Refresh timer cleared');
    }
  }

  stop() {
    this.clearRefreshTimer();
    this.isRefreshing = false;
  }
}

// Export singleton instance
export const tokenRefreshManager = new TokenRefreshManager();