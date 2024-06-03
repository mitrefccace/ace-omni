import React from 'react';
import { useNavigate } from 'react-router-dom';
import ADSButton from '../ADSButton';

import './NavigationBar.css';

function NavigationBar() {
  const navigate = useNavigate();

  function Logout() {
    navigate('/login');
  }

  return (
    <div style={{
      backgroundColor: '#073863',
      paddingLeft: '0',
      paddingRight: '0',
      height: '60px',
      position: 'relative',
      minWidth: '1000px'
    }}
    >
      <span className="h2 banner">ACE Omni Research Portal</span>
      {/* TODO Combine these two elements into a dropdown menu with logout */}
      <span style={{ float: 'right' }}>
        <ADSButton
          onClick={() => { }}
          buttonText={sessionStorage.getItem('omniUsername') || ''}
        />
        <ADSButton
          onClick={() => Logout()}
          buttonText="Logout"
        />
      </span>
    </div>
  );
}

export default NavigationBar;
