/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container, Row, Col
} from 'react-bootstrap';

import ADSButton from '../../ADSButton';
import ADSSingleLineTextField from '../../ADSSingleLineTextField';
// import ADSAlert from '../../ADSAlert';

import './ParticipantsPages.css';
import ADSAlert from '../../ADSAlert';

function ParticipantLogin() {
  const navigate = useNavigate();
  const { moduleType, experimentAlias } = useParams();

  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [extension, setExtension] = useState('');
  const [studyExists, setStudyExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStudy, setCurrentStudy] = useState<any>({});
  const [currentModule, setCurrentModule] = useState<any>({});

  const getStudy = async () => {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/experiment/getExperiment/${experimentAlias}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async (response: {
      ok: boolean; json: () => any; status: {
        toString: () => string;
      };
    }) => {
      if (response.ok) {
        setIsLoading(false);
        if (response.status === 200) {
          const data = await response.json();
          if (data.queryResult.length > 0) {
            // Check if Study exists
            const study = data.queryResult[0];
            const studyModule = study.modules.find(
              (m: any) => m.type.includes(moduleType)
            );
            if (studyModule) {
              setStudyExists(true);
              setCurrentStudy(study);
              setCurrentModule(studyModule);
            }
          } else {
            // Experiment not found
            setStudyExists(false);
          }
        } else {
          const data = await response.json();
          console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
          setStudyExists(false);
        }
      } else {
        setIsLoading(false);
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
        setStudyExists(false);
      }
    });
  };

  useEffect(() => {
    getStudy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitExtension = async () => {
    let currentConfiguration: any;
    let currentParticipant: any;

    for (let i = 0; i < currentModule.configurations.length; i += 1) {
      const config = currentModule.configurations[i];
      currentParticipant = config.participants.find(
        (part: any) => part.extension === extension
      );
      if (currentParticipant) {
        currentConfiguration = config;
        break;
      }
    }

    if (currentParticipant && currentConfiguration) {
      setShowErrorMessage(false);
      sessionStorage.setItem('omniParticipantAuthenticated', 'true');
      navigate(
        `/Experiment/${moduleType}/${experimentAlias}/${currentConfiguration.name}/${currentParticipant.name}/${currentParticipant.extension}`,
        {
          state: {
            currentStudy, currentModule, currentConfiguration, currentParticipant
          }
        }
      );
    } else {
      console.log('Extension not found in any existing configurations.');
      setShowErrorMessage(true);
    }
  };

  const updateExtension = (e: string) => {
    setExtension(e);
  };
  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        submitExtension();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extension]);

  if (isLoading) {
    return (
      null
    );
  } if (studyExists) {
    return (
      <main>
        <Container>
          <ADSAlert
            alertText="Extension not found in any existing configurations."
            alertType="danger"
            isDismissible
            autoClose
            showAlert={showErrorMessage}
            setShowAlert={setShowErrorMessage}
            fontType="body1"
          />
          <Row>
            <Col className="h1 participantsLoginHeader">
              Welcome to ACE Omni
            </Col>
          </Row>
          <Row>
            <Col className="participantsLoginDesc">
              Ask the Researcher for your extension and enter it below.
              This extension will connect you to the intended task.
            </Col>
          </Row>
          <Row className="participantsExtensionForm">
            <Col sm={3}>
              <ADSSingleLineTextField
                formText={extension}
                setFormText={updateExtension}
                formLabel="Extension"
                isFormLabelHidden={false}
                hasDelete={false}
                elementID="extensionFormText"
              />
            </Col>
          </Row>
          <Row className="participantsExtensionForm">
            <Col sm={3}>
              <ADSButton onClick={submitExtension} buttonText="Submit" width="100%" />
            </Col>
          </Row>
        </Container>
      </main>
    );
  }
  return (
    <main>
      <Container>
        <Row>
          <Col className="h1 participantsLoginHeader">
            Welcome to ACE Omni
          </Col>
        </Row>
        <Row>
          <Col className="participantsLoginDesc">
            Experiment terminal not found. Please confirm you&lsquo;ve entered the correct URL.
          </Col>
        </Row>
      </Container>
    </main>
  );
}

export default ParticipantLogin;
