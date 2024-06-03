import React from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const authed = (sessionStorage.getItem('omniAuthenticated') === 'true'); // isauth() returns true or false based on sessionStorage

  return authed ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
