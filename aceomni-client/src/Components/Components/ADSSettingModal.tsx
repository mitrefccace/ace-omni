import React, { useEffect, useState } from 'react';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import {
  Col, Container, Row
} from 'react-bootstrap';
import ADSDialog from '../ADSDialog';
import ADSLink from './ADSLink';
import ADSButton from '../ADSButton';
import ADSTooltip from '../ADSTooltip';
import ADSIconButton from '../ADSIconButton';
import ADSSlider from '../ADSSlider';
import ADSSingleSelectDropdownBox from '../ADSSingleSelectDropdownBox';
import ADSFullWidthDivider from '../ADSFullWidthDivider';
import ADSRadioButton from '../ADSRadioButton';
import './ADSSettingModal.css';
import ADSRadioButtonGroup from '../ADSRadioButtonGroup';

interface Props {
  captionsEnabled?: boolean
  remoteStreamRef: any, // TODO get type
}

function ADSSettingModal(props: Props) {
  const [openWithForm, setOpenWithForm] = useState(false);
  const [volume, setVolume] = useState(0);
  const [speakerBalanceL, setNewSpeakerBalanceL] = useState(0);
  const [speakerBalanceR, setNewSpeakerBalanceR] = useState(0);
  const [speakerOption, setSpeakerOption] = useState();
  const [microphoneOption, setNewMicrophoneBalance] = useState();
  const [fontBackgroundType, setFontBackgroundType] = useState();
  const [fontStyle, setNewFont] = useState();
  const [spacing, setSpacing] = useState();
  const [fontSize, setFontSize] = useState(0);
  const [language, setLanguage] = useState();
  const [microphoneOptions, setMicrophoneOptions] = useState<any[]>(
    [
      { id: '0', value: 'default', label: 'Default Speakers(Built-in)' }
    ]
  );
  const [speakerOptions, setSpeakerOptions] = useState<any[]>(
    [
      { id: '0', value: 'default', label: 'Default Speakers(Built-in)' }
    ]
  );
  const {
    captionsEnabled, remoteStreamRef
  } = props;

  const fontOptions = [
    { id: '0', value: 'roboto', label: 'Roboto' },
    { id: '1', value: 'verdana', label: 'Verdana' },
    { id: '2', value: 'arial', label: 'Arial' },
    { id: '3', value: 'helvetica', label: 'Helvetica' },
    { id: '4', value: 'tahoma', label: 'Tahoma' }
  ];
  const spacingOptions = [
    { id: '0', value: '1.5', label: 'Default (1.5)' },
    { id: '1', value: '2.0', label: '2.0' },
    { id: '2', value: '2.5', label: '2.5' },
    { id: '3', value: '3.0', label: '3.0' }
  ];
  const languageOptions = [
    { id: '0', value: 'english', label: 'English' }
  ];

  const fontNumberSizes = [...new Array(101)]
    .map((each, index) => ({ value: index, label: index }));

  useEffect(() => {
    /*
    console.log(
      speakerBalanceL,
      speakerBalanceR,
      speakerOption,
      microphoneOption,
      fontBackgroundType,
      fontStyle,
      fontSize,
      spacing,
      language,
      volume
    );
    */
  // eslint-disable-next-line max-len
  }, [fontBackgroundType, fontSize, fontStyle, language, microphoneOption, spacing, speakerBalanceL, speakerBalanceR, speakerOption, volume]);

  const handleClickOpenWithForm = () => {
    setOpenWithForm(true);
  };
  const handleCloseWithFormSave = () => {
    console.log('Close (Save)');
    setOpenWithForm(false);
  };
  const handleCloseWithFormCancel = () => {
    console.log('Close (Cancel)');
    setOpenWithForm(false);
  };

  const updateSpeaker = (e: any) => {
    setSpeakerOption(e.value);
    // Update the speaker being used for the call
    if (remoteStreamRef.current && typeof remoteStreamRef.current.sinkId !== 'undefined') {
      remoteStreamRef.current.setSinkId(e.value)
        .then(() => {
          console.log(`Success, audio output device attached: ${e.value}`);
        })
        .catch((error: any) => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  };

  const updateSpeakerL = (e: any) => {
    setNewSpeakerBalanceL(e);
  };

  const updateVolume = (e: any) => {
    setVolume(e);
  };
  const updateSpeakerR = (e: any) => {
    setNewSpeakerBalanceR(e);
  };
  const resetSpeakerBalance = () => {
    setNewSpeakerBalanceL(50);
    setNewSpeakerBalanceR(50);
  };

  const updateMicrophone = (e: any) => {
    setNewMicrophoneBalance(e);
  };

  const fontBackgroundTypeUpdated = (e: any) => {
    console.log('console', e);
    setFontBackgroundType(e);
  };
  const updateFont = (e: any) => {
    setNewFont(e);
  };
  const updateSpacing = (e: any) => {
    setSpacing(e);
  };
  const updateFontSize = (e: any) => {
    setFontSize(e);
  };
  const updateLanguage = (e: any) => {
    setLanguage(e);
  };

  function gotStream() {
    // Refresh button list in case labels have become available
    return navigator.mediaDevices.enumerateDevices();
  }

  function gotDevices(deviceInfos: any) {
    // Handles being called several times to update labels. Preserve values.
    const newMicInputOptions: any[] = [];
    const newMicOutputOptions: any[] = [];
    const newVideoOutputOptions: any[] = [];
    for (let i = 0; i !== deviceInfos.length; i += 1) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audioinput') {
        newMicInputOptions.push(
          {
            id: deviceInfo.deviceId,
            value: deviceInfo.deviceId,
            label: deviceInfo.label
          }
        );
      } else if (deviceInfo.kind === 'audiooutput') {
        newMicOutputOptions.push(
          {
            id: deviceInfo.deviceId,
            value: deviceInfo.deviceId,
            label: deviceInfo.label
          }
        );
      } else if (deviceInfo.kind === 'videoinput') {
        newVideoOutputOptions.push(
          {
            id: deviceInfo.deviceId,
            value: deviceInfo.deviceId,
            label: deviceInfo.label
          }
        );
      }
    }
    setMicrophoneOptions(newMicInputOptions);
    setSpeakerOptions(newMicOutputOptions);
  }

  // Collect the media devices
  useEffect(() => {
    console.log(`SEE ${!('sinkId' in HTMLMediaElement.prototype)}`);
    const constraints = {
      audio: true,
      video: false
    };
    navigator.mediaDevices.getUserMedia(constraints)
      .then(gotStream).then(gotDevices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <ADSLink
        url=""
        linkText="Settings"
        fontType="body1"
        isExternal={false}
        isNavigational={false}
        onClickFunction={(handleClickOpenWithForm)}
      />
      <ADSDialog
        title="Settings"
        buttons={(
          <><ADSButton onClick={handleCloseWithFormSave} buttonText="Apply" />
            <ADSButton onClick={handleCloseWithFormCancel} variant="secondary" buttonText="Cancel" />
          </>
        )}
        onClose={handleCloseWithFormCancel}
        open={openWithForm}
        width="sm"
      >
        <Container no-gutters="true" fluid>
          <Row>
            <Col>
              <Row>
                <div className="h6">Devices</div>
              </Row>
              <Row>
                {/* Speakers */}
                <div style={{ paddingTop: '12px' }}>Speakers</div>
                <div style={{ paddingTop: '8px' }}>
                  <ADSSingleSelectDropdownBox
                    dropdownBoxOptions={speakerOptions}
                    setSelectedOption={updateSpeaker}
                    formLabel="This is a form label"
                    isFormLabelHidden
                    helpText=""
                    fieldSize="small"
                    elementID="SpeakerOptionDropdown"
                    isDisabled={false}
                    dropdownName="speakeroptiondropdown"
                  />
                </div>
              </Row>
              <Row>
                <div style={{ paddingTop: '16px' }}>Volume
                  <ADSTooltip content="Adjust the audio volume balance between left and right channels." placement="right">
                    <ADSIconButton
                      onClick={() => null}
                      variant="standard"
                      height="small"
                      icon={faCircleInfo}
                      color="var(--ADS_Gray)"
                      ariaLabel="filled icon"
                    />
                  </ADSTooltip>
                  <span style={{ float: 'right' }}>
                    <ADSButton
                      onClick={resetSpeakerBalance}
                      buttonText="Reset"
                      variant="tertiary"
                      height="small"
                    />
                  </span>
                </div>
                <div>
                  <ADSSlider
                    changeFunction={updateVolume}
                    defaultValue={50}
                    label=""
                    max={100}
                  />
                </div>
              </Row>
              <Row>
                {/* Balance */}
                <div style={{ paddingTop: '16px' }}>Balance
                  <ADSTooltip content="Adjust the audio volume balance between left and right channels." placement="right">
                    <ADSIconButton
                      onClick={() => null}
                      variant="standard"
                      height="small"
                      icon={faCircleInfo}
                      color="var(--ADS_Gray)"
                      ariaLabel="filled icon"
                    />
                  </ADSTooltip>
                </div>
              </Row>
              <Row>
                {/* Speaker Balance slider */}
                <div>
                  <div>
                    <ADSSlider
                      changeFunction={updateSpeakerL}
                      defaultValue={50}
                      label="Left"
                      max={100}
                    />
                  </div>
                  <br />
                  <div>
                    <ADSSlider
                      changeFunction={updateSpeakerR}
                      defaultValue={50}
                      label="Right"
                      max={100}
                    />
                  </div>
                </div>
              </Row>
              <Row>
                <div>Microphone</div>
              </Row>
              <Row style={{ padding: '8px 0' }}>
                {/* Microphone Option */}
                <div>
                  <ADSSingleSelectDropdownBox
                    dropdownBoxOptions={microphoneOptions}
                    setSelectedOption={updateMicrophone}
                    formLabel="This is a form label"
                    isFormLabelHidden
                    helpText=""
                    fieldSize="small"
                    elementID="MicrophoneOptionDropdown"
                    isDisabled={false}
                    dropdownName="microphoneoptiondropdown"
                  />
                </div>
              </Row>

              {!captionsEnabled
                ? (
                  <span>
                    <ADSFullWidthDivider />
                    <Row>
                      <div className="h6" style={{ paddingTop: '16px' }}>Captions and transcriptions</div>
                    </Row>
                    <Row>
                      {/* Captions and transcriptions */}
                      <Col>
                        <div style={{ paddingTop: '8px' }}>Style</div>
                        <ADSSingleSelectDropdownBox
                          dropdownBoxOptions={fontOptions}
                          setSelectedOption={updateFont}
                          formLabel="This is a form label"
                          isFormLabelHidden
                          helpText=""
                          fieldSize="small"
                          elementID="FontStyleDropdown"
                          isDisabled={false}
                          dropdownName="fontstyledropdown"
                        />
                      </Col>
                      <Col>
                        <div className="font-size-dropdown">
                          <ADSSingleSelectDropdownBox
                            dropdownBoxOptions={fontNumberSizes}
                            setSelectedOption={updateFontSize}
                            formLabel="This is a form label"
                            isFormLabelHidden
                            helpText=""
                            fieldSize="small"
                            elementID="FontSizeDropdown"
                            isDisabled={false}
                            dropdownName="fontsizedropdown"
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <div style={{ paddingTop: '8px' }}>Spacing </div>
                      <ADSSingleSelectDropdownBox
                        dropdownBoxOptions={spacingOptions}
                        setSelectedOption={updateSpacing}
                        formLabel="This is a form label"
                        isFormLabelHidden
                        helpText=""
                        fieldSize="small"
                        elementID="SpacingOptionDropdown"
                        isDisabled={false}
                        dropdownName="spacingoptiondropdown"
                      />
                    </Row>
                    <Row style={{ padding: '16px 0' }}>
                      <Col>
                        <div>Font and Background Colors</div>
                        <Row>
                          <ADSRadioButtonGroup>
                            <ADSRadioButton
                              inline
                              label="Background: White    Font: Black"
                              groupName="dropIntervalButtons"
                              selectChangeFunction={fontBackgroundTypeUpdated}
                            />
                            <div className="font-box-color-white">Lorem ipsum</div>
                            <ADSRadioButton
                              inline
                              label="Background: Gray   Font: Black"
                              groupName="dropIntervalButtons"
                              selectChangeFunction={fontBackgroundTypeUpdated}
                            />
                            <div className="font-box-color-grey">Lorem ipsum</div>
                            <ADSRadioButton
                              inline
                              label="Background: Black    Font: Black"
                              groupName="dropIntervalButtons"
                              selectChangeFunction={fontBackgroundTypeUpdated}
                            />
                            <div className="font-box-color-black">Lorem ipsum</div>
                          </ADSRadioButtonGroup>
                        </Row>
                      </Col>
                    </Row>
                    <ADSFullWidthDivider />
                    <Row>
                      <div className="h6" style={{ paddingTop: '16px' }}>Languages</div>
                    </Row>
                    <Row style={{ padding: '12px 0 0 0' }}>
                      <div>Site Language </div>
                      <ADSSingleSelectDropdownBox
                        dropdownBoxOptions={languageOptions}
                        setSelectedOption={updateLanguage}
                        formLabel="This is a form label"
                        isFormLabelHidden
                        helpText=""
                        fieldSize="small"
                        elementID="LanguageDropdown"
                        isDisabled={false}
                        dropdownName="languagedropdown"
                      />
                    </Row>
                  </span>
                )
                : <span />}
            </Col>
          </Row>
        </Container>
      </ADSDialog>
    </div>
  );
}

ADSSettingModal.defaultProps = {
  captionsEnabled: true
};

export default ADSSettingModal;
