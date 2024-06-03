/* eslint-disable prefer-destructuring */
import React, {
  useCallback, useEffect, useRef, useState
} from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import {
  Col,
  Container, Row
} from 'react-bootstrap';
import {
  faPhone, faMicrophoneSlash, faVideoCamera, faMaximize, faCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ADSSingleLineTextField from '../../ADSSingleLineTextField';
import ADSAlphanumericDialPad from '../../ADSAlphanumericDialPad';
import ADSButton from '../../ADSButton';
import ADSAlert from '../../ADSAlert';
import ADSDialog from '../../ADSDialog';
// import ADSVideoComponent from '../../ADSVideoComponent';
import ADSIconButton from '../../ADSIconButton';
import ADSTooltip from '../../ADSTooltip';
import ADSFontSizeButtons from '../../Components/ADSFontSizeButtons';
import ADSSettingModal from '../../Components/ADSSettingModal';
import './ParticipantsPages.css';
// import GlobalUIShell from '../Studies/GlobalUIShell';

interface Props {
  roomName: string,
  participant: any,
}

let socket: any;
let peerConnection: RTCPeerConnection | null;
let isInitiator = false;
let sawOffer = false;
let sawAnswer = false;
let thisExtension: string;
let remoteExtension: string;
let gotRemoteStream: boolean = false;
let selfViewStream: MediaStream;
let remoteStream: MediaStream;
let recorderOut: MediaRecorder | null = null;
let offerCreated = false;
let receivedHangup = false;

// Set to true to print all in/out events to console
const debugEvents = false;

const iceConfiguration: any = {
  iceServers: []
};

if (process.env.REACT_APP_TURN_FQDN) {
  const turnServer = {
    username: process.env.REACT_APP_TURN_USER,
    credential: process.env.REACT_APP_TURN_PASS,
    urls: [`turn:${process.env.REACT_APP_TURN_FQDN}:${process.env.REACT_APP_TURN_PORT}`]
  };
  iceConfiguration.iceServers.push(turnServer);
}

if (process.env.REACT_APP_STUN_FQDN) {
  const stunServer = {
    urls: [`stun:${process.env.REACT_APP_STUN_FQDN}:${process.env.REACT_APP_STUN_PORT}`]
  };
  iceConfiguration.iceServers.push(stunServer);
}

function ParticipantVRSdialPage(props: Props) {
  const navigate = useNavigate();
  const {
    roomName, participant
  } = props;

  thisExtension = participant.extension;

  const selfView = useRef<HTMLVideoElement>(null);
  const remoteView = useRef<HTMLVideoElement>(null);

  const [localVideoSender, setLocalVideoSender] = useState<RTCRtpSender>();
  const [localAudioSender, setLocalAudioSender] = useState<RTCRtpSender>();
  const [remoteAudioSender, setRemoteAudioSender] = useState<RTCRtpSender>();
  const [remoteVideoSender, setRemoteVideoSender] = useState<RTCRtpSender>();
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel>();
  const [sendChannel, setSendChannel] = useState<RTCDataChannel>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [dialedExtension, setDialedExtension] = useState('');
  const [successAlert, setSuccessAlert] = useState(false);
  const [otherParticipants, setOtherParticipants] = useState([{ name: 'User', ext: '####' }]) as any;
  const [callConnectedAlert, setCallConnectedAlert] = useState(false);
  const [callFailureAlert, setCallFailureAlert] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [isCallTimerActive, setIsCallTimerActive] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const emitEvent = (eventName: string, data: any = {}) => {
    if (debugEvents && eventName !== 'audioDataCalleeOut') {
      console.log(`Emitting event ${eventName} with payload: \n ${JSON.stringify(data)} \nto room ${roomName} user ${remoteExtension}\n`);
    }
    // Some events don't need this info, but easier to always include it anyway
    data.roomName = roomName;
    data.socketID = socket.id;
    data.sourceExt = thisExtension;
    data.destinationExt = remoteExtension;
    socket.emit(eventName, data);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const endCall = () => {
    if (!receivedHangup) {
      emitEvent('sendEndCall');
    }
    selfViewStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    if (selfView.current) {
      selfView.current.pause();
      selfView.current.src = '';
      selfView.current.srcObject = null;
      selfView.current.load();
    }
    remoteStream?.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    if (remoteView.current) {
      remoteView.current.pause();
      remoteView.current.src = '';
      remoteView.current.srcObject = null;
      remoteView.current.load();
    }
    if (recorderOut) {
      recorderOut.stop();
    }
    if (receiveChannel) {
      receiveChannel.close();
    }
    if (sendChannel) {
      sendChannel.close();
    }
    if (peerConnection) {
      peerConnection.onicecandidate = null;
      peerConnection.ontrack = null;
      if (sendChannel?.readyState !== 'closed' && peerConnection.signalingState !== 'closed') {
        if (localVideoSender) {
          peerConnection.removeTrack(localVideoSender);
        }
        if (localAudioSender) {
          peerConnection.removeTrack(localAudioSender);
        }
        if (remoteVideoSender) {
          peerConnection.removeTrack(remoteVideoSender);
        }
        if (remoteAudioSender) {
          peerConnection.removeTrack(remoteAudioSender);
        }
        if (remoteVideoSender) {
          peerConnection.removeTrack(remoteVideoSender);
        }
        peerConnection.close();
      }
      peerConnection = null;
    }

    setIsCallTimerActive(false);
    setElapsedTime(0);
    isInitiator = false;
    sawOffer = false;
    sawAnswer = false;
    remoteExtension = '';
    gotRemoteStream = false;
    offerCreated = false;
    receivedHangup = false;
    navigate(-1);
  };

  function handleRemoteStreamAdded(event: RTCTrackEvent) {
    console.log(`GOT REMOTE STREAM EVENT ${remoteView.current}`);
    remoteStream = event.streams[0];
    if (remoteStream && peerConnection && !gotRemoteStream) {
      setRemoteVideoSender(
        peerConnection.addTrack(remoteStream.getVideoTracks()[0], remoteStream)
      );
      setRemoteAudioSender(
        peerConnection.addTrack(remoteStream.getAudioTracks()[0], remoteStream)
      );
      gotRemoteStream = true;
    }
    if (remoteView.current) {
      console.log(`SETTING REMOTE STREAM TO OBJECT ${event.streams[0]}`);
      remoteView.current.srcObject = event.streams[0];
    }

    recorderOut = new MediaRecorder(remoteStream);

    recorderOut.onstop = () => {
      const tracks = remoteStream.getTracks();
      tracks.forEach((track) => track.stop());
      recorderOut = null;
    };

    recorderOut.ondataavailable = (evt) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const dataUrl = reader.result;
        // @ts-ignore
        const base64EncodedData = dataUrl.split(',')[1];
        emitEvent('audioDataCalleeOut', { src: 'out', audio: base64EncodedData });
      });
      reader.readAsDataURL(evt.data);
    };
    recorderOut.start(500);
  }

  function handleNewICECandidateMsg(data: any) {
    if (peerConnection) {
      const candidate = new RTCIceCandidate(data.candidate);
      peerConnection.addIceCandidate(candidate)
        .catch((e: any) => console.log(e));
    }
  }

  function handleICECandidateEvent(e: any) {
    console.log(`GOT ICE ${JSON.stringify(e.candidate)}`);
    if (e.candidate) {
      emitEvent('iceCandidate', { candidate: e.candidate });
    }
  }

  /**
   * Receive Channel Event Functions
   */

  function handleReceiveMessage(msg: any) {
    if (debugEvents) {
      console.log(`Received message ${JSON.stringify(msg)}`);
    }
    // MAY NEED THIS LOGIC
    // this.translateChatIfNecessary(msg, senderName, senderLanguage, this.state.myLanguage);
  }

  function handleReceiveChannelStatusChange() {
    console.log('RECEIVE CHANNEL STATUS CHANGE TO ');
  }

  function onSendChannelStateChange() {
    console.log(`SEND CHANNEL STATE IS ${sendChannel}`);
  }

  // Capture specific messages such as offer and answer through the data channel
  function onSendChannelMessage(msg: any) {
    console.log(`GOT PC MESSAGE ${JSON.stringify(msg)}`);
  }

  function receiveChannelCallback(event: any) {
    const tempReceiveChannel = event.channel;
    if (event.channel) {
      tempReceiveChannel.onmessage = handleReceiveMessage;
      tempReceiveChannel.onopen = handleReceiveChannelStatusChange;
      tempReceiveChannel.onclose = handleReceiveChannelStatusChange;
      setReceiveChannel(tempReceiveChannel);
    }
  }

  function handleNegotiationNeeded() {
    if (peerConnection && !offerCreated) {
      peerConnection.createOffer().then(
        (offer) => peerConnection?.setLocalDescription(offer)
      ).then(() => {
        if (isInitiator) {
          emitEvent('sendOffer', { sdp: peerConnection?.localDescription });
        }
        offerCreated = true;
      }).catch((e) => console.log(e));
    }
  }

  function createPeerConnection() {
    try {
      peerConnection = new RTCPeerConnection(iceConfiguration);
      // setPeerConnection(new RTCPeerConnection(iceConfiguration));
    } catch (e: any) {
      console.log(`FAILED TO CREATE PEER CONNECTION: ${e}`);
    }
  }

  // Create peer connection and then establish send channels and tracks
  function peerConnectionSetupStructure() {
    console.log('CREATING PEER CONNECTION');
    const promise = new Promise((resolve) => {
      createPeerConnection();
      resolve('PEER CONNECTION CREATED');
    });
    promise.then(() => {
      if (peerConnection) {
        peerConnection.onicecandidate = handleICECandidateEvent;
        peerConnection.ontrack = handleRemoteStreamAdded;
        peerConnection.ondatachannel = receiveChannelCallback;
        peerConnection.onnegotiationneeded = handleNegotiationNeeded;
      }
    })
      .then(() => {
        if (peerConnection) {
          setSendChannel(peerConnection.createDataChannel(`sendDataChannel${roomName}`));
        }
      })
      .then(() => {
        const tempSendChannel = sendChannel;
        if (tempSendChannel) {
          tempSendChannel.onopen = onSendChannelStateChange;
          tempSendChannel.onclose = onSendChannelStateChange;
          tempSendChannel.onmessage = onSendChannelMessage;
        }
        setSendChannel(tempSendChannel);
      })
      .then(() => {
        console.log(`SETTING TRACKS WITH SENDERS ${selfViewStream}`);
        if (selfViewStream && peerConnection) {
          setLocalVideoSender(
            peerConnection.addTrack(selfViewStream?.getVideoTracks()[0], selfViewStream)
          );
          setLocalAudioSender(
            peerConnection.addTrack(selfViewStream?.getAudioTracks()[0], selfViewStream)
          );
        }
      });
  }

  function handleReceiveCall(data: any) {
    peerConnectionSetupStructure();
    if (peerConnection) {
      const desc = new RTCSessionDescription(data.sdp);
      peerConnection.setRemoteDescription(desc)
        .then(() => peerConnection?.createAnswer())
        .then((answer) => peerConnection?.setLocalDescription(answer))
        .then(() => {
          emitEvent('sendAnswer', { sdp: peerConnection?.localDescription });
        });
    }
  }

  const newParticipantAlert = (data: any) => {
    const otherPart = data.filter((item: any) => item.ext !== thisExtension);
    // console.log('otherParticipants', otherPart);
    if (otherPart[0]) {
      if (otherPart[0].ext !== thisExtension) {
        setSuccessAlert(true);
        setOtherParticipants(otherPart);
      }
    }
  };

  useEffect(() => {
    socket = io({ path: `${process.env.REACT_APP_LOCATION}/socket.io` });

    if (debugEvents) {
      socket.onAny((event: string, data: any) => {
        console.log(`Received event: ${event} \n with data: ${JSON.stringify(data)}\n`);
      });
    }

    socket.on('connect', () => {
      emitEvent('joinRoom', { participant });

      // console.log(`${participant.name} has joined from Dial Page`);

      socket
        .on('participantHasJoined', (data: any) => {
          newParticipantAlert(data);
        })
        .on('gotMessage', (data: any) => {
          if (thisExtension !== data.sourceExt) {
            handleReceiveMessage(data);
          }
        })
        .on('callData', () => {
          setCallFailureAlert(false);
          setCallConnectedAlert(true);
          setOpenDialog(true);
        })
        .on('callAccepted', () => {
          // Create the peer connection
          setIsCallAccepted(true);
          console.log('RECEIVED ACCEPTED CALL', isCallAccepted);
          handleCloseDialog();
          peerConnectionSetupStructure();
          setIsCallTimerActive(true);
        })
        .on('receiveOffer', (data: any) => {
          if (!sawOffer) {
            handleReceiveCall(data);
            sawOffer = true;
          }
        })
        .on('receiveAnswer', (data: any) => {
          if (!sawAnswer) {
            const desc = new RTCSessionDescription(data.sdp);
            if (peerConnection) {
              peerConnection.setRemoteDescription(desc).catch((e) => console.log(e));
            }
            sawAnswer = true;
          }
        })
        .on('iceCandidate', (data: any) => {
          handleNewICECandidateMsg(data);
        })
        .on('receiveEndCall', () => {
          receivedHangup = true;
          endCall();
        })
        .on('callData', (callData: any) => {
          emitEvent('initStudyCaller', {
            callData,
            recordedExtension: callData.participants[1].extension,
            recordedName: callData.participants[1].name
          });
        });
    });
    return (() => {
      if (selfViewStream) {
        selfViewStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (socket) {
        emitEvent('leaveRoom');
        socket.off();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const numPressed = useCallback((event: React.FormEvent<HTMLButtonElement>, digit: string) => {
    if (dialedExtension.length < 10) {
      setDialedExtension(dialedExtension + digit);
    }
  }, [dialedExtension]);

  const updateExtension = (e: string) => {
    setDialedExtension(e);
  };

  const createCall = () => {
    isInitiator = true;
    emitEvent('initiateCall', { sourceName: participant.name });
    // On by default.  Will become false if call does go through
    setCallFailureAlert(true);
    // Get media
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      console.log(`GETTING STREAM ${selfView.current}`);
      selfViewStream = stream;
      if (selfView.current) {
        selfView.current.srcObject = stream;
      }
    });
  };

  const submitExtension = async () => {
    remoteExtension = dialedExtension;
    // check if other participant is in the room
    createCall();
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
  }, [dialedExtension]);

  useEffect(() => {
    let intervalId: any;
    if (isCallTimerActive) {
      intervalId = setInterval(() => setElapsedTime(elapsedTime + 1), 10);
    }
    return () => clearInterval(intervalId);
  }, [elapsedTime, isCallTimerActive]);

  const hours = Math.floor(elapsedTime / 360000);

  // Minutes calculation
  const minutes = Math.floor((elapsedTime % 360000) / 6000);

  // Seconds calculation
  const seconds = Math.floor((elapsedTime % 6000) / 100);
  /*
    if (isCallAccepted) {
    return (
      <span>
        <GlobalUIShell
          moduleType="VRS"
          selfStreamRef={selfView}
          remoteStreamRef={remoteView}
          hangupFunction={endCall}
          socketRef={socket}
        />
        <video
          style={{ outline: 'black solid 2px' }}
          ref={selfView}
          autoPlay
        >
          <track kind="captions" />
        </video>
      </span>
    );
  }
  */

  return (
    <Container fluid>
      {/* <span>
        <video
          // hidden={isCallAccepted === false}
          style={{ outline: 'red solid 2px' }}
          ref={remoteView}
          autoPlay
        >
          <track kind="captions" />
        </video>
        <video
          // hidden={isCallAccepted === false}
          style={{ outline: 'blue solid 2px' }}
          ref={selfView}
          autoPlay
          muted
        >
          <track kind="captions" />
        </video>
      </span> */}
      {/* <button type="button" onClick={() => endCall()}>
        End Call
      </button> */}
      <Row className="UIshell-top-control-bar">
        <Col style={{ padding: '0' }} />
        <Col className="top-bar-control-items main-top-bar-content" style={{ padding: '0' }}>
          <ADSFontSizeButtons />
          <Col className="top-bar-settings" style={{ justifyContent: 'right', padding: '0' }}>
            <div className="font-size-container" style={{ paddingLeft: '16px', marginRight: '0' }}>
              <ADSSettingModal
                captionsEnabled
                remoteStreamRef={remoteView}
              />
            </div>
          </Col>
        </Col>
        <Col style={{ padding: '0' }} />
      </Row>
      <div className="participant-vrs-dial-dialpad" hidden={isCallAccepted}>
        <Row>
          <Col className="participantsDialDesc">
            Now, ask the Researcher for the other Participant&#39;s extension.
            This extension will connect you with the other Participant.
          </Col>
          <ADSAlert
            alertText={`Participant '${otherParticipants[0].name}' with Extension '${otherParticipants[0].ext}' has entered the room.`}
            alertType="success"
            isDismissible
            autoClose={false}
            showAlert={successAlert}
            setShowAlert={setSuccessAlert}
            fontType="body1"
          />
          <ADSAlert
            alertText={`Calling Participant '${otherParticipants[0].name}' Extension '${otherParticipants[0].ext}'. Please wait for the other participant to answer the call.`}
            alertType="info"
            isDismissible
            autoClose={false}
            showAlert={callConnectedAlert}
            setShowAlert={setCallConnectedAlert}
            fontType="body1"
          />
          <ADSAlert
            alertText="Call cannot connect. Please check you are using the proper extension on clients."
            alertType="danger"
            isDismissible
            autoClose={false}
            showAlert={callFailureAlert}
            setShowAlert={setCallFailureAlert}
            fontType="body1"
          />
        </Row>
        <Row className="participantsExtensionForm" style={{ paddingTop: '24px' }}>
          <Col sm={3}>
            <ADSSingleLineTextField
              formText={dialedExtension}
              setFormText={updateExtension}
              formLabel="Destination Extension"
              isFormLabelHidden={false}
              hasDelete={false}
              elementID="extensionFormText"
            />
          </Col>
        </Row>
        <Row className="participantsExtensionForm">
          <Col sm={3}>
            <ADSAlphanumericDialPad numPressed={numPressed} />
          </Col>
        </Row>
        <Row className="participantsExtensionForm">
          <Col sm={3}>
            <ADSButton onClick={submitExtension} buttonText="Submit" width="100%" />
          </Col>
        </Row>
        <ADSDialog
          title="Placing Call ..."
          buttons={(
            <ADSButton onClick={endCall} buttonText="End Call" width="100%" id="dialPageEndCallButton" />
          )}
          onClose={handleCloseDialog}
          open={openDialog}
          width="xs"
        />
      </div>

      <div className="ui-2-container" hidden={!isCallAccepted}>
        <div id="participant-vrs-container">
          <div className="vrs-controls-container">
            <div className="vrs-controls-left">
              <span className="vrs-number">+0 000 0000 0</span>
              <span className="call-status">
                <FontAwesomeIcon style={{ paddingLeft: '20px', paddingRight: '10px' }} className="calling-indicator" icon={faCircle} />
                <span className="body1 call-timer">
                  {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </span>
              </span>
            </div>
            <div className="vrs-controls-right">
              <span className="maximize-btn">
                <ADSTooltip content="Maximize" placement="top">
                  <ADSIconButton
                    onClick={() => console.log('Maximize Button Clicked')}
                    variant="standard"
                    height="medium"
                    icon={faMaximize}
                    ariaLabel="standard icon"
                    disabled
                  />
                </ADSTooltip>
              </span>
              <span className="privacy-btn">
                <ADSTooltip content="Turn off Video" placement="top">
                  <ADSIconButton
                    onClick={() => console.log('Privacy Button Clicked')}
                    variant="standard"
                    height="medium"
                    icon={faVideoCamera}
                    ariaLabel="standard icon"
                    disabled
                  />
                </ADSTooltip>
              </span>
              <span className="mute-btn">
                <ADSTooltip content="Mute" placement="top">
                  <ADSIconButton
                    onClick={() => console.log('Mute Button Clicked')}
                    variant="standard"
                    height="medium"
                    icon={faMicrophoneSlash}
                    ariaLabel="standard icon"
                    disabled
                  />
                </ADSTooltip>
              </span>
              <span className="hangup-btn">
                <ADSButton
                  id="vrs-hangup-button"
                  className="ca-page-button"
                  buttonText="Hang Up"
                  variant="hangup"
                  icon={faPhone}
                  onClick={endCall}
                />
              </span>
            </div>
          </div>
          <div className="video-container">
            <div className="video-self">
              <video
                // hidden={isCallAccepted === false}
                // style={{ outline: 'blue solid 2px' }}
                ref={selfView}
                autoPlay
                muted
              >
                <track kind="captions" />
              </video>
            </div>
            <div className="video-remote">
              <video
                // hidden={isCallAccepted === false}
                // style={{ outline: 'red solid 2px' }}
                ref={remoteView}
                autoPlay
              >
                <track kind="captions" />
              </video>
            </div>
            {/* <div className="video-self">
                  <ADSVideoComponent
                    videoType="self-view"
                    videoRef={selfView}
                  />
                </div>
                <div className="video-remote">
                  <ADSVideoComponent
                    videoType="remote-view"
                    videoRef={remoteView}
                  />
                </div> */}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default ParticipantVRSdialPage;
