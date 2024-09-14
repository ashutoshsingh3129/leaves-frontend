import axios from 'axios';
import { toast } from 'react-toastify';

const http = axios.create({
  baseURL: 'https://leave-backend-pmza.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => {
    const customStatusCode = response.data?.statusCode ?? response.status;

    return {
      statusCode: customStatusCode,
      data: response.data.data,
      message: response.data.message,
      error: response.data.error || null,
    };
  },
  (error) => {
    if (error.response) {
      const errorMessage = error.response.data.message || 'An error occurred';
      toast.error(errorMessage);
      return Promise.reject({
        statusCode: error.response.status,
        message: errorMessage,
        error: error.response.data.error || 'Server Error',
      });
    } else if (error.request) {
      toast.error('No response from server');
      return Promise.reject({
        message: 'No response from server',
        error: error.message,
      });
    } else {
      toast.error('Request error');
      return Promise.reject({
        message: 'Request error',
        error: error.message,
      });
    }
  }
);

export default http;
