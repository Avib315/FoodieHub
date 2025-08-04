import axios from 'axios';
import { useEffect, useState, useCallback } from 'react';

// Get base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API || 'http://localhost:3001/api';

const useAxiosRequest = ({url, options = {}}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { 
    method = 'GET', 
    data: requestData = null, 
    headers = {},
    immediate = true,
    baseURL = API_BASE_URL, // Use environment variable as default
    ...axiosConfig 
  } = options;

  const executeRequest = useCallback(async (overrideOptions = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const config = {
        url,
        method,
        baseURL,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
          ...overrideOptions.headers
        },
        ...axiosConfig,
        ...overrideOptions
      };

      // Add data to config based on method
      if (requestData || overrideOptions.data) {
        if (method.toLowerCase() === 'get') {
          config.params = requestData || overrideOptions.data;
        } else {
          config.data = requestData || overrideOptions.data;
        }
      }

      const response = await axios.request(config);
      console.log(data);
      
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError({
        message: errorMessage,
        status: err.response?.status,
        statusText: err.response?.statusText,
        originalError: err
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url, method, requestData, headers, baseURL, axiosConfig]);

  useEffect(() => {
    if (immediate && url) {
      executeRequest();
    }
  }, [executeRequest, immediate, url]);

  const refetch = useCallback((overrideOptions = {}) => {
    return executeRequest(overrideOptions);
  }, [executeRequest]);

  return { 
    data, 
    error, 
    loading, 
    refetch,
    execute: executeRequest
  };
};

// Simplified axios request handler function
const axiosRequestHandler = ({url, method = 'GET', data = null, headers = {}}) => {
  const config = {
    baseURL: API_BASE_URL, // Use environment variable
    url,
    method: method.toLowerCase(),
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };


  if (data) {
    if (method.toLowerCase() === 'get') {
      config.params = data;
    } else {
      config.data = data;
    }
  }

  return axios.request(config);
};

// Export both the hook and the handler
export { useAxiosRequest, axiosRequestHandler };
export default useAxiosRequest;