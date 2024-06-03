import React, { useState } from 'react';
import './ADSTooltip.css';

/**
 * Returns a Tooltip
 *
 * @param delay - Milliseconds of hover before tooltip appears
 * @param children - Reference element where tooltip will appear
 * @param placement - top | bottom | right | left (default: top)
 * @param content - Text of the tooltip
 *
 * @returns Tooltip
 */

function ADSTooltip(props: {
  delay?: number;
  children?: any;
  placement?: 'top' | 'bottom' | 'right' | 'left';
  content?: string;
}) {
  let timeout: any;
  const [active, setActive] = useState(false);
  const {
    delay, children, placement, content
  } = props;

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, delay || 400);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div
      className="Tooltip-Wrapper"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div className={`Tooltip-Tip ${placement || 'bottom'}`}>
          {content}
        </div>
      )}
    </div>
  );
}

ADSTooltip.defaultProps = {
  delay: 400,
  children: '',
  placement: 'top',
  content: ''
};

export default ADSTooltip;
