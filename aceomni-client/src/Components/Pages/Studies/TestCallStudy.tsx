/* eslint-disable prefer-destructuring */
/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import ADSSingleLineTextField from '../../ADSSingleLineTextField';
import ADSButton from '../../ADSButton';

const socket = io({ path: `${process.env.REACT_APP_LOCATION}/socket.io` });
let peerConnection: RTCPeerConnection | null;
let receivedCall = false;
let isInitiator = false;
let createdPeerConnection = false;
let sawOffer = false;
let sawAnswer = false;
let callingNumber: string;
let gotRemoteStream: boolean = false;
let selfViewStreamTest: MediaStream;
let remoteStreamTest: MediaStream;

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

function TestCallStudy() {
  const { experimentname } = useParams();
  const [inRoom, setInRoom] = useState(false);
  const [myNumber, setMyNumber] = useState('');
  // const [callingNumber, setCallingNumber] = useState('');
  // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  // Maybe?
  const [sawOfferOrAnswer, setSawOfferOrAnswer] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [localVideoSender, setLocalVideoSender] = useState<RTCRtpSender>();
  const [localAudioSender, setLocalAudioSender] = useState<RTCRtpSender>();
  const [remoteVideoSender, setRemoteVideoSender] = useState<RTCRtpSender>();
  const [remoteAudioSender, setRemoteAudioSender] = useState<RTCRtpSender>();
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel>();
  const [sendChannel, setSendChannel] = useState<RTCDataChannel>();

  const selfView = useRef<HTMLVideoElement>(null);
  const [selfViewStream, setSelfViewStream] = useState<MediaStream>();
  const remoteView = useRef<HTMLVideoElement>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream>();

  const updateMyNumber = (value: any) => {
    setMyNumber(value);
  };

  const updateCallingNumber = (value: any) => {
    // setCallingNumber(value);
    callingNumber = value;
  };

  /**
   * Begin functions for peer connection
   */

  function handleIceCandidate(event: RTCPeerConnectionIceEvent) {
    // console.log(`SENDING ICE CANDIDATE ${event.candidate?.candidate}`);
    socket.emit(
      'gotICEcandidate',
      {
        type: 'candidate',
        label: event.candidate?.sdpMLineIndex,
        id: event.candidate?.sdpMid,
        candidate: event.candidate?.candidate,
        roomName: experimentname,
        callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10)
      }
    );
  }

  function handleRemoteStreamAdded(event: RTCTrackEvent) {
    console.log(`GOT REMOTE STREAM EVENT ${event.streams.length}`);
    setRemoteStream(event.streams[0]);
    remoteStreamTest = event.streams[0];
    if (remoteStreamTest && peerConnection && !gotRemoteStream) {
      setRemoteVideoSender(peerConnection.addTrack(remoteStreamTest.getVideoTracks()[0], remoteStreamTest));
      setRemoteAudioSender(peerConnection.addTrack(remoteStreamTest.getAudioTracks()[0], remoteStreamTest));
      gotRemoteStream = true;
    }
    if (remoteView.current) {
      console.log(`SETTING REMOTE STREAM TO OBJECT ${event.streams[0]}`);
      remoteView.current.srcObject = event.streams[0];
    }
  }

  /**
   * Receive Channel Event Functions
   */

  function handleReceiveMessage() {
    // MAY NEED THIS LOGIC
    // this.translateChatIfNecessary(msg, senderName, senderLanguage, this.state.myLanguage);
  }

  function handleReceiveChannelStatusChange() {
    console.log('RECEIVE CHANNEL STATUS CHANGE TO ');
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

  function onSendChannelStateChange() {
    console.log(`SEND CHANNEL STATE IS ${sendChannel}`);
  }

  // Capture specific messages such as offer and answer through the data channel
  function onSendChannelMessage(msg: any) {
    console.log(`GOT PC MESSAGE ${JSON.stringify(msg)}`);
  }

  // Used for debugging to make sure the peer connection is in the right state
  function peerConnectionStateChanged(event: Event) {
    console.log(`CURRENT STATE CHANGED TO ${peerConnection?.signalingState} FROM ${JSON.stringify(event)}`);
  }

  /**
   * End functions for peer connection
   */

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
        /* const tempPeerConnection = peerConnection;
        tempPeerConnection.onicecandidate = handleIceCandidate;
        tempPeerConnection.ontrack = handleRemoteStreamAdded;
        tempPeerConnection.ondatachannel = receiveChannelCallback;
        setPeerConnection(tempPeerConnection);
        */
        peerConnection.onicecandidate = handleIceCandidate;
        peerConnection.ontrack = handleRemoteStreamAdded;
        peerConnection.ondatachannel = receiveChannelCallback;
        peerConnection.onsignalingstatechange = peerConnectionStateChanged;
      }
    })
      .then(() => {
        if (peerConnection) {
          setSendChannel(peerConnection.createDataChannel(`sendDataChannel${experimentname}`));
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
        console.log(`SETTING TRACKS WITH SENDERS ${selfViewStreamTest}`);
        if (selfViewStreamTest && peerConnection) {
          setLocalVideoSender(
            peerConnection.addTrack(selfViewStreamTest?.getVideoTracks()[0], selfViewStreamTest)
          );
          setLocalAudioSender(
            peerConnection.addTrack(selfViewStreamTest?.getAudioTracks()[0], selfViewStreamTest)
          );
        }
      })
      .then(() => {
        if (peerConnection) {
          peerConnection.createOffer();
        }
      })
      .then((offer: any) => peerConnection?.setLocalDescription(offer))
      .then(() => {
        // Dont fire if we have already started the offer process
        if (!sawOfferOrAnswer && isInitiator) {
          console.log(`LOCAL SENDING OFFER ${callingNumber}`);
          if (peerConnection) {
            socket.emit(
              'sendNewOffer',
              {
                roomName: experimentname,
                callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10),
                type: 'offer',
                sdp: peerConnection.localDescription
              }
            );
          }
        }
      })
      .then(() => {
        setInCall(true);
      });
  }

  // The captured media stream is set to our selfview
  function gotStream(stream: MediaStream) {
    console.log(`GOT STREAM ${typeof stream}`);
    setSelfViewStream(stream);
    selfViewStreamTest = stream;
    if (selfView.current) {
      selfView.current.srcObject = stream;
      // Do we need this? setSelfVideo(stream);
      // Tells the other user to create their peer connection
      if (isInitiator) {
        socket.emit('alertRemotePC', { msg: 'got user media', roomName: experimentname, callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10) });
        peerConnectionSetupStructure();
      }
    }
  }

  // Room established and setting up webrtc streams
  function getUserMedia() {
    console.log(`GETTING USER MEDIA ${callingNumber}`);
    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    })
      .then((obtainedMedia: MediaStream) => {
        gotStream(obtainedMedia);
      })
      .catch((e: any) => {
        console.log(`GET USER MEDIA ERROR ${e}`);
      });
  }

  // Fires when user clicks the start call button
  const initiateCall = () => {
    setInCall(true);
    getUserMedia();
  };

  // Specific for if you start a call as only the initiator could make the socket call
  const createCall = () => {
    isInitiator = true;
    socket.emit(
      'initiateCall',
      {
        socketid: socket.id,
        roomName: experimentname,
        displayName: sessionStorage.getItem('omniUsername') || '',
        myNumber,
        callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10)
      }
    );
    initiateCall();
  };

  // Now that we have set the remote description to our offer we need to set out local
  // description from our answer
  function doAnswer() {
    if (peerConnection) {
      peerConnection.createAnswer()
        .then((answer: RTCSessionDescriptionInit) => {
          if (peerConnection) {
            peerConnection.setLocalDescription(answer);
            console.log(`SENDING ANSWER ${JSON.stringify(answer)}`);
            socket.emit('answerDescription', { answer, roomName: experimentname, callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10) });
          }
        });
    }
  }

  const endCall = () => {
    setInCall(false);
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
        if (remoteVideoSender) {
          peerConnection.removeTrack(remoteVideoSender);
        }
        peerConnection.close();
      }

      setSelfViewStream(new MediaStream());
      setRemoteStream(new MediaStream());
      setReceiveChannel(new RTCDataChannel());
      peerConnection = null;
    }
  };

  /**
   * User needs to enter the room with a number before making a call
   */
  const joinRoom = () => {
    setInRoom(true);
    socket.emit('joinRoom', {
      socketid: socket.id,
      roomName: experimentname,
      displayName: sessionStorage.getItem('omniUsername') || '',
      myNumber: parseInt(myNumber.replace(/[^0-9]/g, ''), 10)
    });
  };

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((stream) => {
      setSelfViewStream(stream);
      selfViewStreamTest = stream;
    });
    socket.on('connect', () => {
      console.log(`SOCKET IS LIVE ${socket.id}`);
      socket.on('gotMessage', (data: any) => {
        const sender = data.senderName;
        // const msg = data.msg;
        if (myNumber !== sender) {
          handleReceiveMessage();
        }
      })
        .on('endCall', () => {
          endCall();
        })
        .on('timeout', () => {
          endCall();
        })
        .on('createPeerConnection', () => {
          if (!createdPeerConnection) {
            console.log('CALL INITIATOR TOLD ME TO CREATE PEER CONNECTION');
            peerConnectionSetupStructure();
            createdPeerConnection = true;
          }
        })
        .on('receivedOffer', (data: any) => {
          if (!sawOffer && peerConnection) {
            setSawOfferOrAnswer(true);
            console.log(`RECEIVED PEER CONNECTION OFFER ${JSON.stringify(data.sdp)} ${peerConnection.signalingState}`);
            sawOffer = true;
            peerConnection.setRemoteDescription(data.sdp);
            doAnswer();
          }
        })
        .on('receivedAnswer', (data: any) => {
          if (!sawAnswer) {
            console.log(`RECEIVED PEER CONNECTION ANSWER ${JSON.stringify(data.answer)}`);
            setSawOfferOrAnswer(true);
            if (peerConnection) {
              peerConnection
                .setRemoteDescription(new RTCSessionDescription(data.answer))
                .then(() => {
                  console.log('SET ANSWER SUCCESS!');
                })
                .catch((error: any) => {
                  console.log(`SESSION DESCRIPTION ERROR ${error} ${peerConnection?.signalingState}`);
                });
            }
            sawAnswer = true;
          }
        })
        .on('receivedICEcandidate', (data: any) => {
          // console.log(`GOT ICE CANDIDATE ${JSON.stringify(data)} ${peerConnection?.signalingState}`);
          if (data.label && data.candidate && peerConnection) {
            const candidate = new RTCIceCandidate({
              sdpMLineIndex: data.label,
              candidate: data.candidate
            });
            peerConnection.addIceCandidate(candidate);
          }
        })
        // This call is you receiving a call from a user
        .on('incomingCall', (data: any) => {
          if (!receivedCall) {
            console.log(`GETTING CALL ${JSON.stringify(data)}`);
            callingNumber = data.myNumber;
            // setCallingNumber(data.myNumber);
            initiateCall();
            receivedCall = true;
          }
        });
    });
  }, []); // [socket.id]

  return (
    <div>
      <ADSSingleLineTextField
        formText={myNumber}
        setFormText={updateMyNumber}
        formLabel="Our Number"
        isFormLabelHidden={false}
        placeholderText=""
        isPhoneNumber
        hasDelete
        elementID="id145"
      />
      <ADSSingleLineTextField
        formText={callingNumber}
        setFormText={updateCallingNumber}
        formLabel="Who to call"
        isFormLabelHidden={false}
        placeholderText=""
        isPhoneNumber
        hasDelete
        elementID="id145"
      />

      {inRoom
        ? (
          <ADSButton
            buttonText="Start Call"
            onClick={createCall}
          />
        )
        : (
          <ADSButton
            disabled={myNumber.length <= 0}
            buttonText="Join Room"
            onClick={joinRoom}
          />
        )}
      <ADSButton
        buttonText="Hangup"
        onClick={endCall}
      />
      Self Video Here
      <video
        id="localVideo"
        ref={selfView}
        style={{ border: '2px black' }}
        autoPlay
        muted
        playsInline
      >
        <track kind="captions" />
      </video>
      <br />
      Remote Video Here
      <video
        id="remoteVideo"
        ref={remoteView}
        style={{ border: '2px black' }}
        autoPlay
        muted
        playsInline
      >
        <track kind="captions" />
      </video>

    </div>
  );
}

export default TestCallStudy;
