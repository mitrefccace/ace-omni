/**
 * --CW TODO: DELETE ESLINT DISABLE
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from 'react';
import { Updater } from 'use-immer';
import { Col, Row } from 'react-bootstrap';
import {
  faCircleQuestion
} from '@fortawesome/free-solid-svg-icons';
import ADSToggleSwitch from '../../ADSToggleSwitch';
import ADSSlider from '../../ADSSlider';
import ADSTooltip from '../../ADSTooltip';
import ADSIconButton from '../../ADSIconButton';
import ADSButton from '../../ADSButton';
import ADSCheckbox from '../../ADSCheckbox';
import '../../Assets/css/UI2LockSetting.css';

function IncomingAudio(props: {
  currStudyConfig: any,
  moduleIndex: any,
  configurationIndex: any,
  participantIndex: any,
  setCurrStudyConfig: Updater<any>
}) {
  const {
    currStudyConfig, moduleIndex, configurationIndex, participantIndex, setCurrStudyConfig
  } = props;
  const participantConfig = currStudyConfig
    .modules[moduleIndex]
    .configurations[configurationIndex]
    .participants[participantIndex];
  const interfaceName = participantConfig.name === 'Participant1' ? 'userInterface1' : 'userInterface2';

  const toggleEnableMonoAudio = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .IncomingAudio.MonoAudio = value;
    });
  };

  return (
    <div>
      <div className="configurationGrayBox">
        <div className="configurationLightGrayBox">
          <Row>
            <Col>
              <ADSCheckbox
                checked={participantConfig[interfaceName].IncomingAudio.MonoAudio}
                label="Mono Audio"
                valueChangeFunction={toggleEnableMonoAudio}
                isHoverable
                hoverableText="Combine channels when playing audio; the left and right speakers will play the same content."
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default IncomingAudio;
