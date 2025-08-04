import { useState, useEffect } from 'react';
import { axiosRequest } from './axiosRequest';


const useApiRequest = (
  { url,
    method = "GET",
    body,
    defaultValue = null,
    dependencies = [],
    errorMessage = null }
) => {

  const [data, setData] = useState(defaultValue);
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axiosRequest({
          url: `${url}`,
          method,
          body:body
        });
        if (response?.success) {
          if (response?.data?.$values) {
            setData(response.data.$values);
          }
          else {
            setData(response.data);
          }
        }
        else {
          if (errorMessage) {
          }
        }
      } catch (err) {
      }
    };

    getData();
  }, dependencies);

  return { setData, data };
};

export default useApiRequest;
