import React from 'react';
import {
  Button,
  Container,
  Row, Col
} from 'react-bootstrap';

import './ADSAlphanumericDialPad.css';

/**
 * Returns an ADS Alphanumeric Dial Pad
 *
 * @param background - 'dark' | 'none' (default: none)
 * @param numPressed - Function that handles number presses
 *                     (event: React.FormEvent<HTMLButtonElement>, digit: string)
 *
 * @returns ADS Alphanumeric Dial Pad
 */
export default function ADSAlphanumericDialPad(props: {
  background?: 'dark' | 'none';
  numPressed: Function;
}) {
  const {
    background,
    numPressed
  } = props;

  const buttonListElements: any[] = [];

  const buttonData = [
    { top: '1', bottom: '' },
    { top: '2', bottom: 'ABC' },
    { top: '3', bottom: 'DEF' },
    { top: '4', bottom: 'GHI' },
    { top: '5', bottom: 'JKL' },
    { top: '6', bottom: 'MNO' },
    { top: '7', bottom: 'PQRS' },
    { top: '8', bottom: 'TUV' },
    { top: '9', bottom: 'WXYZ' },
    { top: '*', bottom: '' },
    { top: '0', bottom: '+' },
    { top: '#', bottom: '' }
  ];

  // Create button for dial pad
  buttonData.forEach((item) => {
    buttonListElements.push(
      <Col xs={4} key={item.top}>
        <Button
          variant="secondary"
          className={`alphanumericdialpad-button btn alphanumericdialpad-button-${background}`}
          onClick={(event) => numPressed(event, item.top)}
        >
          <span className="alphanumericdialpad-digit">{item.top}</span><br />
          {item.bottom}&nbsp;
        </Button>
      </Col>
    );
  });

  return (
    <Container>
      <Row>
        <Col />
        <Col className={`main-col main-col-${background}`}>
          <Row className="alphanumericdialpad-row">
            {buttonListElements}
          </Row>
        </Col>
        <Col />
      </Row>
    </Container>
  );
}

ADSAlphanumericDialPad.defaultProps = {
  background: 'none'
};
