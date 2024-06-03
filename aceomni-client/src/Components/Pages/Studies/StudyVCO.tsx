import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ADSFullWidthDivider from '../../ADSFullWidthDivider';
import './StudyIPCTS.css';

/**
 * Study VCO experiment call shows basic chat container configuration
 * @param height - responsive height changes for the chat window
 * @returns Study VCO view
 */
function StudyVCO(props: { height: any }) {
  const { experimentName } = useParams();
  const [hasConvoStarted, setHasConvoStarted] = useState(true);
  const { height } = props;
  const [captionsHeight, setCaptionsHeight] = useState(height);
  const containerHeaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(experimentName); // printing this so the linter doesn't complain
    const containerHeaderHeight = containerHeaderRef?.current?.clientHeight || 0;

    // Container header height is always 72px
    const captionsContainerHeight = height - 72 - containerHeaderHeight;
    setCaptionsHeight(captionsContainerHeight);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  /**
   * handleResize sets height of the study pages specifically dealing with the
   * responsiveness of the study chat window
   * @param {any}
   */
  function handleResize() {
    const containerHeaderHeight = containerHeaderRef?.current?.clientHeight || 0;
    // Container header height is always 72px
    const captionsContainerHeight = height - 72 - containerHeaderHeight;
    setCaptionsHeight(captionsContainerHeight);
  }

  // Handle resize events on render
  React.useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    // Manualy set to avoid linting error for time being
    setHasConvoStarted(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      {/* Date and Time */}
      <Row
        ref={containerHeaderRef}
        className="container-header"
        style={{
          paddingTop: '8px', paddingBottom: '12px', paddingLeft: '24px', paddingRight: '24px'
        }}
      >
        <Col>
          <div className="body2 date-time">
            20 March 2023
          </div>
          <div className="body2 date-time">
            12:00 PM
          </div>
        </Col>
      </Row>
      {hasConvoStarted
        ? (
          <Container
            fluid
            no-gutters="true"
            className="align-items-end captions-container"
            style={{
              padding: '0', height: `${captionsHeight}px`, display: 'flex'
            }}
          >
            {/* To add new captions, add Cols to this row */}
            <Row
              style={{
                paddingLeft: '24px', paddingRight: '24px', paddingBottom: '24px', width: '100%'
              }}
            >
              <Col sm={12} style={{ paddingBottom: '16px', paddingTop: '16px' }}>
                <ADSFullWidthDivider />
              </Col>
              <Col sm={12}>
                <div className="subtitle2 caption-speaker">
                  John Doe
                </div>
                <div className="body1 caption-content">
                  That is great to hear. Last I heard from you you were in California with RIT.
                  You know speaking of RIT, I was talking to the RIT research team nad they have
                  a great connection with the MITRE team.
                </div>
              </Col>
              <Col sm={12} style={{ paddingBottom: '16px', paddingTop: '16px' }}>
                <ADSFullWidthDivider />
              </Col>
            </Row>
          </Container>
        )
        : (
          // Conversation hasn't started
          <Row style={{ paddingLeft: '24px', paddingRight: '24px' }}>
            <Col className="body2 captions-placeholder">
              [ASR Captions will begin once the conversation has initiated.]
            </Col>
          </Row>
        )}
    </Container>
  );
}

export default StudyVCO;
