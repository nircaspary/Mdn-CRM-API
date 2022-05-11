import jwtDecode from 'jwt-decode';
import { get, post } from './Http';

class Auth {
  async login(id, password) {
    const { data } = await post(`auth/login`, { id, password });
    localStorage.setItem('token', data.token);
  }
  logout() {
    localStorage.clear();
  }

  user() {
    try {
      const jwt = localStorage.getItem('token');
      return jwtDecode(jwt);
    } catch (ex) {
      return null;
    }
  }
}
export default new Auth();
