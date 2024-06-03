import React, { } from 'react';
import {
  Container, Row, Col
} from 'react-bootstrap';

function Step6() {
  return (
    <Container
      no-gutters="true"
      fluid
    >
      <Row style={{ paddingBottom: '20px' }}>
        <Col className="body2">
          <span style={{ padding: '0' }}>
            <b>Step 6</b> of 8: Organize your configured modules into an order or sequence
            for your study by highlighting a module and using the up/down arrows to place it
            in the order you want.
          </span>
        </Col>
      </Row>
      <Row>
        The Define Study Sequence page is not yet implemented.
      </Row>
    </Container>
  );
}

export default Step6;
