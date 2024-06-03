const fs = require('fs');
// const STT_Amazon = require('./cloud-services/speechtotext/amazon.js');
// const STT_Azure = require('./cloud-services/speechtotext/azure.js');
const STTGoogle = require('./cloud-services/speechtotext/google.js');
const STTWatson = require('./cloud-services/speechtotext/watson.js');
const { CallFileArrayFields } = require('./models/Call');
const { createCall, findCall, updateCall, updateCallFile } = require('./routes/call');

let roomUsersArray = [];

module.exports = (io) => {
  // Set to true to print all in/out events to console
  const debugEvents = false;

  const roomUsersMap = new Map();
  const addUserToRoom = (roomName, userExt, userName, userSocketID) => {
    if (!roomUsersMap.has(roomName)) {
      roomUsersMap.set(roomName, new Map());
    }
    roomUsersMap.get(roomName).set(userExt, { name: userName, ext: userExt, socketID: userSocketID });
  };
  const removeUserFromRoom = (roomName, userExt) => roomUsersMap.get(roomName)?.delete(userExt);
  const getSocketId = (roomName, userExt) => roomUsersMap.get(roomName)?.get(userExt)?.socketID;

  const emitEvent = (eventName, socket, roomName, destinationExt, data) => {
    if (debugEvents) {
      console.log(`Emitting event ${eventName} with payload: \n ${JSON.stringify(data)} \nto room ${roomName} user ${destinationExt}\n`);
    }
    socket.to(getSocketId(roomName, destinationExt)).emit(eventName, data);
  };

  const cleanupFiles = async (callData) => {
    // Do we need to close any file handles?
    const endTime = Date.now();
    const duration = (((endTime - Date.parse(callData.startTime)) % 60000) / 1000).toFixed(0);
    await updateCall(callData._id, { endTime, duration });
    // A little confusing, but this will automatically update all files
    // with their sizes after a call ends, even if we add more types of files later
    for (const arrayField of CallFileArrayFields) {
      for (const entry of callData[arrayField]) {
        if ('filePath' in entry) {
          const fileSize = fs.statSync(entry.filePath)?.size;
          await updateCallFile(callData._id, arrayField, entry.filePath, { fileSize });
        }
      }
    }
  };

  io.on('connection', (socket) => {
    if (debugEvents) {
      socket.onAny((event, data) => {
        if (event !== 'audioData') {
          console.log(`Received event: ${event} \n with data: ${JSON.stringify(data)}\n`);
        }
      });
    }

    socket.asrConfig = null;
    socket.dataCollectionConfig = null;

    socket.on('message', (data) => {
      const { rm, msg } = data;
      io.sockets.in(rm).emit('message', msg);
    })
      .on('joinRoom', (data) => {
        if (data.sourceExt) {
          // REMOVE DUPLICATES HERE
          roomUsersArray.push({ name: data.participant.name, ext: data.sourceExt });
        }
        const { roomName, participant, socketID } = data;
        addUserToRoom(roomName, participant.extension, participant.name, socketID);
        socket.join(roomName);
        io.to(roomName).emit('participantHasJoined', roomUsersArray);
      })
      .on('initiateCall', (data) => {
        const {
          roomName, sourceExt, sourceName, destinationExt
        } = data;
        console.log(`CALL INITIATING ${JSON.stringify(data)}`);
        emitEvent('incomingCall', socket, roomName, destinationExt, {
          roomName, callingExtension: sourceExt, callingName: sourceName, destinationExt, callData: socket.callData
        });
      })
      .on('acceptCall', (data) => {
        console.log(`ACCEPTING CALL ${JSON.stringify(data)}`);
        console.log(`ROOM DETAILS ${JSON.stringify(roomUsersMap)}`);
        emitEvent('callAccepted', socket, data.roomName, data.destinationExt);
      })
      .on('sendOffer', (data) => {
        console.log(`SENDING OFFER ${JSON.stringify(data)}`);
        emitEvent('receiveOffer', socket, data.roomName, data.destinationExt, data);
      })
      .on('sendAnswer', (data) => {
        console.log(`GOT ANSWER ${JSON.stringify(data)}`);
        emitEvent('receiveAnswer', socket, data.roomName, data.destinationExt, data);
      })
      .on('iceCandidate', (data) => {
        emitEvent('iceCandidate', socket, data.roomName, data.destinationExt, data);
      })
      .on('sendEndCall', (data) => {
        emitEvent('receiveEndCall', socket, data.roomName, data.destinationExt, data);
      })
      .on('initStudyCallee', async (data) => {
        const {
          study, module_, configuration, roomName, receivingExtension, callingExtension, callDataID
        } = data;
        console.log(`CONFIG ${JSON.stringify(configuration)}`);
        const timestamp = Date.now();
        // const calleeParticipant = configuration.participants.find((p) => p.extension === receivingExtension);
        const callingParticipant = configuration.participants.find((p) => p.extension === callingExtension);
        socket.asrConfig = configuration.participants[0].ASR1;
        socket.dataCollectionConfig = module_.dataCollection;
        try {
          
          if(roomName.indexOf('.')!=-1) throw "Invalid Room Name";
          if(callingExtension.indexOf('.')!=-1) throw "Invalid calling Extension";

          socket.callDir = `experiment-data/${roomName}-${timestamp}`;
          if (!fs.existsSync(socket.callDir)) {
            fs.mkdirSync(socket.callDir);
          }
          // If the CA is calling, this is the second call of a VRS study and callData already exists
          // This all needs to be fixed to get audio recording of VRS calls working
          if(callDataID) {
            socket.callData = await findCall(callDataID);
          }
          else {
            socket.callData = await createCall(roomName, study, module_, configuration, socket.callDir);
          }
          const audioRecordings = [];
          // We always need this file to make captions work, it relays the audio to the ASR engine
          socket.callerAudioFileOut = `${socket.callDir}/${roomName}-${timestamp}-${callingExtension}-out.webm`;
          fs.openSync(socket.callerAudioFileOut, 'w');
          if (socket.dataCollectionConfig.AudioRecordings.AudioStream1) {
            // socket.callerAudioFileMic = `${socket.callDir}/${roomName}-${timestamp}-${callingExtension}-mic.webm`;
            // fs.openSync(socket.callerAudioFileMic, 'w');
            // audioRecordings.push({ participantName: callingParticipant.name, participantExtension: callingExtension, filename: socket.callerAudioFileMic.split('/').pop(), filePath: socket.callerAudioFileMic, source: 'Mic' });
            // The ASR relay file from above, only save to DB if the user wants the file available for download
            audioRecordings.push({
              participantName: callingParticipant.name, participantExtension: callingExtension, filename: socket.callerAudioFileOut.split('/').pop(), filePath: socket.callerAudioFileOut, source: 'Out'
            });
          }
          socket.callData = await updateCall(socket.callData._id, { audioRecordings });
          emitEvent('callData', socket, data.roomName, callingExtension, socket.callData);
        } catch (err) {
          console.log('SOCKET: on initStudyCallee error: ', err);
        }
      })
      .on('initStudyCaller', async (data) => {
        const { callData, recordedExtension, recordedName } = data;
        const audioRecordings = [];
        try {
          if (callData.module.dataCollection.AudioRecordings.AudioStream2) {
            socket.calleeAudioFileOut = `${callData.callDir}/${callData.callDir.split('/')[1]}-${recordedExtension}-out.webm`;
            fs.openSync(socket.calleeAudioFileOut, 'w');
            audioRecordings.push({
              participantName: recordedName, participantExtension: recordedExtension, filename: socket.calleeAudioFileOut.split('/').pop(), filePath: socket.calleeAudioFileOut, source: 'Out'
            });
          }
          socket.callData = await updateCall(callData._id, { audioRecordings });
        } catch (err) {
          console.log('SOCKET: on initStudyCaller error: ', err);
        }
      })
      // TODO consider making one writestream per audio file and keeping it open for the whole call
      .on('audioDataCallerMic', (data) => {
        if (socket.callerAudioFileMic && data.audio) {
          const fileStream = fs.createWriteStream(socket.callerAudioFileMic, { flags: 'a' });
          fileStream.write(Buffer.from(data.audio, 'base64'));
        }
      })
      .on('audioDataCallerOut', (data) => {
        if (socket.callerAudioFileOut && data.audio) {
          const fileStream = fs.createWriteStream(socket.callerAudioFileOut, { flags: 'a' });
          fileStream.write(Buffer.from(data.audio, 'base64'));
        }
      })
      .on('audioDataCalleeOut', (data) => {
        if (socket.calleeAudioFileOut && data.audio) {
          const fileStream = fs.createWriteStream(socket.calleeAudioFileOut, { flags: 'a' });
          fileStream.write(Buffer.from(data.audio, 'base64'));
        }
      })
      .on('startCaptions', async (data) => {
        const { roomName, participantExtension, participantName } = data;
        let asrEngine = null;
        let wconfig = null;
        switch (socket.asrConfig.engineSTT) {
          case 'Google':
            asrEngine = new STTGoogle(socket.callerAudioFileOut);
            break;
          case 'IBM-Watson':
            wconfig = JSON.parse(
              fs.readFileSync('./cloud-services/configs/watson-stt.json')
            );
            asrEngine = new STTWatson(socket.callerAudioFileOut, wconfig);
            break;
          case 'Azure':
            break;
          case 'AWS':
            break;
          default:
            console.log('Unknown ASR engine, use WATSON');
            wconfig = JSON.parse(
              fs.readFileSync('./cloud-services/configs/watson-stt.json')
            );
            asrEngine = new STTWatson(socket.callerAudioFileOut, wconfig);
            break;
        }
        let captionFile = null;
        if (socket.dataCollectionConfig.Transcripts.ASRcaptionStream) {
          const captionFilePath = `${socket.callDir}/${roomName}-${Date.now()}-${participantExtension}-captions.txt`;
          captionFile = fs.openSync(captionFilePath, 'w');
          // Store new transcript file info in the DB
          socket.callData = await updateCall(socket.callData._id, {
            transcripts: {
              participantName,
              participantExtension,
              filename: captionFilePath.split('/').pop(),
              filePath: captionFilePath,
              provider: socket.asrConfig.engineSTT,
              type: 'AsrStream'
            }
          });
        }
        let msgTime = 0;
        asrEngine.start((captionObj) => {
          if (msgTime === 0) {
            const d = new Date();
            msgTime = d.getTime();
          }
          captionObj.msgid = msgTime;
          captionObj.speakerExtension = participantExtension;
          captionObj.speakerName = participantName;
          socket.emit('caption-data', captionObj);
          if (captionFile) {
            fs.writeSync(captionFile, `${JSON.stringify(captionObj)}\n`);
          }
          if (captionObj.final) {
            msgTime = 0;
          }
        });
      })
      .on('updateCSPCredentials', (data) => {
        let success = true;
        const google = {
          type: data.googleTypeSelected,
          project_id: data.googleProject,
          private_key_id: data.googlePrivateKeyId,
          private_key: data.googlePrivateKey,
          client_email: data.googleClientEmail,
          client_id: data.googleClientId,
          auth_uri: data.googleAuthUri,
          token_uri: data.googleTokenUri,
          auth_provider_x509_cert_url: data.googleAuthCert,
          client_x509_cert_url: data.googleClientCert
        };
        const watsonStt = {
          authtype: data.watsonSttAuthenticationSelected,
          apikey: data.watsonSttKey,
          url: data.watsonSttUrl
        };

        const watsonTranslation = {
          authtype: data.watsonTranslationAuthSelected,
          apikey: data.watsonTranslationKey,
          url: data.watsonTranslationUrl
        };
        fs.writeFile('./cloud-services/configs/google.json', JSON.stringify(google), (err) => {
          if (err) {
            console.log('Error writing file:', err);
            success = false;
          }
        });
        fs.writeFile('./cloud-services/configs/watson-stt.json', JSON.stringify(watsonStt), (err) => {
          if (err) {
            console.log('Error writing file:', err);
            success = false;
          }
        });
        fs.writeFile('./cloud-services/configs/watson-translation.json', JSON.stringify(watsonTranslation), (err) => {
          if (err) {
            console.log('Error writing file:', err);
            success = false;
          }
        });
        if (success) {
          io.emit('succesCSPCredentials');
        } else {
          io.emit('failCSPCredentials');
        }
      })
      .on('leaveRoom', async (data) => {
        const { roomName, sourceExt } = data;
        socket.leave(roomName);
        removeUserFromRoom(roomName, sourceExt);
        roomUsersArray = [];
        // We can now update the final call data now that the call is over
        if (socket.callData) {
          cleanupFiles(socket.callData);
          socket.callData = null;
        }
      })
      .on('disconnect', () => {
        // Final chance to cleanup if something bad happened and we didn't get a leaveRoom event
        if (socket.callData) {
          cleanupFiles(socket.callData);
          socket.callData = null;
        }
      });
  });
};
