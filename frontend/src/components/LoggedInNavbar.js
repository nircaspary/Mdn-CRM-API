import React from 'react';
import NavLink from './common/NavLink';
import auth from '../models/Auth';
const LoggedInNavbar = () => {
  return (
    <>
      <NavLink text="Faults" path="/admins/faults" icon="wrench" />
      {auth.user().role === 'admin' ? <NavLink text="Users" path="/admins/users" icon="user" /> : null}
      <NavLink text="My Profile" path="/admins/users/my-profile" icon="id-badge" />
      <NavLink text="Logout" path="/logout" icon="sign-out-alt" />
    </>
  );
};
export default LoggedInNavbar;
