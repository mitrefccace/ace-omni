import React, { } from 'react';

import './ADSFontSizeButtons.css';

/**
 * @returns ADS Font Size Button
 */
export default function ADSButton() {
  // TODO Add functionality
  return (
    <div className="font-size-container">
      <div className="btn-group" style={{ display: 'flex', height: '40px' }}>
        <button
          type="button"
          className="btn fontSizeButtons"
          style={{ fontSize: '14px' }}
          onClick={() => null}
          aria-label="Decrease font size by 10%"
        >A
        </button>
        <button
          type="button"
          className="btn currentFontSize body1"
          aria-label="Current font size"
          aria-live="assertive"
        >100%
        </button>
        <button
          type="button"
          className="btn fontSizeButtons"
          style={{ fontSize: '23px' }}
          onClick={() => null}
          aria-label="Increase font size by 10%"
        >A
        </button>
      </div>
    </div>
  );
}
