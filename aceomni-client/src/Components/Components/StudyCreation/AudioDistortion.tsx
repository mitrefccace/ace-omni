import React from 'react';
import { Updater } from 'use-immer';
import { Col, Row } from 'react-bootstrap';
import ADSCheckbox from '../../ADSCheckbox';
import ADSSingleSelectDropdownBox from '../../ADSSingleSelectDropdownBox';
import ADSNumberInput from '../../ADSNumberInput';
import ADSRadioButton from '../../ADSRadioButton';
import ADSRadioButtonGroup from '../../ADSRadioButtonGroup';
import '../../Assets/css/AudioDistortion.css';
import ADSFileUpload from '../../ADSFileUpload';

function AudioDistortion(props: {
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

  let streamNum: string = '1';
  let interfaceName = 'audioStream1';
  if (participantConfig.name !== 'Participant1') {
    interfaceName = 'audioStream2';
    streamNum = '2';
  }
  const config = participantConfig[interfaceName].includeDistortionCorruption;

  let sourceOptions = [
    { id: '0', value: '', label: '-- Select --' },
    { id: '1', value: 'microphone', label: 'microphone feed' },
    { id: '2', value: 'speaker feed', label: 'speaker feed' }
  ];
  if (streamNum !== '1') {
    sourceOptions = [
      { id: '0', value: '', label: '-- Select --' },
      { id: '2', value: 'speaker feed', label: 'speaker feed' }
    ];
  }

  const repetitionOptions = [
    { id: '0', value: '', label: '-- Select --' },
    { id: '1', value: 1, label: '1 second' },
    { id: '2', value: 2, label: '2 seconds' },
    { id: '3', value: 3, label: '3 seconds' },
    { id: '4', value: 4, label: '4 seconds' },
    { id: '5', value: 5, label: '5 seconds' }
  ];

  // eslint-disable-next-line no-multi-str
  const micAndSpeakerTooltipText = 'Microphone feed: Simulate a bad connection and packet loss by randomly muting and unmuting outgoing audio.\
  This muting occurs in the browser before it is sent, which means the audio for the receiving user will be affected.\
  If the receiving user is another ACE Omni user or is using a caption phone,\
  their ASR engine performance will be affected and have reduced caption quality.\
  The local audio for the terminal user will be unaffected.\
  Speaker feed: Simulate a bad connection and packet loss by randomly muting and unmuting incoming audio for the terminal user.\
  This muting occurs in the browser after the terminal ASR engine has processed the audio, so captions are unaffected.\
  The audio for the other side of the call is unaffected.';

  // eslint-disable-next-line no-multi-str
  const speakerTooltipText = 'Speaker feed: Simulate a bad connection and packet loss by randomly muting and unmuting incoming audio for the terminal user.\
  This muting occurs in the browser after the terminal ASR engine has processed the audio, so captions are unaffected.\
  The audio for the other side of the call is unaffected.';

  const toggleEnableNoise = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.injectBackgroundNoise = value;
    });
  };

  const noiseFileUploaded = (newFile: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.audioFile = newFile.id;
    });
  };

  const noiseFileDeleted = () => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.audioFile = null;
    });
  };

  const selectedNoiseSourceOption = (option: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.injectSource = option.value;
    });
  };

  const togglePacketDrops = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.simulatePacketDrops = value;
    });
  };

  const selectedDropSourceOption = (option: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.packetDropSource = option.value;
    });
  };

  const selectedDropDurationOption = (option: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.packetDropDuration = option.value;
    });
  };

  const dropIntervalTypeUpdated = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.repetitionInterval.interval = value;
    });
  };

  const dropIntervalStartUpdated = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.repetitionInterval.fromSecs = value;
    });
  };

  const dropIntervalEndUpdated = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .includeDistortionCorruption.repetitionInterval.toSecs = value;
    });
  };
  /* eslint-disable max-len */
  return (
    <div>
      <div className="configurationGrayBox">
        <div className="configurationLightGrayBox">
          <Row>
            <Col>
              <ADSCheckbox
                label="Inject Background Noise"
                checked={config.injectBackgroundNoise}
                valueChangeFunction={toggleEnableNoise}
                isHoverable
                hoverableText="Simulate background noise by overlaying a background noise audio track on incoming or outgoing audio."
              />
              <div className="tab-left" style={{ paddingTop: '2%', paddingLeft: '10%' }} hidden={!config.injectBackgroundNoise}>
                <ADSFileUpload
                  allowMultiple={false}
                  buttonText="Add Audio File"
                  uploadSuccessFunction={noiseFileUploaded}
                  deleteSuccessFunction={noiseFileDeleted}
                />
              </div>
            </Col>
            <Col hidden={!config.injectBackgroundNoise}>
              <div style={{ width: '10vw', marginTop: '25px' }}>
                <ADSSingleSelectDropdownBox
                  dropdownBoxOptions={sourceOptions}
                  setSelectedOption={selectedNoiseSourceOption}
                  defaultSelectedOption={sourceOptions.find((el) => el.value === config.injectSource)}
                  formLabel="Into (this source):"
                  isFormLabelHidden={false}
                  fieldSize="small"
                  elementID="noiseSourceDropdown"
                  isDisabled={false}
                  dropdownName="noiseSourceDropdown"
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className="configurationLightGrayBox" style={{ margin: '3% 0' }}>
          <Row>
            <Col>
              <ADSCheckbox
                label="Simulate Packet Drops"
                checked={config.simulatePacketDrops}
                valueChangeFunction={togglePacketDrops}
                isHoverable
                hoverableText="Simulate bad connections and packet loss by randomly muting and unmuting incoming and outgoing audio."
              />
            </Col>
          </Row>
          <Row hidden={!config.simulatePacketDrops}>
            <Col>
              <div style={{ width: '165px', marginBottom: '20px' }}>
                <ADSSingleSelectDropdownBox
                  dropdownBoxOptions={sourceOptions}
                  setSelectedOption={selectedDropSourceOption}
                  defaultSelectedOption={sourceOptions.find((el) => el.value === config.packetDropSource)}
                  formLabel="Into (this source):"
                  isFormLabelHidden={false}
                  fieldSize="small"
                  elementID="dropSourceSelect"
                  isDisabled={false}
                  dropdownName="dropSourceSelect"
                  tooltipText={streamNum === '1' ? micAndSpeakerTooltipText : speakerTooltipText}
                />
              </div>
            </Col>
            <Col>
              <div style={{ width: '165px' }}>
                <ADSSingleSelectDropdownBox
                  dropdownBoxOptions={repetitionOptions}
                  setSelectedOption={selectedDropDurationOption}
                  defaultSelectedOption={repetitionOptions.find((el) => el.value === config.packetDropDuration)}
                  formLabel="Size (this duration):"
                  isFormLabelHidden={false}
                  fieldSize="small"
                  elementID="dropSizeSelect"
                  isDisabled={false}
                  dropdownName="dropSizeSelect"
                />
              </div>
            </Col>
            <Col>
              <Row>
                <div style={{ width: '250px' }}>
                  <ADSRadioButtonGroup id="dropIntervalButtons" label="Repetition Interval (this often):">
                    <ADSRadioButton
                      inline
                      checked={config.repetitionInterval.interval === 'Exact'}
                      label="Exact"
                      groupName="dropIntervalButtons"
                      selectChangeFunction={dropIntervalTypeUpdated}
                    />
                    <ADSRadioButton
                      inline
                      checked={config.repetitionInterval.interval === 'Random'}
                      label="Random"
                      groupName="dropIntervalButtons"
                      selectChangeFunction={dropIntervalTypeUpdated}
                    />
                  </ADSRadioButtonGroup>
                </div>
              </Row>
              <Row hidden={!config.simulatePacketDrops}>
                <div className="number-input-box-wrapper">
                  <div style={{ width: '80px' }}>
                    <ADSNumberInput
                      changeFunction={dropIntervalStartUpdated}
                      minValue={1}
                      maxValue={60}
                      stepValue={1}
                      defaultValue={config.repetitionInterval.fromSecs}
                    />
                  </div>
                  <div style={{ marginRight: '5px', marginLeft: '5px' }}> secs </div>
                  <div className="right-number-input-col">
                    <div className="right-number-input" hidden={config.repetitionInterval.interval === 'Exact'}>
                      <div style={{ marginRight: '5px' }}> to </div>
                      <div style={{ minWidth: '80px' }}>
                        <ADSNumberInput
                          changeFunction={dropIntervalEndUpdated}
                          minValue={2}
                          maxValue={60}
                          stepValue={1}
                          defaultValue={config.repetitionInterval.toSecs}
                        />
                      </div>
                      <div style={{ marginLeft: '5px' }}> secs </div>
                    </div>
                  </div>
                </div>
              </Row>
            </Col>
          </Row>

        </div>
      </div>
    </div>
  );
}

export default AudioDistortion;
