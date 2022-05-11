import { useState, useEffect, useContext } from 'react';
import { pagesContext } from '../contexts/pagesContext';
import * as Http from '../models/Http';

export const useFetch = (url, ...rest) => {
  const [data, setData] = useState({});
  const [isPending, setIsPending] = useState(true);
  const [errors, setErrors] = useState([]);
  const { setPages } = useContext(pagesContext);

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
          setPages(res.data.data.pages);
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
