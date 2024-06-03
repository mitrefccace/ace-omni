import React, { useEffect, ReactElement, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ParticipantWaitingPage from './ParticipantWaitingPage';
import ParticipantDialPage from './ParticipantDialPage';
import ParticipantVRSdialPage from './ParticipantVRSdialPage';
import ParticipantCApage from './ParticipantCApage';

let view: ReactElement;

function ParticipantMainStudyPage() {
  const {
    moduleType, experimentAlias, configurationName, participantName
  } = useParams();
  const [isHearingState, setIsHearingState] = useState(participantName === 'Participant1');
  const [isCA, setIsCA] = useState(participantName === 'Participant3');
  const [myRoom, setMyRoom] = useState(`${moduleType}${experimentAlias}${configurationName}`);
  const { state } = useLocation();
  const [myModule, setMyModule] = useState(state.currentModule || {});
  const [myParticipant, setMyParticipant] = useState(state.currentParticipant || {});
  const [myConfiguration, setMyConfiguration] = useState(state.currentConfiguration || {});
  const [myStudy, setMyStudy] = useState(state.currentStudy || {});

  useEffect(() => {
    if (participantName === 'Participant1') {
      setIsHearingState(true);
    } else {
      setIsHearingState(false);
    }
    if (participantName === 'CommunicationsAssistant') {
      setIsCA(true);
    }
  }, [participantName]);

  useEffect(() => {
    setMyRoom(`${moduleType}${experimentAlias}${configurationName}`);
  }, [configurationName, experimentAlias, moduleType]);

  useEffect(() => {
    setMyStudy(state.currentStudy);
    setMyParticipant(state.currentParticipant);
    setMyModule(state.currentModule);
    setMyConfiguration(state.currentConfiguration);
  }, [state]);

  if (isHearingState) {
    if (moduleType === 'IPCTS') {
      view = (
        <ParticipantDialPage
          roomName={myRoom || ''}
          participant={myParticipant}
        />
      );
    } else {
      // Is VRS
      view = (
        <ParticipantWaitingPage
          roomName={myRoom || ''}
          study={myStudy}
          module_={myModule}
          configuration={myConfiguration}
          participant={myParticipant}
        />
      );
    }
  } else if (isCA) {
    // Will be used to send the CA to their specific page
    view = (
      <ParticipantCApage
        roomName={myRoom || ''}
        study={myStudy}
        module_={myModule}
        configuration={myConfiguration}
        participant={myParticipant}
      />
    );
  } else if (moduleType === 'IPCTS') {
    view = (
      <ParticipantWaitingPage
        roomName={myRoom || ''}
        study={myStudy}
        module_={myModule}
        configuration={myConfiguration}
        participant={myParticipant}
      />
    );
  } else {
    view = (
      <ParticipantVRSdialPage
        roomName={myRoom || ''}
        participant={myParticipant}
      />
    );
  }

  return (
    <main>
      {view}
    </main>
  );
}

export default ParticipantMainStudyPage;
