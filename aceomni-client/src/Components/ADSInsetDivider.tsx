import React from 'react';
import Divider from '@mui/material/Divider';
import './ADSInsetDivider.css';
import '../global_colors.css';

/**
 * Creates an Inset Divider
 *
 * @returns ADS Inset Divider
 */

function ADSInsetDivider() {
  return (
    <div className="dividerPadding">
      <Divider
        variant="middle"
        className="inset"
        sx={{
          borderStyle: 'none',
          opacity: '1'
        }}
      />
    </div>
  );
}

export default ADSInsetDivider;
