/* eslint-disable max-len */
import React from 'react';
import { Updater } from 'use-immer';
import '../../Assets/css/UI2LockSetting.css';
import ADSRadioButtonGroup from '../../ADSRadioButtonGroup';
import ADSRadioButton from '../../ADSRadioButton';

/* eslint-disable no-unused-vars */
function VRSVideoQuality(props: {
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
        <div className="configurationLightGrayBox">
          <div style={{ marginTop: '-7%' }}>
            <ADSRadioButtonGroup id="radio-vertical-group-example">
              <ADSRadioButton
                label="Auto"
                groupName="radio-vertical-group-example"
                selectChangeFunction={() => null}
              />
              <div className="body2" style={{ marginLeft: '5.5%', color: 'var(--ADS_Grayscale_60)' }}>
                Adjusts automatically to give the best quality for the current conditions and system technology
              </div>
              <ADSRadioButton
                label="Higher picture quality"
                groupName="radio-vertical-group-example"
                selectChangeFunction={() => null}
              />
              <div className="body2" style={{ marginLeft: '5.5%', color: 'var(--ADS_Grayscale_60)' }}>
                Uses more data, prioritizes video quality over network requirements, may lead to delays or lags
              </div>
              <ADSRadioButton
                label="Data saver"
                groupName="radio-vertical-group-example"
                selectChangeFunction={() => null}
              />
              <div className="body2" style={{ marginLeft: '5.5%', color: 'var(--ADS_Grayscale_60)' }}>
                Lower picture quality, but less likelihood of delays or lags
              </div>
              <ADSRadioButton
                label="Custom"
                groupName="radio-vertical-group-example"
                selectChangeFunction={() => null}
              />
              <div className="body2" style={{ marginLeft: '5.5%', color: 'var(--ADS_Grayscale_60)' }}>
                Set the parameters but requires a certain bandwidth
              </div>
            </ADSRadioButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VRSVideoQuality;
