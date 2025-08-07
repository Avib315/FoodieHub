import { useState, useEffect } from 'react';
import axiosRequest from './axiosRequest';

const useApiRequest = (
  { url,
    method = "GET",
    body,
    defaultValue = null,
    dependencies = [],
    errorMessage = null }
) => {

  const [data, setData] = useState(defaultValue);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axiosRequest({
          url: `${url}`,
          method,
          body: body
        });
        
        console.log('API Response:', response);
        
        if (response?.data?.success) {
          const responseData = response.data.data;
          setData(responseData);
        } else {
          // Handle unsuccessful response
          const errorMsg = response?.data?.message || errorMessage || 'Unknown error occurred';
          setError(errorMsg);
          console.error('API Error:', errorMsg);
        }
      } catch (err) {
        const errorMsg = err.message || errorMessage || 'Network error occurred';
        setError(errorMsg);
        console.error('Request Error:', err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [url, method, JSON.stringify(body), JSON.stringify(dependencies), errorMessage]);

  return { setData, data, loading, error };
};

export default useApiRequest;