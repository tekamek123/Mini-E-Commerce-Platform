import axios from 'axios';
import { toast } from 'sonner';

// Create a configured Axios instance
const apiClient = axios.create({
  // Fallback to FakeStore API if env var is missing
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://fakestoreapi.com',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can attach authorization tokens here if communicating with a custom backend.
    // (Note: Supabase handles auth via SSR cookies natively in our setup)
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error) => {
    // Standardize and extract error messages globally
    const message =
      error.response?.data?.message || error.message || 'An unexpected API error occurred';

    // Display error toast if running on the client side
    if (typeof window !== 'undefined') {
      toast.error(message);
    }

    // Reject the promise so calling functions can handle it as well
    return Promise.reject(error);
  },
);

export default apiClient;
