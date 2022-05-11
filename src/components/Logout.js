import { useHistory } from 'react-router-dom';
import auth from '../models/Auth';

const Logout = () => {
  const history = useHistory();
  auth.logout();
  history.replace('/login');

  return null;
};
export default Logout;
