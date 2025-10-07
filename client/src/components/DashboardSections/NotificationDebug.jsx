import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import http from '../../shared/api/http.js';

const NotificationDebug = () => {
  const [debugInfo, setDebugInfo] = useState('');

  const testAuth = async () => {
    try {
      setDebugInfo('Testing authentication...');
      
      // First, let's try a simple endpoint to see if auth works
      const response = await http.get('/admin/notifications/stats');
      setDebugInfo('Success! Auth is working. Response: ' + JSON.stringify(response.data, null, 2));
      toast.success('Authentication test passed!');
    } catch (error) {
      console.error('Auth test failed:', error);
      const errorInfo = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      };
      setDebugInfo('Auth test failed: ' + JSON.stringify(errorInfo, null, 2));
      toast.error('Authentication test failed');
    }
  };

  const testEndpoint = async () => {
    try {
      setDebugInfo('Testing notifications endpoint...');
      
      const response = await http.get('/admin/notifications');
      setDebugInfo('Endpoint test success: ' + JSON.stringify(response.data, null, 2));
      toast.success('Endpoint test passed!');
    } catch (error) {
      console.error('Endpoint test failed:', error);
      const errorInfo = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        code: error.code
      };
      setDebugInfo('Endpoint test failed: ' + JSON.stringify(errorInfo, null, 2));
      toast.error('Endpoint test failed');
    }
  };

  const testPlainFetch = async () => {
    try {
      setDebugInfo('Testing with plain fetch...');
      
      const response = await fetch('http://localhost:8080/api/admin/notifications/stats', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const responseText = await response.text();
      setDebugInfo(`Fetch test - Status: ${response.status}, Response: ${responseText}`);
      
      if (response.ok) {
        toast.success('Plain fetch test passed!');
      } else {
        toast.error('Plain fetch test failed');
      }
    } catch (error) {
      console.error('Plain fetch test failed:', error);
      setDebugInfo('Plain fetch test failed: ' + error.message);
      toast.error('Plain fetch test failed');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Notification System Debug</h2>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={testAuth}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Test Authentication
        </button>
        
        <button
          onClick={testEndpoint}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-2"
        >
          Test Notifications Endpoint
        </button>
        
        <button
          onClick={testPlainFetch}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 ml-2"
        >
          Test Plain Fetch
        </button>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Debug Information:</h3>
        <pre className="text-sm whitespace-pre-wrap">{debugInfo}</pre>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h4 className="font-semibold text-yellow-800">Instructions:</h4>
        <p className="text-sm text-yellow-700 mt-1">
          1. Make sure you're logged in as an admin user<br/>
          2. Check that the backend server is running on port 8080<br/>
          3. Verify the notification endpoints are properly registered<br/>
          4. Check browser console for additional error details
        </p>
      </div>
    </div>
  );
};

export default NotificationDebug;