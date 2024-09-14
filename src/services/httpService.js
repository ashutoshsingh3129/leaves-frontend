import axios from 'axios';

// Create an Axios instance
const http = axios.create({
  baseURL: 'http://localhost:5000', // Backend URL (port 5000)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to handle authentication, headers, etc.
http.interceptors.request.use(
  (config) => {
    // You can add tokens, authorization headers, etc., here
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Add a response interceptor to format responses and handle errors globally
http.interceptors.response.use(
  (response) => {
    // Format all responses uniformly
    console.log("rr",response)
    return {
      statusCode: response.status,
      data: response.data.data,
      message: response.data.message,
      error: response.error,
    };
  },
  (error) => {
    // Global error handling
    console.error(error)
    if (error.response) {
      // Server-side error
      return Promise.reject({
        statusCode: error.response.status,
        message: error.response.data.message || 'Something went wrong',
        error: error.response.data.error || 'Server Error',
      });
    } else if (error.request) {
      // No response from server
      return Promise.reject({
        message: 'No response from server',
        error: error.message,
      });
    } else {
      // Something else went wrong
      return Promise.reject({
        message: 'Request error',
        error: error.message,
      });
    }
  }
);

export default http;
