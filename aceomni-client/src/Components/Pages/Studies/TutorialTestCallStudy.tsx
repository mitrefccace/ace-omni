/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-destructuring */
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
let sawOffer = false;
let sawAnswer = false;
let callingNumber: string;
let myNumber: string;
let gotRemoteStream: boolean = false;
let selfViewStream: MediaStream;
let remoteStream: MediaStream;
let offerCreated = false; // prevent multiple offers from firing. why does this happen?

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

function TutorialTestCallStudy() {
  const { experimentname } = useParams();
  const [inRoom, setInRoom] = useState(false);
  // const [myNumber, setMyNumber] = useState('');
  // const [callingNumber, setCallingNumber] = useState('');
  // const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);

  // Maybe?
  // const [inCall, setInCall] = useState(false);
  const [localVideoSender, setLocalVideoSender] = useState<RTCRtpSender>();
  const [localAudioSender, setLocalAudioSender] = useState<RTCRtpSender>();
  const [remoteVideoSender, setRemoteVideoSender] = useState<RTCRtpSender>();
  const [remoteAudioSender, setRemoteAudioSender] = useState<RTCRtpSender>();
  const [receiveChannel, setReceiveChannel] = useState<RTCDataChannel>();
  const [sendChannel, setSendChannel] = useState<RTCDataChannel>();

  const selfView = useRef<HTMLVideoElement>(null);
  const remoteView = useRef<HTMLVideoElement>(null);

  const updateMyNumber = (value: any) => {
    myNumber = value;
  };

  const updateCallingNumber = (value: any) => {
    // setCallingNumber(value);
    callingNumber = value;
  };

  /**
   * Begin functions for peer connection
   */

  function handleRemoteStreamAdded(event: RTCTrackEvent) {
    console.log(`GOT REMOTE STREAM EVENT ${event.streams.length}`);
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
  }

  function handleICECandidateEvent(e: any) {
    if (e.candidate) {
      const payload = {
        target: callingNumber,
        candidate: e.candidate,
        socketid: socket.id,
        roomName: experimentname,
        displayName: sessionStorage.getItem('omniUsername') || '',
        myNumber,
        callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10)
      };
      socket.emit('iceCandidate', payload);
    }
  }

  function handleNewICECandidateMsg(data: any) {
    console.log('DATA', data.candidate);
    const candidate = new RTCIceCandidate(data.candidate);
    if (peerConnection) {
      peerConnection.addIceCandidate(candidate)
        .catch((e: any) => console.log(e));
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

  function handleNegotiationNeeded() {
    if (peerConnection && !offerCreated) {
      peerConnection.createOffer().then(
        (offer) => peerConnection?.setLocalDescription(offer)
      ).then(() => {
        if (isInitiator) {
          const payload = {
            target: callingNumber,
            caller: myNumber,
            sdp: peerConnection?.localDescription,
            socketid: socket.id,
            roomName: experimentname,
            displayName: sessionStorage.getItem('omniUsername') || '',
            myNumber,
            callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10)
          };
          console.log('EMITTING OFFER', myNumber);
          socket.emit('sendOffer', payload);
        }
        offerCreated = true;
      }).catch((e) => console.log(e));
    }
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
        peerConnection.onicecandidate = handleICECandidateEvent;
        peerConnection.ontrack = handleRemoteStreamAdded;
        peerConnection.ondatachannel = receiveChannelCallback;
        peerConnection.onsignalingstatechange = peerConnectionStateChanged;
        peerConnection.onnegotiationneeded = handleNegotiationNeeded;
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
    const desc = new RTCSessionDescription(data.sdp);
    if (peerConnection) {
      peerConnection.setRemoteDescription(desc)
        .then(() => peerConnection?.createAnswer())
        .then((answer) => peerConnection?.setLocalDescription(answer))
        .then(() => {
          const payload = {
            target: callingNumber,
            caller: myNumber,
            sdp: peerConnection?.localDescription,
            socketid: socket.id,
            roomName: experimentname,
            displayName: sessionStorage.getItem('omniUsername') || '',
            myNumber,
            callingNumber: parseInt(callingNumber.replace(/[^0-9]/g, ''), 10)
          };
          socket.emit('sendAnswer', payload);
        });
    }
  }

  // Specific for if you start a call as only the initiator could make the socket call
  const createCall = () => {
    isInitiator = true;
    peerConnectionSetupStructure();
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
  };

  const endCall = () => {
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

      selfViewStream = new MediaStream();
      remoteStream = new MediaStream();
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
      selfViewStream = stream;

      if (selfView.current) {
        selfView.current.srcObject = stream;
      }
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
        // Set the initiator's number
        .on('incomingCall', (data: any) => {
          console.log('got incomingCall');
          if (!receivedCall) {
            console.log(`GETTING CALL ${JSON.stringify(data)}`);
            callingNumber = data.myNumber;
            // setCallingNumber(data.myNumber);
            receivedCall = true;
          }
        })
        .on('receiveOffer', (data) => {
          console.log('got offer');
          if (!sawOffer) {
            handleReceiveCall(data);
            sawOffer = true;
          }
        })
        .on('receiveAnswer', (data) => {
          console.log('got answer');
          if (!sawAnswer) {
            const desc = new RTCSessionDescription(data.sdp);
            if (peerConnection) {
              peerConnection.setRemoteDescription(desc).catch((e) => console.log(e));
            }
            sawAnswer = true;
          }
        })
        .on('iceCandidate', (data) => {
          handleNewICECandidateMsg(data);
        });
    });
    return (() => {
      if (selfViewStream) {
        selfViewStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
      if (selfViewStream) {
        selfViewStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    });
  }, []); // [socket.id]

  return (
    <div style={{ border: '5px solid pink' }}>
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
            disabled={false}
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

export default TutorialTestCallStudy;
