import React, { } from 'react';
import {
  Container, Row, Col
} from 'react-bootstrap';

function Step5() {
  return (
    <Container
      no-gutters="true"
      fluid
      style={{ paddingLeft: '0' }}
    >
      <Row style={{ paddingBottom: '20px' }}>
        <Col className="body2">
          <b>Step 5</b> of 8:
          <span>
            &nbsp;Once you have configured all modules,
            review your configurations for accuracy.
          </span>
        </Col>
      </Row>
      <Row>
        The Review Configurations page is not yet implemented.
      </Row>
    </Container>
  );
}

export default Step5;
