/* eslint-disable react/jsx-closing-tag-location */
import React, { } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Step8() {
  const step8style = {
    display: 'flex',
    flexDirection: 'column' as 'column'
  };

  return (
    <Container no-gutters="true" fluid style={{ paddingLeft: '0' }}>
      <Row style={{ paddingBottom: '40px' }}>
        <Col className="body2">
          <div style={step8style}>
            <span>
              <b>Step 8</b> of 8: Review your Study Summary and ensure everything is accurate.
              You may also review sequence and group details, if entered.
              Please click <b>Finish & Save</b> button at the bottom to complete your study.
            </span>
            <span>
              The Review Study Summary page is not yet implemented.
            </span>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Step8;
