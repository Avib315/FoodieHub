import { useState, useEffect } from 'react';
import axiosRequest  from './axiosRequest';


const useApiRequest = (
  { url,
    method = "GET",
    body,
    defaultValue = null,
    dependencies = [],
    errorMessage = null }
) => {

  const [data, setData] = useState(defaultValue);
  const[loading , setLoading] = useState()
  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true)
        const response = await axiosRequest({
          url: `${url}`,
          method,
          body:body
        });
        
        if (response?.data?.success) {
          const data = response.data.data
          console.log(response);
          
          if (response?.data) {
            setData(data);
          }
        }
        else {
          if (errorMessage) {
            console.log(errorMessage)
          }
        }
      } catch (err) {
      }
      finally{
        setLoading(false)
      }
    };
getData()
  }, dependencies);

  return { setData, data , loading };
};

export default useApiRequest;
