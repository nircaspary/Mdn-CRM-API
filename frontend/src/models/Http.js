import axios from 'axios';

axios.defaults.headers.common['x-auth-token'] = localStorage.getItem('token');
const baseURL = '/api/v1/';
export const post = async (URL, data) => await axios.post(baseURL + URL, data);
export const get = async (URL) => await axios.get(baseURL + URL);
export const put = async (URL, data) => await axios.put(baseURL + URL, data);
export const patch = async (URL, data) => await axios.patch(baseURL + URL, data);
export const deleteItem = async (URL) => await axios.delete(baseURL + URL);
