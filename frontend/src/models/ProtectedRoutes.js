import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import auth from './Auth';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return !rest.isAdmin ? (
    <Route {...rest} render={(props) => (auth.user() ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />)} />
  ) : (
    <Route
      {...rest}
      render={(props) => (auth.user() && auth.user().role === 'admin' ? <Component {...props} /> : <Redirect to={{ pathname: '/' }} />)}
    />
  );
};
