import React from 'react';
import {
  Col, Row
} from 'react-bootstrap';
import { Updater } from 'use-immer';
import ADSSingleSelectDropdownBox from '../../ADSSingleSelectDropdownBox';
import ADSCheckbox from '../../ADSCheckbox';
import ADSSlider from '../../ADSSlider';
import '../../Assets/css/ASRengine.css';
import ADSFileUpload from '../../ADSFileUpload';

const engineOptions = [
  { id: '00', value: '', label: '-- Select --' },
  // { id: '0', value: 'Azure', label: 'A - Microsoft Azure' },
  { id: '1', value: 'Google', label: 'G - Google' },
  { id: '2', value: 'IBM-Watson', label: 'W - IBM-Watson' }
  // { id: '3', value: 'Amazon', label: 'AWS - Amazon' },
  // { id: '4', value: 'Predefined', label: 'P - Predefined' }
];

const selectableLanguages = [
  { id: '00', value: '', label: '-- Select --' },
  { id: '0', value: 'English', label: 'English' },
  { id: '1', value: 'Spanish', label: 'Spanish' }
];

function ASRengine(props: {
  currStudyConfig: any,
  moduleIndex: any,
  configurationIndex: any,
  participantIndex: any,
  setCurrStudyConfig: Updater<any>
}) {
  const {
    currStudyConfig, moduleIndex, configurationIndex, participantIndex, setCurrStudyConfig
  } = props;

  const asrConfig = currStudyConfig
    .modules[moduleIndex]
    .configurations[configurationIndex]
    .participants[participantIndex].ASR1;

  const updateASREngine = (e: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.engineSTT = e.value;
    });
  };

  const updateFinalizedCaptions = (value: boolean) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.showFinalizedCaptionsOnly = value;
    });
  };

  const updatePunctuation = (value: boolean) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.punctuation = value;
    });
  };

  const updateGoogleV2 = (value: boolean) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.googleCloudSpeechV2 = value;
    });
  };

  const updateCaptionDelay = (value: number) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.captionDelay = value;
    });
  };

  const updateBackgroundAudioSuppression = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.backgroundAudioSuppression = value;
    });
  };

  const updateSpeechDetectorSensitivity = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.speechDetectorSensitivity = value;
    });
  };

  const updateTranslationEngine = (e: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.translationEngine = e.value;
    });
  };

  const updateTranslationSTT = (value: boolean) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.translationSTT = value;
    });
  };

  const updateASRInput = (e: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.participant1Speech = e.value;
    });
  };

  const updateASROutput = (e: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex].ASR1.participant2Captions = e.value;
    });
  };

  const updateASRUpload = (value: any) => {
    console.log(value);
  };

  /* eslint-disable max-len */
  return (
    <div>
      <div className="configurationGrayBox">
        <p><b>Engine &#40;Speech to Text&#41;</b></p>
        <div style={{ width: '40vw' }}>
          <ADSSingleSelectDropdownBox
            dropdownBoxOptions={engineOptions}
            setSelectedOption={updateASREngine}
            defaultSelectedOption={engineOptions.find((el) => el.value === asrConfig.engineSTT)}
            formLabel="This is a form label"
            isFormLabelHidden
            helpText=""
            fieldSize="small"
            elementID="CaptionEngineDropdown"
            isDisabled={false}
            dropdownName="captionenginedropdown"
          />
        </div>
      </div>
      <div className="configurationGrayBox">
        <p><b>ASR Caption Stream</b></p>
        {
          asrConfig.engineSTT === 'Amazon' ? (
            <div>
              <p style={{ color: 'red' }}><b>Warning: AWS Transcription may be too slow for realtime calling</b></p>
            </div>
          ) : (<span />)
        }
        {
          asrConfig.engineSTT === 'Predefined' ? (
            <div>
              <ADSFileUpload
                allowMultiple={false}
                uploadSuccessFunction={updateASRUpload}
                deleteSuccessFunction={updateASRUpload}
              />
            </div>
          ) : (<span />)
        }
        <div>
          <ADSCheckbox
            label="Show Finalized Captions Only"
            valueChangeFunction={updateFinalizedCaptions}
            checked={asrConfig.showFinalizedCaptionsOnly}
            disabled
          />
          <ADSCheckbox
            label="Enable Automatic Punctuation"
            valueChangeFunction={updatePunctuation}
            checked={asrConfig.punctuation}
            disabled
          />
        </div>
        {
          asrConfig.engineSTT === 'Google' ? (
            <div>
              <ADSCheckbox
                label="Use Google Cloud Speech v2"
                valueChangeFunction={updateGoogleV2}
                checked={asrConfig.googleCloudSpeechV2}
                disabled
              />
            </div>
          ) : (<span />)
        }
        <div>
          <ADSSlider
            changeFunction={updateCaptionDelay}
            label="Caption Delay (sec)"
            min={0.00}
            max={10.00}
            defaultValue={asrConfig.captionDelay}
            tooltipText="Delay in addition to inherit system latency."
            disabled
          />
        </div>
        {
          asrConfig.engineSTT === 'IBM-Watson' ? (
            <div>
              <div style={{ width: '40vw' }}>
                <ADSSlider
                  changeFunction={updateBackgroundAudioSuppression}
                  label="Background Audio Suppression"
                  min={0.00}
                  max={1.00}
                  defaultValue={asrConfig.backgroundAudioSuppression}
                  step={0.1}
                  disabled
                />
              </div>
              <div style={{ width: '40vw' }}>
                <ADSSlider
                  changeFunction={updateSpeechDetectorSensitivity}
                  label="Speech Detector Sensitivity"
                  step={0.1}
                  min={0}
                  max={1}
                  defaultValue={asrConfig.speechDetectorSensitivity}
                  disabled
                />
              </div>
            </div>
          ) : (<span />)
        }
      </div>
      <div className="configurationGrayBox">
        <p><b>Translation</b></p>
        <ADSCheckbox
          label="Translate Speech to Text"
          valueChangeFunction={updateTranslationSTT}
          checked={asrConfig.translationSTT}
          disabled
        />
        <Row hidden={!asrConfig.translationSTT}>
          <Col sm={4}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={engineOptions}
              setSelectedOption={updateTranslationEngine}
              defaultSelectedOption={engineOptions.find((el) => el.value === asrConfig.translationEngine)}
              formLabel="Engine (translation)"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="small"
              elementID="translationEngineDropdown"
              isDisabled={false}
              dropdownName="translationenginedropdown"
            />
          </Col>
          <Col sm={4}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={selectableLanguages}
              setSelectedOption={updateASRInput}
              defaultSelectedOption={selectableLanguages.find((el) => el.value === asrConfig.participant1Speech)}
              formLabel="Participant #1 ASR input (speech)"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="small"
              elementID="languageOneDropdown"
              isDisabled={false}
              dropdownName="languageonedropdown"
            />
          </Col>
          <Col sm={4}>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={selectableLanguages}
              setSelectedOption={updateASROutput}
              defaultSelectedOption={selectableLanguages.find((el) => el.value === asrConfig.participant2Captions)}
              formLabel="Participant #2 ASR output (captions)"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="small"
              elementID="languageTwoDropdown"
              isDisabled={false}
              dropdownName="languageTwoDropdown"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default ASRengine;
