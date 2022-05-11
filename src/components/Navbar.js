import { React } from 'react';
import { Route } from 'react-router-dom';
import LoggedInNavbar from './LoggedInNavbar';
import auth from '../models/Auth';
import NavLink from './common/NavLink';
import './css/navbar.css';

const Navbar = () => {
  const user = auth.user();

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <div className="nav-top">
          <li className="logo">{user ? user.role : 'CRM-MADAN'}</li>
          <li className="email">{user ? `ID: ${user.id}` : 'CRM-MADAN'}</li>
        </div>
        <NavLink text="Fault Creation" path="/" icon="file-signature" />
        {user ? <LoggedInNavbar /> : <NavLink text="Admins Login" path="/login" icon="user-shield" />}
      </ul>
    </nav>
  );
};
export default Navbar;
