import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import './ADSAccordion.css';

interface Props {
  children: any;
  defaultActiveKeys?: any;
}

/**
 * Returns an ADS Accordion
 *
 * @param children - Contents of accordion
 * @returns Accordion
 */
function ADSAccordion({
  children, defaultActiveKeys
}: Props) {
  return (
    <Accordion alwaysOpen defaultActiveKey={defaultActiveKeys}>
      {children}
    </Accordion>
  );
}
ADSAccordion.defaultProps = {
  defaultActiveKeys: null
};

export default ADSAccordion;
