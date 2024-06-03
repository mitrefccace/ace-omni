import React from 'react';
import { Popover, OverlayTrigger } from 'react-bootstrap';

/**
 * Returns an ADS Popover Element
 *
 * @param placement - the direction of which the popover will display [top, bottom, left or right]
 * @param children - The content to display inside the popover
 * @param trigger - The element to which will trigger the popover (Button, text etc)
 *
 * @returns ADS Popover
 */

function ADSPopover(props: {
  placement: 'top' | 'bottom' | 'right' | 'left';
  children: any;
  trigger: any;
}) {
  const {
    placement, children, trigger
  } = props;

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>
        {children}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger="click"
      placement={placement}
      overlay={popover}
      rootClose
    >
      <div>
        {trigger}
      </div>
    </OverlayTrigger>
  );
}

export default ADSPopover;
