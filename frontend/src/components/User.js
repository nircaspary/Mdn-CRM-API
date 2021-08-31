import React, { useState } from 'react';
import { useHistory } from 'react-router';
import auth from '../models/Auth';
import './css/user.css';

const User = ({ user: u }) => {
  const history = useHistory();
  const [user] = useState(u);
  const handleDoubleClick = () => (auth.user().id !== user.id ? history.push(`/admins/users/${user.id}`) : history.push(`/admins/users/my-profile`));

  return (
    <div className="ui styled fluid accordion">
      <div className="table-row ui title" onDoubleClick={handleDoubleClick} style={{ cursor: 'pointer' }}>
        <div className="cell">{user.id}</div>
        <div className="cell">{`${user.firstName} ${user.lastName}`}</div>
        <div className="cell">{user.email}</div>
        <div className="cell">{user.role}</div>
        <div className="cell">
          {user.location.building}
          <br />
          Floor
          {` ${user.location.floor}`}
          <br />
          Room
          {` ${user.location.roomNumber}`}
        </div>
        <div className="cell">{user.officePhone}</div>
        <div className="cell">{user.cellPhone}</div>
      </div>
    </div>
  );
};
export default User;
