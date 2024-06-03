import React, { useEffect, useRef, useState } from 'react';
import {
  Col, Container, Row, Form
} from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ADSButton from '../../ADSButton';
import ADSFullWidthDivider from '../../ADSFullWidthDivider';
import './StudyIPCTS.css';
import './StudyIPRelay.css';

/**
 * Study IPRelay experiment call shows chat window with chatbar configurations
 * @returns Study IPRelay view
 */
function StudyIPRelay() {
  const { experimentName } = useParams();
  const [hasConvoStarted, setHasConvoStarted] = useState(true);
  const [chatHeight, setChatHeight] = useState(0);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const containerHeaderRef = useRef<HTMLDivElement>(null);

  const textareaRef = useRef(document.createElement('textarea'));
  const [dynamicText, setDynamicText] = useState('');
  const [chatHeightMargin, setMargin] = useState('');

  // On every render, useEffect sets the study chat window height
  useEffect(() => {
    console.log(experimentName); // printing this so the linter doesn't complain

    // Set caption height on page load
    const parentContainerHeight = mainContainerRef?.current?.clientHeight || 0;
    const containerHeaderHeight = containerHeaderRef?.current?.clientHeight || 0;
    // Get chat container height excluding headers and container header height is always 72px
    // On render set container height
    const captionsContainerHeight = parentContainerHeight - 72 - containerHeaderHeight;
    setChatHeight(captionsContainerHeight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * handleResize sets height of the study pages specifically dealing with the
   * responsiveness of the study chat window
   * @param {any}
   */
  function handleResize() {
    // Each time the browser window resizes the height of chat container will be set
    const parentContainerHeight = mainContainerRef?.current?.clientHeight || 0;
    const containerHeaderHeight = containerHeaderRef?.current?.clientHeight || 0;

    // Set chat window height margin spacing based on text area height
    const { scrollHeight } = textareaRef.current;
    const convertHeightToInt = (scrollHeight >= 200) ? 228 : parseFloat(((textareaRef.current.style.height).split('px')[0]));
    // eslint-disable-next-line max-len
    const chatWindowHeight = parentContainerHeight - containerHeaderHeight - convertHeightToInt;
    setChatHeight(chatWindowHeight);
  }

  // Triggers when dynamicText (chat input textFeild) is updated
  // Adjusts chat input textField height
  useEffect(() => {
    // Event handler for any change in dynamicText from multiline textfeild
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = '0px';
      const { scrollHeight } = textareaRef.current;
      textareaRef.current.style.height = `${scrollHeight}px`;

      // Text feild max height is 200px so set the chat window to have margin-bottom 200px
      if (scrollHeight >= 200) {
        setMargin('228');
      } else {
        // Pass string of the height of the textfield
        setMargin(`${scrollHeight}`);
      }
    }
  }, [dynamicText]);

  // Handle resize events on render
  React.useEffect(() => {
    // Event listener for handling resize of the browser window
    window.addEventListener('resize', handleResize, false);
    setHasConvoStarted(true);
  }, []);

  const handleDynamicChange = (e: any) => {
    setDynamicText(e.target.value);
  };

  return (
    <Container
      fluid
      ref={mainContainerRef}
      className="IPrelay-Container"
    >
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
            className="align-items-end"
            style={{
              position: 'absolute', height: '100%', bottom: '0', padding: '0'
            }}
          >
            <Row
              className="chatWindowStyle"
              style={{
                maxHeight: `${chatHeight}px`, marginBottom: `${chatHeightMargin}px`
              }}
            >
              <div>
                <Col sm={12} style={{ paddingBottom: '16px', paddingTop: '16px' }}>
                  <ADSFullWidthDivider />
                </Col>
                <Col sm={12}>
                  <div className="subtitle2 caption-speaker">
                    John Doe:
                  </div>
                  <div className="body1 caption-content">
                    Hi Kiwi. Is this going through?
                  </div>
                </Col>
                <Col sm={12} style={{ paddingBottom: '16px', paddingTop: '16px' }}>
                  <ADSFullWidthDivider />
                </Col>
                <Col sm={12}>
                  <div className="subtitle2 caption-speaker">
                    Me:
                  </div>
                  <div className="body1 caption-content">
                    Good morning, John Doe.
                  </div>
                  <div className="body1 caption-content">
                    Yes, it is. How are you doing?
                  </div>
                </Col>
                <Col sm={12} style={{ paddingBottom: '16px', paddingTop: '16px' }}>
                  <ADSFullWidthDivider />
                </Col>
              </div>
            </Row>
            {/* Chat input text field */}
            <Row style={{ position: 'absolute', bottom: '0', width: '100%' }}>
              <Col sm={12} style={{ display: 'flex' }}>
                <div className="messageBar">
                  <Form className="expand-up-container">
                    <Form.Group className="mx-auto expand-up-form-group">
                      <Form.Control
                        ref={textareaRef}
                        className="textarea"
                        as="textarea"
                        type="text"
                        placeholder="Type a new message"
                        id="id60"
                        style={{ height: '40px', maxHeight: '200px' }}
                        onChange={handleDynamicChange}
                      />
                    </Form.Group>
                  </Form>
                </div>
                <div style={{ paddingTop: '8px', paddingRight: '24px' }}>
                  <ADSButton variant="secondary" buttonText="Send" onClick={() => null} /> {/* add on click function */}
                </div>
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

export default StudyIPRelay;
