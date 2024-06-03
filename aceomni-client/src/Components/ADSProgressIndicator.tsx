import React from 'react';
import ProgressBar from 'react-bootstrap/ProgressBar';
import './ADSProgressIndicator.css';

/**
 * Progress indicator used in file upload
 * @param ariaLabel - Label of indicator
 * @param color - color of indicator
 * @param height - Height of progress indicator
 * @param isDeterminate - true | false - optional prop to show stationary or moving indicator
 * @param progress - Optional prop to identify the current progress. Default 0
 * @returns Progress Indicator
 */

function ADSProgressIndicator(props: {
  ariaLabel: string;
  color: string;
  height: string;
  isDeterminate?: boolean;
  progress?: number;
}) {
  const {
    ariaLabel, color, height, isDeterminate, progress
  } = props;

  if (isDeterminate) {
    return (
      <div className={`progress ${height} ${color === 'orange' ? 'ADS_Orange' : 'ADS_Blue'}`}>
        <ProgressBar
          aria-label={ariaLabel}
          isChild
          now={progress}
        />
      </div>
    );
  }
  return (
    <div className={`progress indeterminate ${height} ${color === 'orange' ? 'ADS_Orange' : 'ADS_Blue'}`}>
      <ProgressBar
        aria-label={ariaLabel}
        isChild
      />
    </div>
  );
}

ADSProgressIndicator.defaultProps = {
  isDeterminate: false,
  progress: 0
};

export default ADSProgressIndicator;
