import React from 'react';
import { Updater } from 'use-immer';
import '../../Assets/css/UI2LockSetting.css';
import ADSToggleSwitch from '../../ADSToggleSwitch';

function Chat(props: {
  currStudyConfig: any,
  moduleIndex: any,
  configurationIndex: any,
  participantIndex: any,
  setCurrStudyConfig: Updater<any>
}) {
  /* eslint-disable no-unused-vars */
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    currStudyConfig, moduleIndex, configurationIndex, participantIndex, setCurrStudyConfig
  } = props;
  return (
    <div>
      <div className="configurationGrayBox">
        <div className="chat-toggle-switch">
          <div className="chat-div"><b>Chat</b></div>
          <ADSToggleSwitch id="toggle-1" label="" onChangeFunction={() => null} />
        </div>
      </div>
    </div>
  );
}

export default Chat;
