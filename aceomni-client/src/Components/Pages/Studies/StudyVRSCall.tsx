import React, { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import './StudyVRSCall.css';

interface Props {
  selfStreamRef: any, // TODO get type
  remoteStreamRef: any, // TOTO get type
}

/**
 * Study VRS call experiment shows both remote and self camera
 * video views
 * @param selfStreamRef - webcam video ref for self
 * @param remoteStreamRef - webcam video ref for caller
 * @returns Study VRS view
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
function StudyVRSCall(_props: Props) {
  const { experimentName, selfStreamRef, remoteStreamRef } = useParams();

  // On every render, useEffect print out experiment name
  useEffect(() => {
    console.log(experimentName); // printing this so the linter doesn't complain
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On selfStreamRef changes, print selfStreamRef
  useEffect(() => {
    console.log(`SAW NEW STREAM ${selfStreamRef}`);
  }, [selfStreamRef]);

  return (
    <Container
      fluid
      no-gutters="true"
      style={{
        padding: '0', width: '100%'
      }}
      className="main-container"
    >
      <Container
        fluid
        className="vrs-container"
      >
        <Row className="vrs-container">
          <Col className="self-view-box">
            <video
              style={{ outline: 'black solid 2px' }}
              className="self-view-video"
              ref={selfStreamRef}
              autoPlay
            >
              <track kind="captions" />
            </video>
          </Col>
          <Col className="remote-view-box">
            <video
              style={{ outline: 'black solid 2px' }}
              className="remote-view-video"
              ref={remoteStreamRef}
              autoPlay
            >
              <track kind="captions" />
            </video>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default StudyVRSCall;
