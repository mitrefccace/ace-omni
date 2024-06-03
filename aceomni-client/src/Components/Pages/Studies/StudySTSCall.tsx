import {
  faCircleUser, faMicrophoneSlash, faPause, faPhone, faPlus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ADSButton from '../../ADSButton';
import ADSIconButton from '../../ADSIconButton';
import { faGrid } from '../../Assets/css/keypad';
import './StudyIPCTS.css';
import './StudySTSCall.css';

interface Props {
  hangupFunction: any
}

/**
 * Study STS experiment call shows keypad configuration
 * @param hangupFunction - ends call
 * @return Study STS view
 */
function StudySTSCall(props: Props) {
  const { experimentName } = useParams();
  const { hangupFunction } = props;
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCallTimerActive, setIsCallTimerActive] = useState(false);

  // On every render, activate call timer
  useEffect(() => {
    setIsCallTimerActive(true);
    console.log(experimentName); // printing this so the linter doesn't complain

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Triggers due to elapsedTime and isCallTimerActive changes.
  // useEffect calculates call elasped time
  useEffect(() => {
    let intervalId: any;
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

  return (
    <Container
      fluid
      className="STS-Container"
    >
      <Row className="avatar-icon-container">
        <Col>
          <FontAwesomeIcon className="call-avatar-icon" icon={faCircleUser} />
        </Col>
      </Row>
      <Row className="avatar-icon-container">
        <Col xs="auto" className="container-header-items container-header-id" style={{ paddingRight: '16px', paddingTop: '24px' }}>
          + 0 000 0000 0
        </Col>
      </Row>
      <Row className="avatar-icon-container">
        <Col style={{ paddingLeft: '0', paddingRight: '0', paddingTop: '8px' }}>
          <div className="body1 call-timer">
            {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
          </div>
        </Col>
      </Row>
      <Row className="keypad-icons-container">
        <Col>
          <Row style={{ paddingTop: '32px' }}>
            <Col style={{ display: 'grid', textAlign: 'center' }}>
              <ADSIconButton icon={faMicrophoneSlash} onClick={() => null} ariaLabel="" height="large" variant="outlined" size="xl" />
              <span>Mute</span>
            </Col>
            <Col style={{ display: 'grid', textAlign: 'center' }}>
              <ADSIconButton icon={faGrid} onClick={() => null} ariaLabel="" height="large" variant="outlined" size="xl" />
              <span>Keypad</span>
            </Col>
            <Col style={{ display: 'grid', textAlign: 'center' }}>
              <ADSIconButton icon={faPlus} onClick={() => null} ariaLabel="" height="large" variant="outlined" size="xl" />
              <span>Add</span>
            </Col>
          </Row>
          <Row style={{ paddingTop: '16px' }}>
            <Col>
              <ADSIconButton icon={null} disabled onClick={() => null} ariaLabel="" height="large" variant="outlined" size="xl" />
            </Col>
            <Col style={{ display: 'grid', textAlign: 'center' }}>
              <ADSIconButton icon={faPause} onClick={() => null} ariaLabel="" height="large" variant="outlined" size="xl" />
              <span>Hold</span>
            </Col>
            <Col>
              <ADSIconButton icon={null} disabled onClick={() => null} ariaLabel="" height="large" variant="outlined" size="xl" />
            </Col>
          </Row>
          <Row style={{ textAlign: 'center', paddingTop: '32px' }}>
            <Col>
              <ADSButton shape="circular" onClick={endCall} icon={faPhone} variant="hangup" height="large" />
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default StudySTSCall;
