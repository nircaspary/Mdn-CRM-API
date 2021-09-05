import { useState, useEffect } from 'react';
import * as Http from '../models/Http';

export const useFetch = (url, ...rest) => {
  const [data, setData] = useState({});
  const [isPending, setIsPending] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    (async () => {
      setIsPending(true);
      setData({});
      errors && setErrors([]);
      try {
        const res = await Http.get(url);
        if (res.data) {
          setIsPending(false);
          setData(res.data.data);
        }
      } catch (err) {
        if (err.response) {
          setIsPending(false);
          setErrors(err.response.data.message);
        }
      }
    })();
  }, [url]);

  return { data, isPending, errors };
};

export default useFetch;
