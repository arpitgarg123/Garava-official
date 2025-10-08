import React from 'react';
import { useSelector } from 'react-redux';
import { FaExclamationTriangle, FaUser, FaShieldAlt } from 'react-icons/fa';

const AuthDebugPanel = () => {
  // Check auth state
  const authState = useSelector(state => state.auth || {});
  const userInfo = authState.user || null;
  const isAuthenticated = authState.isAuthenticated || false;
  const token = authState.token || null;

  const isAdmin = userInfo?.role === 'admin';

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-4">
      <div className="flex items-center gap-2 mb-3">
        <FaExclamationTriangle className="text-yellow-600" />
        <h3 className="font-semibold text-yellow-800">Authentication Debug</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <FaUser className={isAuthenticated ? "text-green-600" : "text-red-600"} />
          <span>
            <strong>Authenticated:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <FaShieldAlt className={isAdmin ? "text-green-600" : "text-red-600"} />
          <span>
            <strong>Admin Role:</strong> {isAdmin ? "✅ Yes" : `❌ ${userInfo?.role || 'No role'}`}
          </span>
        </div>
        
        <div>
          <strong>User:</strong> {userInfo?.email || userInfo?.name || 'Not logged in'}
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-800">
          <strong>⚠️ Not Authenticated:</strong> Please log in to access FAQ management.
        </div>
      )}

      {isAuthenticated && !isAdmin && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-red-800">
          <strong>⚠️ Access Denied:</strong> Admin role required for FAQ management.
        </div>
      )}

      {isAuthenticated && isAdmin && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded text-green-800">
          <strong>✅ Access Granted:</strong> You have admin privileges for FAQ management.
        </div>
      )}
    </div>
  );
};

export default AuthDebugPanel;