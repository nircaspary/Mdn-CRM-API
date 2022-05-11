import React from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';

const NavLink = ({ text, path, icon }) => {
  const location = useLocation().pathname;
  const history = useHistory();
  const onClick = () => {
    if (location === path) return;
    history.push(path);
  };
  return (
    <li className="nav-item" onClick={onClick}>
      <i className={`fas fa-${icon}`} />
      {text}
    </li>
  );
};
export default NavLink;
