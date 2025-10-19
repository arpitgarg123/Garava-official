import axios from '../../shared/api/http';

/**
 * Subscribe to newsletter
 */
export const subscribeToNewsletter = async (email) => {
  const { data } = await axios.post('/newsletter/subscribe', { email });
  return data;
};

/**
 * Unsubscribe from newsletter
 */
export const unsubscribeFromNewsletter = async (email) => {
  const { data } = await axios.post('/newsletter/unsubscribe', { email });
  return data;
};

/**
 * List newsletter subscribers (Admin only)
 */
export const listNewsletterSubscribers = async ({ page = 1, limit = 20, status = '' }) => {
  const params = new URLSearchParams();
  params.append('page', page);
  params.append('limit', limit);
  if (status) params.append('status', status);
  
  const { data } = await axios.get(`/newsletter/admin?${params.toString()}`);
  return data;
};
