/* eslint-disable prefer-destructuring */
import React, {
  useState, useEffect, useRef, useCallback
} from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { io } from 'socket.io-client';
import {
  faPhone, faMicrophone, faVideoCamera, faMaximize, faCircle
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from 'react-bootstrap/Accordion';
import ADSSettingModal from '../../Components/ADSSettingModal';
import ADSFontSizeButtons from '../../Components/ADSFontSizeButtons';
import ADSSingleLineTextField from '../../ADSSingleLineTextField';
import ADSDialog from '../../ADSDialog';
import ADSButton from '../../ADSButton';
import ADSIconButton from '../../ADSIconButton';
import ADSTooltip from '../../ADSTooltip';
// import NavigationBar from '../../Components/NavigationBar';
import ADSAccordion from '../../ADSAccordion';
import ADSVideoComponent from '../../ADSVideoComponent';
import ADSAlphanumericDialPad from '../../ADSAlphanumericDialPad';
import './ParticipantsPages.css';

const debugEvents = false;

interface Props {
  roomName: string,
  participant: any,
  study?: any,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  module_?: any,
  configuration?: any
}

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

let socket: any;
// For deaf and hard of hearing user
let peerConnectionUI1: RTCPeerConnection | null;
let selfViewUI1stream: MediaStream;
let remoteViewUI1stream: MediaStream;
// NOTE: This is a temporary fix to make sure the peer connection
// has access to the extension when its set up for the first time
// Does not work for accessing state - EK
let UI1ExtensionLocal: string = '';
let sawOfferUI1 = false;
let sawAnswerUI1 = false;
let gotUI1remoteStream = false;
let offerCreatedUI1 = false;
let receivedHangupUI1 = false;
let UI1recorderOut: MediaRecorder | null = null;

// For Hearing User
let peerConnectionUI2: RTCPeerConnection | null;
let selfViewUI2stream: MediaStream;
let remoteViewUI2stream: MediaStream;
let thisExtension: string;
let UI2Extension: string;
let receivedCall = false;
let sawOfferUI2 = false;
let sawAnswerUI2 = false;
let gotUI2remoteStream = false;
let offerCreatedUI2 = false;
let receivedHangupUI2 = false;
let UI2recorderOut: MediaRecorder | null = null;

// const callButtonStyle = {
//   backgroundColor: 'var(--ADS_Blue) !important',
//   color: 'var(--ADS_White) !important',
//   paddingTop: '0px !important',
//   paddingBottom: '0px!important',
//   paddingLeft: '16px!important',
//   paddingRight: '16px!important',
//   minWidth: '64px!important',
//   border: 'none!important',
//   whiteSpace: 'nowrap',
//   marginTop: '16px'
// };

// const hangupButtonStyle = {
//   backgroundColor: 'var(--ADS_Blue) !important',
//   color: 'var(--ADS_White) !important',
//   paddingTop: '0px !important',
//   paddingBottom: '0px!important',
//   paddingLeft: '16px!important',
//   paddingRight: '16px!important',
//   minWidth: '64px!important',
//   border: 'none!important',
//   whiteSpace: 'nowrap',
//   marginTop: '16p'
// };

function ParticipantCApage(props: Props) {
  // const navigate = useNavigate();
  const [, setBodyHeight] = useState(0);
  // UI1 needs to be state update so it can be updated in the dialpad
  const [UI1Extension, setUI1Extension] = useState('');
  const selfVideoView = useRef<HTMLVideoElement>(null);
  const remoteVideoView = useRef<HTMLVideoElement>(null);
  const selfAudioView = useRef<HTMLAudioElement>(null);
  const remoteAudioView = useRef<HTMLAudioElement>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCallTimerActive, setIsCallTimerActive] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [waitingForCallAccept, setWaitingForCallAccept] = useState(false);
  const [UI1localAudioSender, setUI1LocalAudioSender] = useState<RTCRtpSender>();
  const [UI1remoteAudioSender, setUI1RemoteAudioSender] = useState<RTCRtpSender>();
  const [UI2localAudioSender, setUI2LocalAudioSender] = useState<RTCRtpSender>();
  const [UI2remoteAudioSender, setUI2RemoteAudioSender] = useState<RTCRtpSender>();
  const [UI2localVideoSender, setUI2LocalVideoSender] = useState<RTCRtpSender>();
  const [UI2remoteVideoSender, setUI2RemoteVideoSender] = useState<RTCRtpSender>();
  const [pcUI1receiveChannel, setpcUI1ReceiveChannel] = useState<RTCDataChannel>();
  const [pcUI1sendChannel, setpcUI1SendChannel] = useState<RTCDataChannel>();
  const [pcUI2receiveChannel, setpcUI2ReceiveChannel] = useState<RTCDataChannel>();
  const [pcUI2sendChannel, setpcUI2SendChannel] = useState<RTCDataChannel>();
  const [localParticipants, setLocalParticipants] = useState<any[]>([]);
  const [ui1callAccepted, setui1callAccepted] = useState(false);
  const [ui2callAccepted, setui2callAccepted] = useState(false);
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    roomName, participant, module_, study, configuration
  } = props;

  thisExtension = participant.extension;

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

  const endCall = () => {
    setIsCallTimerActive(false);
    setElapsedTime(0);
  };

  const emitEvent = (eventName: string, extension: string, data: any = {}) => {
    // Some events don't need this info, but easier to always include it anyway
    data.roomName = roomName;
    data.socketID = socket.id;
    data.sourceExt = thisExtension;
    data.destinationExt = extension;
    socket.emit(eventName, data);
  };

  function handleUI1ICECandidateEvent(e: any) {
    if (e.candidate) {
      emitEvent('iceCandidate', UI1ExtensionLocal, { candidate: e.candidate });
    }
  }

  function handleUI2ICECandidateEvent(e: any) {
    if (e.candidate) {
      emitEvent('iceCandidate', UI2Extension, { candidate: e.candidate });
    }
  }

  function handleNewICECandidateMsgUI1(data: any) {
    const candidate = new RTCIceCandidate(data.candidate);
    if (peerConnectionUI1) {
      peerConnectionUI1.addIceCandidate(candidate)
        .catch((e: any) => console.log(e));
    }
  }

  function handleNewICECandidateMsgUI2(data: any) {
    const candidate = new RTCIceCandidate(data.candidate);
    if (peerConnectionUI2) {
      peerConnectionUI2.addIceCandidate(candidate)
        .catch((e: any) => console.log(e));
    }
  }

  /**
   * Receive Channel Event Functions
   */

  function handleReceiveMessage(msg: any) {
    console.log(`Received message ${JSON.stringify(msg)}`);
    // MAY NEED THIS LOGIC
    // this.translateChatIfNecessary(msg, senderName, senderLanguage, this.state.myLanguage);
  }

  function handleRemoteStreamUI1Added(event: RTCTrackEvent) {
    remoteViewUI1stream = event.streams[0];
    if (remoteViewUI1stream && peerConnectionUI1 && !gotUI1remoteStream) {
      // setRemoteVideoSender(
      //   peerConnection.addTrack(remoteStream.getVideoTracks()[0], remoteStream)
      // );
      setUI1RemoteAudioSender(
        peerConnectionUI1.addTrack(remoteViewUI1stream.getAudioTracks()[0], remoteViewUI1stream)
      );
      gotUI1remoteStream = true;
    }
    if (remoteAudioView.current) {
      remoteAudioView.current.srcObject = event.streams[0];
    }

    UI1recorderOut = new MediaRecorder(remoteViewUI1stream);

    UI1recorderOut.onstart = () => {
      // emitEvent('startCaptions', UI1Extension,
      // { participantExtension: UI1Extension, participantName: 'Participant 3' });
    };

    UI1recorderOut.onstop = () => {
      const tracks = remoteViewUI1stream.getTracks();
      tracks.forEach((track) => track.stop());
      UI1recorderOut = null;
    };

    UI1recorderOut.ondataavailable = (evt) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const dataUrl = reader.result;
        // @ts-ignore
        const base64EncodedData = dataUrl.split(',')[1];
        emitEvent('audioDataCalleeOut', UI1Extension, { src: 'out', audio: base64EncodedData });
      });
      reader.readAsDataURL(evt.data);
    };

    UI1recorderOut.start(500);
  }

  function handleRemoteUI2StreamAdded(event: RTCTrackEvent) {
    remoteViewUI2stream = event.streams[0];
    if (remoteViewUI2stream && peerConnectionUI2 && !gotUI2remoteStream) {
      setUI2RemoteVideoSender(
        peerConnectionUI2.addTrack(remoteViewUI2stream.getVideoTracks()[0], remoteViewUI2stream)
      );
      setUI2RemoteAudioSender(
        peerConnectionUI2.addTrack(remoteViewUI2stream.getAudioTracks()[0], remoteViewUI2stream)
      );
      gotUI2remoteStream = true;
    }
    if (remoteVideoView.current) {
      remoteVideoView.current.srcObject = event.streams[0];
      setui2callAccepted(true);
    }

    UI2recorderOut = new MediaRecorder(remoteViewUI2stream);
    UI2recorderOut.start(500);

    UI2recorderOut.onstart = () => {
      // emitEvent('startCaptions', UI2Extension,
      // { participantExtension: UI2Extension, participantName: UI2name });
    };

    UI2recorderOut.onstop = () => {
      const tracks = remoteViewUI2stream.getTracks();
      tracks.forEach((track) => track.stop());
      UI2recorderOut = null;
    };

    UI2recorderOut.ondataavailable = (evt: any) => {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const dataUrl = reader.result;
        // @ts-ignore
        const base64EncodedData = dataUrl.split(',')[1];
        emitEvent('audioDataCallerOut', UI2Extension, { src: 'out', audio: base64EncodedData });
      });
      reader.readAsDataURL(evt.data);
    };
  }

  function onSendChannelStateChange() {
    console.log(`SEND CHANNEL STATE IS ${pcUI2sendChannel}`);
  }

  // Capture specific messages such as offer and answer through the data channel
  function onSendChannelMessage(msg: any) {
    console.log(`GOT PC MESSAGE ${JSON.stringify(msg)}`);
  }

  function handleReceiveChannelStatusChange() {
    console.log('RECEIVE CHANNEL STATUS CHANGE TO ');
  }

  function pcUI1receiveChannelCallback(event: any) {
    const tempReceiveChannel = event.channel;
    if (event.channel) {
      tempReceiveChannel.onmessage = handleReceiveMessage;
      tempReceiveChannel.onopen = handleReceiveChannelStatusChange;
      tempReceiveChannel.onclose = handleReceiveChannelStatusChange;
      setpcUI1ReceiveChannel(tempReceiveChannel);
    }
  }

  function createPeerConnectionUI1() {
    try {
      peerConnectionUI1 = new RTCPeerConnection(iceConfiguration);
    } catch (e: any) {
      console.log(`FAILED TO CREATE PEER CONNECTION: ${e}`);
    }
  }

  function createPeerConnectionUI2() {
    try {
      peerConnectionUI2 = new RTCPeerConnection(iceConfiguration);
    } catch (e: any) {
      console.log(`FAILED TO CREATE PEER CONNECTION: ${e}`);
    }
  }

  function pcUI2receiveChannelCallback(event: any) {
    const tempReceiveChannel = event.channel;
    if (event.channel) {
      tempReceiveChannel.onmessage = handleReceiveMessage;
      tempReceiveChannel.onopen = handleReceiveChannelStatusChange;
      tempReceiveChannel.onclose = handleReceiveChannelStatusChange;
      setpcUI2ReceiveChannel(tempReceiveChannel);
    }
  }

  function pcUI1handleNegotiationNeeded() {
    if (peerConnectionUI1 && !offerCreatedUI1) {
      peerConnectionUI1.createOffer()
        .then(
          (offer) => peerConnectionUI1?.setLocalDescription(offer)
        )
        .then(() => {
          emitEvent('sendOffer', UI1ExtensionLocal, { sdp: peerConnectionUI1?.localDescription });
          offerCreatedUI1 = true;
        })
        .catch((e) => console.log(e));
    }
  }

  function pcUI2handleNegotiationNeeded() {
    if (peerConnectionUI2 && !offerCreatedUI2) {
      peerConnectionUI2.createOffer()
        .then(
          (offer) => peerConnectionUI2?.setLocalDescription(offer)
        )
        .then(() => {
          offerCreatedUI2 = true;
        })
        .catch((e) => console.log(e));
    }
  }

  /**
   * Peer connection structure for hearing user
   */
  function peerConnectionSetupStructureUI1() {
    const promise = new Promise((resolve) => {
      createPeerConnectionUI1();
      resolve('PEER CONNECTION CREATED');
    });
    promise.then(() => {
      if (peerConnectionUI1) {
        peerConnectionUI1.onicecandidate = handleUI1ICECandidateEvent;
        peerConnectionUI1.ontrack = handleRemoteStreamUI1Added;
        peerConnectionUI1.ondatachannel = pcUI1receiveChannelCallback;
        peerConnectionUI1.onnegotiationneeded = pcUI1handleNegotiationNeeded;
      }
    })
      .then(() => {
        if (peerConnectionUI1) {
          setpcUI1SendChannel(peerConnectionUI1.createDataChannel(`sendDataChannel${roomName}`));
        }
      })
      .then(() => {
        const tempSendChannel = pcUI1sendChannel;
        if (tempSendChannel) {
          tempSendChannel.onopen = onSendChannelStateChange;
          tempSendChannel.onclose = onSendChannelStateChange;
          tempSendChannel.onmessage = onSendChannelMessage;
        }
        setpcUI1SendChannel(tempSendChannel);
      })
      .then(() => {
        if (selfViewUI1stream && peerConnectionUI1) {
          // setLocalVideoSender(
          //   peerConnection.addTrack(selfViewStream?.getVideoTracks()[0], selfViewStream)
          // );
          setUI1LocalAudioSender(
            peerConnectionUI1.addTrack(selfViewUI1stream?.getAudioTracks()[0], selfViewUI1stream)
          );
        }
      });
  }

  // Create peer connection and then establish send channels and tracks
  function peerConnectionSetupStructureUI2() {
    const promise = new Promise((resolve) => {
      createPeerConnectionUI2();
      resolve('PEER CONNECTION CREATED');
    });
    promise.then(() => {
      if (peerConnectionUI2) {
        peerConnectionUI2.onicecandidate = handleUI2ICECandidateEvent;
        peerConnectionUI2.ontrack = handleRemoteUI2StreamAdded;
        peerConnectionUI2.ondatachannel = pcUI2receiveChannelCallback;
        peerConnectionUI2.onnegotiationneeded = pcUI2handleNegotiationNeeded;
      }
    })
      .then(() => {
        if (peerConnectionUI2) {
          setpcUI2SendChannel(peerConnectionUI2.createDataChannel(`sendDataChannel${roomName}`));
        }
      })
      .then(() => {
        const tempSendChannel = pcUI2sendChannel;
        if (tempSendChannel) {
          tempSendChannel.onopen = onSendChannelStateChange;
          tempSendChannel.onclose = onSendChannelStateChange;
          tempSendChannel.onmessage = onSendChannelMessage;
        }
        setpcUI2SendChannel(tempSendChannel);
      })
      .then(() => {
        if (selfViewUI2stream && peerConnectionUI2) {
          setUI2LocalVideoSender(
            peerConnectionUI2.addTrack(selfViewUI2stream?.getVideoTracks()[0], selfViewUI2stream)
          );
          setUI2LocalAudioSender(
            peerConnectionUI2.addTrack(selfViewUI2stream?.getAudioTracks()[0], selfViewUI2stream)
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

  function handleReceiveCallUI1(data: any) {
    peerConnectionSetupStructureUI1();
    if (peerConnectionUI1) {
      const desc = new RTCSessionDescription(data.sdp);
      peerConnectionUI1.setRemoteDescription(desc)
        .then(() => peerConnectionUI1?.createAnswer())
        .then((answer) => peerConnectionUI1?.setLocalDescription(answer))
        .then(() => {
          emitEvent('sendAnswer', UI1ExtensionLocal, { sdp: peerConnectionUI1?.localDescription });
        });
    }
  }

  function handleReceiveCallUI2(data: any) {
    peerConnectionSetupStructureUI2();
    if (peerConnectionUI2) {
      const desc = new RTCSessionDescription(data.sdp);
      peerConnectionUI2.setRemoteDescription(desc)
        .then(() => peerConnectionUI2?.createAnswer())
        .then((answer) => peerConnectionUI2?.setLocalDescription(answer))
        .then(() => {
          emitEvent('sendAnswer', UI2Extension, { sdp: peerConnectionUI2?.localDescription });
        });
    }
  }

  const endCallUI1 = () => {
    setui1callAccepted(false);
    if (!receivedHangupUI1) {
      emitEvent('sendEndCall', UI1Extension);
    }
    emitEvent('leaveRoom', UI1Extension);

    selfViewUI1stream?.getTracks().forEach((track: any) => track.stop());
    if (selfAudioView.current) {
      selfAudioView.current.pause();
      selfAudioView.current.src = '';
      selfAudioView.current.srcObject = null;
      selfAudioView.current.load();
    }
    remoteViewUI1stream?.getTracks().forEach((track: any) => track.stop());
    if (remoteAudioView.current) {
      remoteAudioView.current.pause();
      remoteAudioView.current.src = '';
      remoteAudioView.current.srcObject = null;
      remoteAudioView.current.load();
    }

    if (pcUI1receiveChannel) {
      pcUI1receiveChannel.close();
    }
    if (pcUI1sendChannel) {
      pcUI1sendChannel.close();
    }
    if (peerConnectionUI1) {
      peerConnectionUI1.onicecandidate = null;
      peerConnectionUI1.ontrack = null;
      if (pcUI1sendChannel?.readyState !== 'closed' && peerConnectionUI1.signalingState !== 'closed') {
        if (UI1localAudioSender) {
          peerConnectionUI1.removeTrack(UI1localAudioSender);
        }
        if (UI1remoteAudioSender) {
          peerConnectionUI1.removeTrack(UI1remoteAudioSender);
        }
        peerConnectionUI1.close();
      }
      peerConnectionUI1 = null;
    }

    /*
    if (recorderMic) {
      recorderMic.stop();
    }
    */
    if (UI1recorderOut) {
      UI1recorderOut.stop();
    }
    receivedCall = false;
    sawOfferUI1 = false;
    sawAnswerUI1 = false;
    setUI1Extension('');
    gotUI1remoteStream = false;
    offerCreatedUI1 = false;
    receivedHangupUI1 = false;

    // navigate(-1);
  };

  const endCallUI2 = () => {
    setui2callAccepted(false);
    if (!receivedHangupUI2) {
      emitEvent('sendEndCall', UI2Extension);
    }

    selfViewUI2stream?.getTracks().forEach((track: any) => track.stop());
    if (selfVideoView.current) {
      selfVideoView.current.pause();
      selfVideoView.current.src = '';
      selfVideoView.current.srcObject = null;
      selfVideoView.current.load();
    }
    remoteViewUI2stream?.getTracks().forEach((track: any) => track.stop());
    if (remoteVideoView.current) {
      remoteVideoView.current.pause();
      remoteVideoView.current.src = '';
      remoteVideoView.current.srcObject = null;
      remoteVideoView.current.load();
    }

    if (pcUI2receiveChannel) {
      pcUI2receiveChannel.close();
    }
    if (pcUI2sendChannel) {
      pcUI2sendChannel.close();
    }
    if (peerConnectionUI2) {
      peerConnectionUI2.onicecandidate = null;
      peerConnectionUI2.ontrack = null;
      if (pcUI2sendChannel?.readyState !== 'closed' && peerConnectionUI2.signalingState !== 'closed') {
        if (UI2localVideoSender) {
          peerConnectionUI2.removeTrack(UI2localVideoSender);
        }
        if (UI2localAudioSender) {
          peerConnectionUI2.removeTrack(UI2localAudioSender);
        }
        if (UI2remoteVideoSender) {
          peerConnectionUI2.removeTrack(UI2remoteVideoSender);
        }
        if (UI2remoteAudioSender) {
          peerConnectionUI2.removeTrack(UI2remoteAudioSender);
        }
        peerConnectionUI2.close();
      }
      peerConnectionUI2 = null;
    }

    /*
    if (recorderMic) {
      recorderMic.stop();
    }
    */
    if (UI2recorderOut) {
      UI2recorderOut.stop();
    }
    receivedCall = false;
    sawOfferUI2 = false;
    sawAnswerUI2 = false;
    UI2Extension = '';
    gotUI2remoteStream = false;
    offerCreatedUI2 = false;
    receivedHangupUI2 = false;

    // navigate(-1);
  };

  useEffect(() => {
    if (window.innerHeight <= 690) { // 690 is when scroll bar is active
      // If height is less than globalUI container height, assign static height
      // this height includes space from scroll bar
      setBodyHeight(690);
    } else {
      // else assign view height
      setBodyHeight(window.innerHeight);
    }

    socket = io({ path: `${process.env.REACT_APP_LOCATION}/socket.io` });

    if (debugEvents) {
      socket.onAny((event: string, data: any) => {
        console.log(`Received event: ${event} \n with data: ${JSON.stringify(data)}\n`);
      });
    }

    // todo??
    // const duplicatesRemoved = [] as any;
    // const handleParticipantsJoined = (participantsArray: any) => {
    //   // @ts-ignore: 2802
    //   const pArray = [...new Set(participantsArray)];
    //   console.log('participantArray', participantsArray);
    //   console.log('pArray', pArray);
    //   pArray.forEach((item: any) => {
    //     let duplicate = false;
    //     if (duplicatesRemoved.length > 0) {
    //       duplicatesRemoved.forEach((dItem: any) => {
    //         if (dItem.ext === item.ext) {
    //           duplicate = true;
    //         }
    //       });
    //       if (!duplicate) {
    //         duplicatesRemoved.push(item);
    //         setLocalParticipants((prev) => [...prev, item]);
    //       }
    //     } else {
    //       duplicatesRemoved.push(item);
    //       setLocalParticipants((prev) => [...prev, item]);
    //     }
    //   });
    //   console.log('duplicatesRemoved', pArray);
    // };

    const duplicatesRemoved = [] as any;
    const handleParticipantsJoined = (participantsArray: any) => {
      participantsArray.forEach((item: any) => {
        let duplicate = false;
        if (duplicatesRemoved.length > 0) {
          duplicatesRemoved.forEach((dItem: any) => {
            if (dItem.ext === item.ext) {
              duplicate = true;
            }
          });
          if (!duplicate) {
            duplicatesRemoved.push(item);
            setLocalParticipants((prev) => [...prev, item]);
          }
        } else {
          duplicatesRemoved.push(item);
          setLocalParticipants((prev) => [...prev, item]);
        }
      });
      // console.log('duplicatesRemoved', duplicatesRemoved);
    };

    socket.on('connect', () => {
      // emitEvent('joinRoom', UI1ExtensionLocal, { participant });
      // emitEvent('joinRoom', UI2Extension, { participant });
      emitEvent('joinRoom', thisExtension, { participant });

      socket
        .on('participantHasJoined', (data: any) => {
          handleParticipantsJoined(data);
        })
        .on('incomingCall', (data: any) => {
          if (!receivedCall) {
            UI2Extension = data.callingExtension;
            emitEvent('initStudyCallee', UI2Extension, {
              study,
              module_,
              configuration,
              receivingExtension: thisExtension,
              callingExtension: UI2Extension
            });
            receivedCall = true;
            setOpenDialog(true);
          }
        })
        // When dialing user we need to see when they accept
        .on('callAccepted', () => {
          setui1callAccepted(true);
          setWaitingForCallAccept(false);
          peerConnectionSetupStructureUI1();
        })
        // Used for calls with UI1 specifically
        .on('gotMessage', (data: any) => {
          if (thisExtension !== data.sourceExt) {
            handleReceiveMessage(data);
          }
        })
        .on('receiveOffer', (data: any) => {
          setIsCallTimerActive(true);
          if (!sawOfferUI2 && data.sourceExt === UI2Extension) {
            handleReceiveCallUI2(data);
            sawOfferUI2 = true;
          } else if (!sawOfferUI1) {
            handleReceiveCallUI1(data);
            sawOfferUI1 = true;
          }
        })
        .on('receiveAnswer', (data: any) => {
          if (!sawAnswerUI2 && data.sourceExt === UI2Extension) {
            if (peerConnectionUI2) {
              const desc = new RTCSessionDescription(data.sdp);
              peerConnectionUI2.setRemoteDescription(desc).catch((e) => console.log(e));
            }
            sawAnswerUI2 = true;
          } else if (!sawAnswerUI1) {
            if (peerConnectionUI1) {
              const desc = new RTCSessionDescription(data.sdp);
              peerConnectionUI1.setRemoteDescription(desc).catch((e) => console.log(e));
            }
            sawAnswerUI1 = true;
          }
          // setIsCallTimerActive(true);
        })
        .on('iceCandidate', (data: any) => {
          if (data.sourceExt === UI2Extension) {
            handleNewICECandidateMsgUI2(data);
          } else {
            handleNewICECandidateMsgUI1(data);
          }
        })
        .on('receiveEndCall', (data: any) => {
          setWaitingForCallAccept(false);
          if (data.sourceExt === UI2Extension) {
            receivedHangupUI2 = true;
            endCallUI2();
          } else {
            receivedHangupUI1 = true;
            endCallUI1();
          }
          endCall();
        });
    });
    return (() => {
      if (selfViewUI1stream) {
        selfViewUI1stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (selfViewUI2stream) {
        selfViewUI2stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (socket) {
        emitEvent('leaveRoom', UI1ExtensionLocal);
        emitEvent('leaveRoom', UI2Extension);
        socket.off();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateExtension = (e: string) => {
    setUI1Extension(e);
    UI1ExtensionLocal = e;
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptCallUI2 = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((stream) => {
        selfViewUI2stream = stream;
        if (selfVideoView.current) {
          selfVideoView.current.srcObject = stream;
        }
      })
      .then(() => {
        if (socket) {
          emitEvent('acceptCall', UI2Extension);
        }
      });
    setOpenDialog(false);
  };

  const numPressed = useCallback((event: React.FormEvent<HTMLButtonElement>, digit: string) => {
    if (UI1Extension.length < 10) {
      UI1ExtensionLocal += digit;
      setUI1Extension((prevExt) => prevExt + digit);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UI1Extension]);

  const createCall = () => {
    emitEvent('initiateCall', UI1Extension, { sourceName: participant.name });
    setWaitingForCallAccept(true);
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      selfViewUI1stream = stream;
      if (selfAudioView.current) {
        selfAudioView.current.srcObject = stream;
      }
    });
  };

  function endBothCalls() {
    endCallUI1();
    endCallUI2();
  }
  const doAction = () => {
    console.log('clicked');
  };

  const renderCallStatus = (part: any) => {
    switch (part) {
      case 'CommunicationsAssistant':
        return <FontAwesomeIcon icon={faCircle} aria-hidden="true" style={{ color: 'green' }} />;
      case 'Participant1':
        return <FontAwesomeIcon icon={faCircle} aria-hidden="true" style={{ color: `${ui1callAccepted ? 'green' : 'orange'}` }} />;
      case 'Participant2':
        return <FontAwesomeIcon icon={faCircle} aria-hidden="true" style={{ color: `${ui2callAccepted ? 'green' : 'orange'}` }} />;
      default:
        return <FontAwesomeIcon icon={faCircle} aria-hidden="true" style={{ color: 'orange' }} />;
    }
  };

  useEffect(() => {
    console.log('localParticipants: ', localParticipants);
    console.log('configuration: ', configuration);
    console.log('roomName: ', roomName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localParticipants]);

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        createCall();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UI1Extension]);

  return (
    <Container
      id="ca-page-container"
      fluid
      style={{
        // height: `${bodyHeight} px`
      }}
    >
      {/* <div className="ca-page-banner">
        <NavigationBar />
      </div> */}
      <div style={{ display: 'none' }}>
        <audio
          ref={selfAudioView}
          controls
          autoPlay
          muted
        >
          <track kind="captions" />
        </audio>
      </div>
      <div style={{ display: 'none' }}>
        <audio
          ref={remoteAudioView}
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
                captionsEnabled
                remoteStreamRef={remoteAudioView}
              />
            </div>
          </Col>
        </Col>
        <Col style={{ padding: '0' }} />
      </Row>
      <div id="ca-page-body">
        <div className="study-title">
          <div className="study-name">{roomName}</div>
          <div className="disconnect-button-div">
            <ADSButton
              className="disconnect-button"
              onClick={() => endBothCalls()}
              buttonText="Disconnect"
            />
          </div>
        </div>
        <div className="call-container">
          <div className="dial-participant-container">
            <ADSAccordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>DIAL</Accordion.Header>
                <Accordion.Body>
                  <div className="dial-div">
                    <ADSSingleLineTextField
                      formText={UI1Extension}
                      setFormText={updateExtension}
                      formLabel="Extension"
                      isFormLabelHidden={false}
                      hasDelete
                      elementID="ca-extension-input"
                    />
                    <div className={waitingForCallAccept ? 'ca-waiting-msg' : 'hidden'} aria-hidden={waitingForCallAccept}>
                      Waiting to Connect...
                    </div>
                    <ADSAlphanumericDialPad numPressed={numPressed} background="dark" />
                    <ADSButton
                      id="ca-call-button"
                      onClick={() => createCall()}
                      disabled={waitingForCallAccept}
                      buttonText="Call"
                      variant="primary"
                      height="medium"
                      icon={faPhone}
                    />
                  </div>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>CALL PARTICIPANTS</Accordion.Header>
                <Accordion.Body>
                  {localParticipants.map((part: any) => (
                    <div className="participant-container" key={part.ext}>
                      <div className="participant-div participant2">
                        <div className="status-div">
                          {renderCallStatus(part.name)}
                        </div>
                        Extension: {part.ext}
                        {part.name === 'CommunicationsAssistant'
                          ? (
                            <div className="call-participant-list-item">
                              <span className="privacy-btn">
                                <ADSTooltip content="Turn off Video" placement="top">
                                  <ADSIconButton
                                    onClick={doAction}
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
                                    onClick={doAction}
                                    variant="standard"
                                    height="medium"
                                    icon={faMicrophone}
                                    ariaLabel="standard icon"
                                    disabled
                                  />
                                </ADSTooltip>
                              </span>
                            </div>
                          ) : (
                            <div className="ca-page-button">
                              <ADSIconButton
                                ariaLabel="hangup icon"
                                onClick={part.name === 'Participant1' ? endCallUI1 : endCallUI2}
                                variant="filled"
                                height="small"
                                icon={faPhone}
                                disabled={part.name === 'Participant1' ? !ui1callAccepted : !ui2callAccepted}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            </ADSAccordion>
          </div>
          <div className="vrs-container">
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
                      onClick={doAction}
                      variant="standard"
                      height="medium"
                      icon={faMaximize}
                      ariaLabel="standard icon"
                      disabled
                    />
                  </ADSTooltip>
                </span>
                {/* <span className="privacy-btn">
                  <ADSTooltip content="Turn off Video" placement="top">
                    <ADSIconButton
                      onClick={doAction}
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
                      onClick={doAction}
                      variant="standard"
                      height="medium"
                      icon={faMicrophoneSlash}
                      ariaLabel="standard icon"
                      disabled
                    />
                  </ADSTooltip>
                </span> */}
                {/* <span className="hangup-btn">
                  <ADSButton
                    id="vrs-hangup-button"
                    className="ca-page-button"
                    buttonText="Hang Up"
                    variant="hangup"
                    icon={faPhone}
                  />
                </span> */}
              </div>
            </div>
            <div className="video-container">
              <div className="video-self">
                <ADSVideoComponent
                  videoType="self-view"
                  videoRef={selfVideoView}
                />
              </div>
              <div className="video-remote">
                <ADSVideoComponent
                  videoType="remote-view"
                  videoRef={remoteVideoView}
                />
              </div>
              {/* <video
                style={{ outline: 'black solid 2px' }}
                ref={selfVideoView}
                autoPlay
                muted
              >
                <track kind="captions" />
              </video> */}
              {/* <video
                style={{ outline: 'black solid 2px' }}
                ref={remoteVideoView}
                autoPlay
              >
                <track kind="captions" />
              </video> */}
            </div>
          </div>
        </div>
      </div>
      <ADSDialog
        title="Incoming Connection"
        buttons={(
          <>
            <ADSButton onClick={handleAcceptCallUI2} buttonText="Accept" width="100%" variant="primary" />
            <ADSButton onClick={endCallUI2} buttonText="Decline" width="100%" variant="secondary" />
          </>
        )}
        onClose={handleCloseDialog}
        open={openDialog}
        width="xs"
      />
    </Container>
  );
}

ParticipantCApage.defaultProps = {
  study: null,
  module_: null,
  configuration: null
};

export default ParticipantCApage;
