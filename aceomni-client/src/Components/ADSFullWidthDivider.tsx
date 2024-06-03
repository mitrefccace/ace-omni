import React from 'react';
import Divider from '@mui/material/Divider';
import './ADSFullWidthDivider.css';
import '../global_colors.css';

/**
 * Creates a Full Width Divider
 *
 * @returns ADS Full Width Divider
 */

function ADSFullWidthDivider() {
  return (
    <div className="dividerPadding">
      <Divider
        variant="fullWidth"
        className="fullWidth"
        sx={{
          borderStyle: 'none',
          opacity: '1'
        }}
      />
    </div>
  );
}

export default ADSFullWidthDivider;
