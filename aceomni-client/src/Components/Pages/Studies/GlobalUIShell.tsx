import React, {
  useState, useRef, useEffect, ReactElement
} from 'react';
import {
  faCircle, faMicrophoneAlt, faPhone
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Row, Col } from 'react-bootstrap';
import ADSFontSizeButtons from '../../Components/ADSFontSizeButtons';
import ADSIconButton from '../../ADSIconButton';
import ADSButton from '../../ADSButton';
import StudyIPCTS from './StudyIPCTS';
import StudyVRSCall from './StudyVRSCall';
import './GlobalUIShell.css';
import StudyIPRelay from './StudyIPRelay';
import StudySTSCall from './StudySTSCall';
import StudyVCO from './StudyVCO';
import ADSSettingModal from '../../Components/ADSSettingModal';

let view: ReactElement;

interface Props {
  moduleType: string,
  selfStreamRef: any, // TODO get type
  remoteStreamRef: any, // TODO get type
  hangupFunction: any,
  socketRef: any,
  captionsEnabled?: boolean
}

/**
 * Global UI Shell is a resuable skeleton for all our study experiment calls
 * @param moduleType - defines which study experiment page will be displayed
 * @param selfStreamRef - webcam video ref for self
 * @param remoteStreamRef - webcam video ref for caller
 * @param hangupFunction - end call function
 * @param socketRef - socket used for webRTC signaling
 * @param captionsEnabled - optional prop for captions
 * @returns view with proper study page
 */
function GlobalUIShell(props: Props) {
  const navigate = useNavigate();
  const { participantName } = useParams();
  const [bodyHeight, setBodyHeight] = useState(0);
  const [parentContainerHeight, setParentContainerHeight] = useState(0);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCallTimerActive, setIsCallTimerActive] = useState(false);
  const {
    moduleType, selfStreamRef, remoteStreamRef, hangupFunction, socketRef, captionsEnabled
  } = props;

  // On every render, useEffect activates call timer for study experiments and
  // sets the study chat window height
  useEffect(() => {
    setIsCallTimerActive(true);
    setParentContainerHeight(mainContainerRef?.current?.clientHeight || 300);

    if (window.innerHeight <= 690) { // 690 is when scroll bar is active
      // If height is less than globalUI container height, assign static height
      // this height includes space from scroll bar
      setBodyHeight(690);
    } else {
      // else assign view height
      setBodyHeight(window.innerHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggers due to elapsedTime and isCallTimerActive changes.
  // useEffect calculates call elasped time
  useEffect(() => {
    let intervalId: any;
    // Check if call timer is true
    if (isCallTimerActive) {
      intervalId = setInterval(() => setElapsedTime(elapsedTime + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [elapsedTime, isCallTimerActive]);

  // Hours calculation
  const hours = Math.floor(elapsedTime / 360000);

  // Minutes calculation
  const minutes = Math.floor((elapsedTime % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((elapsedTime % 6000) / 100);

  // Reset timer sets elapsed time to 0
  const resetTimer = () => {
    setElapsedTime(0);
  };

  // When call ends these functions are called
  const endCall = () => {
    setIsCallTimerActive(false);
    resetTimer();
    hangupFunction();
  };

  /**
   * handleResize sets height of the study pages specifically dealing with the
   * responsiveness of the study chat window
   * @param {any}
   */
  function handleResize() {
    // Container header height is always 72px
    setParentContainerHeight(mainContainerRef?.current?.clientHeight || 300);
    // set body height
    if (window.innerHeight <= 690) { // 690 is when scroll bar is active
      // If height is less than globalUI container height, assign static height
      // this height includes space from scroll bar
      setBodyHeight(690);
    } else {
      // else assign view height
      setBodyHeight(window.innerHeight);
    }
  }

  // Handle resize events on render
  React.useEffect(() => {
    window.addEventListener('resize', handleResize, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Switch case conditionals to specify which module
  switch (moduleType) {
    case 'IPCTS':
      view = (
        <StudyIPCTS
          height={parentContainerHeight}
          socketRef={socketRef}
        />
      );
      break;
    case 'IPrelay':
      view = (<StudyIPRelay />);
      break;
    case 'STSCall':
      view = (
        <StudySTSCall
          hangupFunction={hangupFunction}
        />
      );
      break;
    case 'VRS':
      if (participantName === 'Participant1') {
        view = (
          <StudySTSCall
            hangupFunction={hangupFunction}
          />
        );
      } else {
        view = (
          <StudyVRSCall
            remoteStreamRef={remoteStreamRef}
            selfStreamRef={selfStreamRef}
          />
        );
      }
      break;
    case 'VCO':
      view = (
        <StudyVCO
          height={parentContainerHeight}
        />
      );
      break;
    default:
      navigate('/login');
  }

  return (
    <Container
      fluid
      no-gutters="true"
      style={{
        backgroundColor: '#F9F9F9', height: `${bodyHeight}px`, padding: '0', minWidth: '848px'
      }}
    >
      <div style={{ display: 'none' }}>
        <audio
          ref={selfStreamRef}
          controls
          autoPlay
          muted
        >
          <track kind="captions" />
        </audio>
      </div>
      <div style={{ display: 'none' }}>
        <audio
          ref={remoteStreamRef}
          controls
          autoPlay
        >
          <track kind="captions" />
        </audio>
      </div>
      <Row className="UIshell-top-control-bar">
        <Col style={{ padding: '0' }} />
        <Col className="top-bar-control-items main-top-bar-content" style={{ padding: '0' }}>
          <ADSFontSizeButtons />
          <Col className="top-bar-settings" style={{ justifyContent: 'right', padding: '0' }}>
            <div className="font-size-container" style={{ paddingLeft: '16px', marginRight: '0' }}>
              <ADSSettingModal
                captionsEnabled={captionsEnabled}
                remoteStreamRef={remoteStreamRef}
              />
            </div>
          </Col>
        </Col>
        <Col style={{ padding: '0' }} />
      </Row>
      {moduleType === 'STSCall' || moduleType === 'VRS'
        ? (
          <Container>
            {view}
          </Container>
        )
        : (
          <Container
            fluid
            ref={mainContainerRef}
            className="GlobalUI-Container"
          >
            {/* Container Header */}
            <Row style={{ borderBottom: '1px solid #757575', height: '72px' }} className="container-header">
              <Col xs="auto" className="container-header-items container-header-id" style={{ paddingLeft: '24px', paddingRight: '16px' }}>
                + 0 000 0000 0
              </Col>
              <Col className="container-header-items" style={{ paddingLeft: '0', paddingRight: '0' }}>
                {/* TODO Replace hardcoded icon and call time */}
                <FontAwesomeIcon style={{ paddingRight: '16px', height: '10px' }} className="calling-indicator" icon={faCircle} />
                <div className="body1 call-timer">
                  {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
              </Col>
              <Col className="container-header-items" style={{ justifyContent: 'flex-end', paddingRight: '24px' }}>
                <div style={{ paddingRight: '12px' }}>
                  <ADSIconButton icon={faMicrophoneAlt} onClick={() => null} ariaLabel="" variant="standard" size="xl" />
                </div>
                {/* TODO Rotate phone icon and make button red */}
                <ADSButton onClick={endCall} icon={faPhone} buttonText="Hang Up" variant="hangup" />
              </Col>
            </Row>
            {/* Container Body */}
            {view}
          </Container>
        )}
    </Container>
  );
}

GlobalUIShell.defaultProps = {
  captionsEnabled: true
};

export default GlobalUIShell;
