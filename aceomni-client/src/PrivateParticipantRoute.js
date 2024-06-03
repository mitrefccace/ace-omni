import React from 'react';
import { Navigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
function PrivateParticipantRoute({ children }) {
  const authed = (sessionStorage.getItem('omniParticipantAuthenticated') === 'true'); // isauth() returns true or false based on sessionStorage

  return authed ? children : <Navigate to="/login" />;
}

export default PrivateParticipantRoute;
