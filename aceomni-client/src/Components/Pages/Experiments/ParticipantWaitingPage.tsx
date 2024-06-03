/* eslint-disable prefer-destructuring */
import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Container, Row, Col
} from 'react-bootstrap';
import './ParticipantsPages.css';
import { useNavigate } from 'react-router-dom';
import ADSButton from '../../ADSButton';
import ADSDialog from '../../ADSDialog';
import ADSAlert from '../../ADSAlert';
import GlobalUIShell from '../Studies/GlobalUIShell';

let socket: any;
let peerConnection: RTCPeerConnection | null;
let receivedCall = false;
let sawOffer = false;
let sawAnswer = false;
let thisExtension: string;
let remoteExtension: string;
let remoteName: string;
let gotRemoteStream: boolean = false;
let selfViewStream: MediaStream;
let remoteStream: MediaStream;
// let recorderMic: MediaRecorder | null = null;
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

interface Props {
  roomName: string,
  participant: any,
  study: any,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  module_: any,
  configuration: any,
}

function ParticipantWaitingPage(props: Props) {
  const navigate = useNavigate();
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    roomName, participant, module_, study, configuration
  } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const selfView = useRef<HTMLAudioElement>(null);
  const remoteView = useRef<HTMLAudioElement>(null);
  thisExtension = participant.extension;
  // const [localVideoSender, setLocalVideoSender] = useState<RTCRtpSender>();
  const [localAudioSender, setLocalAudioSender] = useState<RTCRtpSender>();
  // const [remoteVideoSender, setRemoteVideoSender] = useState<RTCRtpSender>();
  const [remoteAudioSender, setRemoteAudioSender] = useState<RTCRtpSender>();
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel>();
  const [sendChannel, setSendChannel] = useState<RTCDataChannel>();
  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [otherParticipants, setOtherParticipants] = useState([{ name: 'User', ext: '####' }]) as any;

  const emitEvent = (eventName: string, data: any = {}) => {
    if (debugEvents && eventName !== 'audioDataCallerOut' && eventName !== 'audioDataCallerMic') {
      console.log(`Emitting event ${eventName} with payload: \n ${JSON.stringify(data)} \nto room ${roomName} user ${remoteExtension}\n`);
    }
    // Some events don't need this info, but easier to always include it anyway
    data.roomName = roomName;
    data.socketID = socket.id;
    data.sourceExt = thisExtension;
    data.destinationExt = remoteExtension;
    socket.emit(eventName, data);
  };

  const endCall = () => {
    if (!receivedHangup) {
      emitEvent('sendEndCall');
    }

    selfViewStream?.getTracks().forEach((track: any) => track.stop());
    if (selfView.current) {
      selfView.current.pause();
      selfView.current.src = '';
      selfView.current.srcObject = null;
      selfView.current.load();
    }
    remoteStream?.getTracks().forEach((track: any) => track.stop());
    if (remoteView.current) {
      remoteView.current.pause();
      remoteView.current.src = '';
      remoteView.current.srcObject = null;
      remoteView.current.load();
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
        // if (localVideoSender) {
        //   peerConnection.removeTrack(localVideoSender);
        // }
        if (localAudioSender) {
          peerConnection.removeTrack(localAudioSender);
        }
        // if (remoteVideoSender) {
        //   peerConnection.removeTrack(remoteVideoSender);
        // }
        if (remoteAudioSender) {
          peerConnection.removeTrack(remoteAudioSender);
        }
        peerConnection.close();
      }
      peerConnection = null;
    }

    /*
    if (recorderMic) {
      recorderMic.stop();
    }
    */
    if (recorderOut) {
      recorderOut.stop();
    }
    receivedCall = false;
    sawOffer = false;
    sawAnswer = false;
    remoteExtension = '';
    remoteName = '';
    gotRemoteStream = false;
    offerCreated = false;
    receivedHangup = false;

    navigate(-1);
  };

  function handleRemoteStreamAdded(event: RTCTrackEvent) {
    remoteStream = event.streams[0];
    if (remoteStream && peerConnection && !gotRemoteStream) {
      // setRemoteVideoSender(
      //   peerConnection.addTrack(remoteStream.getVideoTracks()[0], remoteStream)
      // );
      setRemoteAudioSender(
        peerConnection.addTrack(remoteStream.getAudioTracks()[0], remoteStream)
      );
      gotRemoteStream = true;
    }
    if (remoteView.current) {
      remoteView.current.srcObject = event.streams[0];
    }

    recorderOut = new MediaRecorder(remoteStream);

    recorderOut.onstart = () => {
      emitEvent('startCaptions', { participantExtension: remoteExtension, participantName: remoteName });
    };

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
        emitEvent('audioDataCallerOut', { src: 'out', audio: base64EncodedData });
      });
      reader.readAsDataURL(evt.data);
    };
    recorderOut.start(500);
  }

  function handleNewICECandidateMsg(data: any) {
    const candidate = new RTCIceCandidate(data.candidate);
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate)
        .catch((e: any) => console.log(e));
    }
  }

  function handleICECandidateEvent(e: any) {
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
  }

  function onSendChannelStateChange() {
  }

  // Capture specific messages such as offer and answer through the data channel
  function onSendChannelMessage(msg: any) {
    console.log(`Got message ${msg}`);
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
      peerConnection.createOffer()
        .then(
          (offer) => peerConnection?.setLocalDescription(offer)
        )
        .then(() => {
          offerCreated = true;
        })
        .catch((e) => console.log(e));
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
        if (selfViewStream && peerConnection) {
          // setLocalVideoSender(
          //   peerConnection.addTrack(selfViewStream?.getVideoTracks()[0], selfViewStream)
          // );
          setLocalAudioSender(
            peerConnection.addTrack(selfViewStream?.getAudioTracks()[0], selfViewStream)
          );
        }
      });
    /*
      // Removed until microphone audio recording is required.
      .then(() => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(
          (stream) => {
            recorderMic = new MediaRecorder(stream);
            recorderMic.start(500);
            recorderMic.onstart = () => {
              console.log('started mic recorder');
            };

            recorderMic.onstop = () => {
              const tracks = stream.getTracks();
              tracks.forEach((track) => track.stop());
              recorderMic = null;
            };

            recorderMic.ondataavailable = (evt) => {
              const reader = new FileReader();
              reader.addEventListener('load', () => {
                const dataUrl = reader.result;
                // @ts-ignore
                const base64EncodedData = dataUrl.split(',')[1];
                emitEvent('audioDataCallerMic', { src: 'mic', audio: base64EncodedData });
              });
              reader.readAsDataURL(evt.data);
            };
          }
        );
      });
    */
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

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptCall = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        selfViewStream = stream;
        if (selfView.current) {
          selfView.current.srcObject = stream;
        }
      })
      .then(() => {
        if (socket) {
          emitEvent('acceptCall');
        }
      });
    setIsCallAccepted(true);
    setOpenDialog(false);
  };

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

      // console.log(`${participant.name} has joined from Waiting Page`);

      socket
        .on('participantHasJoined', (data: any) => {
          newParticipantAlert(data);
        })
        .on('testing', () => console.log('testingFromDialPage'))
        .on('gotMessage', (data: any) => {
          if (data.senderExtension !== thisExtension) {
            handleReceiveMessage(data);
          }
        })
        .on('incomingCall', (data: any) => {
          if (!receivedCall) {
            remoteExtension = data.callingExtension;
            remoteName = data.callingName;
            emitEvent('initStudyCallee', {
              study,
              module_,
              configuration,
              receivingExtension: thisExtension,
              callingExtension: remoteExtension,
              callDataID: data.callData?._id
            });
            receivedCall = true;
            setOpenDialog(true);
          }
        })
        .on('receiveOffer', (data: any) => {
          if (!sawOffer) {
            handleReceiveCall(data);
            sawOffer = true;
          }
        })
        .on('receiveAnswer', (data: any) => {
          if (!sawAnswer) {
            if (peerConnection) {
              const desc = new RTCSessionDescription(data.sdp);
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

  if (isCallAccepted) {
    return (
      <GlobalUIShell
        moduleType={module_.type}
        selfStreamRef={selfView}
        remoteStreamRef={remoteView}
        hangupFunction={endCall}
        socketRef={socket}
        captionsEnabled={false}
      />
    );
  }
  return (
    <Container fluid>
      <Row>
        <Col className="participantsDialDesc">
          Please wait. You will receive an incoming call shortly.
          Simply accept the call when it arrives.
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
      </Row>
      <ADSDialog
        title="Incoming Connection"
        buttons={(
          <>
            <ADSButton onClick={handleAcceptCall} buttonText="Accept" width="100%" variant="primary" />
            <ADSButton onClick={endCall} buttonText="Decline" width="100%" variant="secondary" />
          </>
        )}
        onClose={handleCloseDialog}
        open={openDialog}
        width="xs"
      />
    </Container>
  );
}

export default ParticipantWaitingPage;
