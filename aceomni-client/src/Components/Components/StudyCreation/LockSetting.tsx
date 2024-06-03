import React from 'react';
import { Updater } from 'use-immer';
import ADSCheckbox from '../../ADSCheckbox';
import '../../Assets/css/UI2LockSetting.css';

/* eslint-disable no-unused-vars */
function LockSetting(props: {
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
        <div className="configurationLightGrayBox"> <b>Lock Settings</b>
          <ADSCheckbox
            label="Background"
            valueChangeFunction={() => null}
          />
          <ADSCheckbox
            label="Colors"
            valueChangeFunction={() => null}
          />
          <ADSCheckbox
            label="Font"
            valueChangeFunction={() => null}
          />
          <ADSCheckbox
            label="Sound"
            valueChangeFunction={() => null}
          />
        </div>
      </div>
    </div>
  );
}

export default LockSetting;
