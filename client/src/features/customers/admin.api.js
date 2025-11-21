import { authHttp } from "../../shared/api/http";

/**
 * Customer Admin API Integration
 * All endpoints require admin authentication
 */

// List all customers with pagination and filters
export const listCustomersAdmin = (params = {}) => {
  const { page = 1, limit = 20, search, orderCountMin, orderCountMax, newsletter } = params;
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  if (search) queryParams.append('search', search);
  if (orderCountMin !== undefined) queryParams.append('orderCountMin', orderCountMin.toString());
  if (orderCountMax !== undefined) queryParams.append('orderCountMax', orderCountMax.toString());
  if (newsletter !== undefined) queryParams.append('newsletter', newsletter.toString());
  
  return authHttp.get(`/admin/customers?${queryParams.toString()}`);
};

// Get customer statistics
export const getCustomerStats = () => {
  return authHttp.get('/admin/customers/stats');
};

// Get customer by ID for admin
export const getCustomerByIdAdmin = (customerId) => {
  return authHttp.get(`/admin/customers/${customerId}`);
};

// Helper function to format customer data for CSV export
export const formatCustomersForCSV = (customers) => {
  return customers.map(customer => ({
    Name: customer.name || 'N/A',
    Email: customer.email || 'N/A',
    Phone: customer.phone || 'N/A',
    'Total Orders': customer.totalOrders || 0,
    'Total Spent (₹)': customer.totalSpent ? customer.totalSpent.toFixed(2) : '0.00',
    'Last Order Date': customer.lastOrderDate 
      ? new Date(customer.lastOrderDate).toLocaleDateString() 
      : 'N/A',
    'Registration Date': customer.createdAt 
      ? new Date(customer.createdAt).toLocaleDateString() 
      : 'N/A',
    'Newsletter Subscriber': customer.isNewsletterSubscriber ? 'Yes' : 'No',
    'Verified': customer.isVerified ? 'Yes' : 'No'
  }));
};

// Helper function to convert customers array to CSV string
export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Add header row
  csvRows.push(headers.join(','));
  
  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escaped = String(value).replace(/"/g, '""');
      return escaped.includes(',') ? `"${escaped}"` : escaped;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
};

// Helper function to download CSV file
export const downloadCSV = (csvString, filename = 'customers.csv') => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
