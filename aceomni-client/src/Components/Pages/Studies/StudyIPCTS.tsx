import React, { useEffect, useRef, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io-client';
import ADSFullWidthDivider from '../../ADSFullWidthDivider';
import './StudyIPCTS.css';

interface Props {
  height: any,
  socketRef: Socket
}

/**
 *  Study IPCTS experiment call shows chat window with no chatbar configurations
 * @param height - responsive height changes for the chat window
 * @param socketRef - socket used for webRTC signaling
 * @returns Study IPCTS view
 */
function StudyIPCTS(props: Props) {
  const { experimentName } = useParams();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [hasConvoStarted, setHasConvoStarted] = useState(false);
  const { height, socketRef } = props;
  const [captionsHeight, setCaptionsHeight] = useState(height);
  const [captionArray, setCaptionArray] = useState<any[]>([]);
  const containerHeaderRef = useRef<HTMLDivElement>(null);
  const captionArrayRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  // Calculate chat window height for IPCTS when height changes
  useEffect(() => {
    // TODO Add logic to pull study configuration
    console.log(experimentName); // printing this so the linter doesn't complain
    const containerHeaderHeight = containerHeaderRef?.current?.clientHeight || 0;

    // Container header height is always 72px
    const captionsContainerHeight = height - 72 - containerHeaderHeight;
    setCaptionsHeight(captionsContainerHeight);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height]);

  // Trigger due to any changes with socketRef prop
  useEffect(() => {
    /**
     * Caption function used to display and collect caption data
     * @param {any} captionData
     * @param {boolen} update
     */
    function caption(captionData: any, update: boolean = false) {
      if (update) captionArray.pop();
      captionArray.push(
        <Col sm={12} key={captionData.msgid} ref={captionArrayRef}>
          <div className="subtitle2 caption-speaker">{captionData.speakerName}:</div>
          <div className="body1 caption-content" id={captionData.msgid}>{captionData.transcript}</div>
        </Col>
      );

      const tempArray = [...captionArray];
      setCaptionArray(tempArray);
      captionArrayRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    /**
     * insertDivider is function to divide captions for readability
     * @param {any}
     */
    function insertDivider() {
      captionArray.push(
        <Col sm={12} style={{ paddingBottom: '16px', paddingTop: '16px', height: '32px' }} key={Math.random()} ref={dividerRef}>
          <ADSFullWidthDivider />
        </Col>
      );
      const tempArray = [...captionArray];
      setCaptionArray(tempArray);
      dividerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    socketRef.on('caption-data', (data: any) => {
      if (!hasConvoStarted) setHasConvoStarted(true);
      const element = document.getElementById(data.msgid);
      if (element) {
        caption(data, true);
        if (data.final) {
          insertDivider();
        }
      } else {
        caption(data, false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketRef]);

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
          // Conversation started and captions are loaded
          <Container
            fluid
            no-gutters="true"
            className="align-items-end captions-container"
            style={{
              padding: '0', height: `${captionsHeight}px`, display: 'flex'
            }}
          >
            <Row
              style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingBottom: '24px',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'end'
              }}
            >
              <Col sm={12} id="captionArrayCol" style={{ maxHeight: '100%', overflow: 'auto' }}>
                {captionArray}
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

export default StudyIPCTS;
