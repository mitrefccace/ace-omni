import React from 'react';
import { Updater } from 'use-immer';
import ADSCheckbox from '../../ADSCheckbox';
import ADSRadioButtonGroup from '../../ADSRadioButtonGroup';
import ADSRadioButton from '../../ADSRadioButton';
import ADSCheckboxGroup from '../../ADSCheckboxGroup';
import '../../Assets/css/Captions.css';

function Captions(props: {
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
  const captionConfig = participantConfig[interfaceName].captions;

  const showCaptionOptionUpdated = (value: string) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .captions.showCaptions = value !== 'No Captions';
    });
  };

  const captionAppearanceOptionUpdated = (value: string) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .captions.captionAppearance = value;
    });
  };

  const captionSenderLabelUpdate = (value: boolean) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .captions.captionFormat.senderLabel = value;
    });
  };

  const captionHorizontalRuleUpdate = (value: boolean) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .captions.captionFormat.horizontalRule = value;
    });
  };

  const captionJustificationOptionUpdated = (value: string) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .captions.captionJustification = value;
    });
  };

  return (
    <div>
      <div className="configurationGrayBoxWrapper">
        <div className="configurationGraySubBox">
          <ADSRadioButtonGroup id="radio-vertical-group-example" label="Show Captions">
            <ADSRadioButton
              label="No Captions"
              groupName="radio-vertical-group-example"
              selectChangeFunction={showCaptionOptionUpdated}
              checked={captionConfig.showCaptions === 'No Captions'}
            />
            <ADSRadioButton
              label="Incoming Captions Only"
              groupName="radio-vertical-group-example"
              selectChangeFunction={showCaptionOptionUpdated}
              checked={captionConfig.showCaptions === 'Incoming Captions Only'}
            />
          </ADSRadioButtonGroup>
        </div>
        <div className="configurationGraySubBox">
          <ADSCheckboxGroup id="checkbox-vertical-group-example" label="Caption Format">
            <ADSCheckbox
              label="Sender Label"
              valueChangeFunction={captionSenderLabelUpdate}
              checked={captionConfig.captionFormat.senderLabel}
            />
            <ADSCheckbox
              disabled
              label="Horizontal Rule Between Captions"
              valueChangeFunction={captionHorizontalRuleUpdate}
              checked={captionConfig.captionFormat.horizontalRule}
            />
          </ADSCheckboxGroup>
        </div>
        <div className="configurationGraySubBox">
          <ADSRadioButtonGroup id="radio-vertical-group-example" label="Caption Appearance">
            <ADSRadioButton
              label="Top-Down"
              groupName="radio-vertical-group-example"
              selectChangeFunction={captionAppearanceOptionUpdated}
              checked={captionConfig.captionAppearance === 'Top-Down'}
            />
            <ADSRadioButton
              label="Bottom-Up"
              groupName="radio-vertical-group-example"
              selectChangeFunction={captionAppearanceOptionUpdated}
              checked={captionConfig.captionAppearance === 'Bottom-Up'}
            />
          </ADSRadioButtonGroup>
        </div>
        <div className="configurationGraySubBox">
          <ADSRadioButtonGroup id="radio-vertical-group-example" label="Caption Justification">
            <ADSRadioButton
              label="Left-Justified"
              groupName="radio-vertical-group-example"
              selectChangeFunction={captionJustificationOptionUpdated}
              checked={captionConfig.captionJustification === 'Left-Justified'}
            />
            <ADSRadioButton
              label="Centered"
              groupName="radio-vertical-group-example"
              selectChangeFunction={captionJustificationOptionUpdated}
              checked={captionConfig.captionJustification === 'Centered'}
            />
            <ADSRadioButton
              label="Right-Justified"
              groupName="radio-vertical-group-example"
              selectChangeFunction={captionJustificationOptionUpdated}
              checked={captionConfig.captionJustification === 'Right-Justified'}
            />
          </ADSRadioButtonGroup>
        </div>
      </div>
    </div>
  );
}

export default Captions;
