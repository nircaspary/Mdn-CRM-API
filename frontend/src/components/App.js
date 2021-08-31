import { React } from 'react';
import { Route, Switch } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import { ProtectedRoute } from '../models/ProtectedRoutes';
import Navbar from './Navbar';
import Form from './Form';
import ForgotPasswordAuth from './ForgotPasswordAuth';
import ForgotPassword from './ForgotPassword';
import ChangePassword from './ChangePassword';
import Login from './Login';
import Logout from './Logout';
import CreateUser from './CreateUser';
import Admins from './Admins';
import UserProfile from './UserProfile';
import FaultPage from './FaultPage';
import NotFound from './common/404';
import DeleteItem from './common/DeleteItem';
import ForgotPassRes from './ForgotPassRes';
import './css/app.css';

const App = () => {
  return (
    <div className="ui container">
      <Route path="/" component={Navbar} />
      <div className="ui form-container">
        <Switch>
          <Route exact path="/" component={Form} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/login/forgot-password/auth/:id" component={ForgotPasswordAuth} />
          <Route exact path="/login/forgot-password" component={ForgotPassword} />
          <Route exact path="/login/forgot-password-sent" component={ForgotPassRes} />
          <ProtectedRoute exact path="/logout" component={Logout} />
          <ProtectedRoute exact path="/admins/faults" component={Admins} />
          <ProtectedRoute exact path="/admins/faults/:id" component={FaultPage} />
          <ProtectedRoute exact path="/admins/create-user" component={CreateUser} isAdmin />
          <ProtectedRoute exact path="/admins/users" component={Admins} isAdmin />
          <ProtectedRoute exact path="/admins/users/delete/:id" component={DeleteItem} />
          <ProtectedRoute exact path="/admins/faults/delete/:id" component={DeleteItem} />
          <ProtectedRoute exact path="/admins/users/change-password" component={ChangePassword} />
          <ProtectedRoute exact path="/admins/users/:id" component={UserProfile} />
          <Route path="/:id" component={NotFound} />
        </Switch>
      </div>
    </div>
  );
};
export default App;
