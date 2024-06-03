import React from 'react';
import { Updater } from 'use-immer';
import { Col, Row } from 'react-bootstrap';
import ADSCheckbox from '../../ADSCheckbox';
import ADSSingleSelectDropdownBox from '../../ADSSingleSelectDropdownBox';
import ADSSlider from '../../ADSSlider';
import '../../Assets/css/AudioFilter.css';

function AudioFilter(props: {
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
  const filterConfig = participantConfig[interfaceName].audioControlFilters;

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

  const filterOptions = [
    { id: '0', value: '', label: '-- Select --' },
    { id: '1', value: 'peaking', label: 'Peaking' },
    { id: '2', value: 'high pass', label: 'High Pass' },
    { id: '3', value: 'low pass', label: 'Low Pass' },
    { id: '4', value: 'high shelf', label: 'High Shelf' },
    { id: '5', value: 'low shelf', label: 'Low Shelf' },
    { id: '6', value: 'pitch', label: 'Pitch' }
  ];

  const rollOffOptions = [
    { id: '1', value: '-12', label: '-12' },
    { id: '2', value: '-24', label: '-24' },
    { id: '3', value: '-48', label: '-48' },
    { id: '4', value: '-96', label: '-96' }
  ];

  const toggleEnableFilter = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.audioFilter = value;
    });
  };

  const selectedFilterTypeOption = (option: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.filterType = option.value;
    });
  };

  const selectedFilterSourceOption = (option: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.filterSource = option.value;
    });
  };

  const selectedRollOffOption = (option: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.rollOff = option.value;
    });
  };

  const changeGainSlider = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.gain = value;
    });
  };

  const changeFrequencySlider = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.frequency = value;
    });
  };

  const changeQualitySlider = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.quality = value;
    });
  };

  const changePitchSlider = (value: any) => {
    setCurrStudyConfig((currConfig:any) => {
      currConfig.modules[moduleIndex]
        .configurations[configurationIndex]
        .participants[participantIndex][interfaceName]
        .audioControlFilters.pitch = value;
    });
  };

  /* eslint-disable max-len */
  return (
    <div>
      <div className="configurationGrayBox">
        <Row>
          <Col>
            <ADSCheckbox
              label="Audio Filter"
              checked={filterConfig.audioFilter}
              valueChangeFunction={toggleEnableFilter}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="configurationLightGrayBox" style={{ width: '10vw', marginLeft: '20%' }}>
              <ADSSingleSelectDropdownBox
                dropdownBoxOptions={filterOptions}
                setSelectedOption={selectedFilterTypeOption}
                defaultSelectedOption={filterOptions.find((el) => el.value === filterConfig.filterType)}
                formLabel="Filter Type:"
                isFormLabelHidden={false}
                fieldSize="small"
                elementID="dropTypeSelect"
                isDisabled={!filterConfig.audioFilter}
                dropdownName="dropTypeSelect"
              />
            </div>
          </Col>
          <Col>
            <div className="configurationLightGrayBox" style={{ width: '10vw' }}>
              <ADSSingleSelectDropdownBox
                dropdownBoxOptions={sourceOptions}
                setSelectedOption={selectedFilterSourceOption}
                defaultSelectedOption={sourceOptions.find((el) => el.value === filterConfig.filterSource)}
                formLabel="Into (this source):"
                isFormLabelHidden={false}
                fieldSize="small"
                elementID="dropSourceSelect"
                isDisabled={!filterConfig.audioFilter}
                dropdownName="dropSourceSelect"
              />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '16px' }} hidden={!(filterConfig.audioFilter && filterConfig.filterType)}>
          <Col>
            <div className="configurationLightGrayBox" style={{ width: '20vw' }} hidden={!(filterConfig.filterType === 'peaking' || filterConfig.filterType === 'high shelf' || filterConfig.filterType === 'low shelf')}>
              <ADSSlider
                label="Gain (dB)"
                changeFunction={changeGainSlider}
                min={-36}
                max={36}
                step={1}
                defaultValue={filterConfig.gain}
                tooltipText="Gain is a unit of amplitude/loudness/volume.
                Refers to how much the selected frequency range is increased or reduced from baseline (0 dB);
                unit is in decibel (dB). "
              />
            </div>
            <div className="configurationLightGrayBox" style={{ width: '20vw' }} hidden={filterConfig.filterType === 'pitch'}>
              <ADSSlider
                label="Frequency (Hz)"
                changeFunction={changeFrequencySlider}
                min={20}
                max={20000}
                step={1}
                defaultValue={filterConfig.frequency}
                tooltipText="Frequency is the number of times something happens per second.
                Refers here to the set frequency of the filter (center of the peak or boundary/corner of the roll-off,
                depending on the type of filter); unit is hertz or kilohertz (Hz or kHz). "
              />
            </div>
            <div className="configurationLightGrayBox" style={{ width: '20vw' }} hidden={!(filterConfig.filterType === 'peaking' || filterConfig.filterType === 'high shelf' || filterConfig.filterType === 'low shelf')}>
              <ADSSlider
                label="Q (quality factor)"
                changeFunction={changeQualitySlider}
                min={0.1}
                max={10}
                step={0.1}
                defaultValue={filterConfig.quality}
                tooltipText="Q is the selectivity of the filter Peaking filters:
                Width around the central frequency that is boosted/cut (lower Q = wider filter).
                 Aka bandwidth, detune.  Shelving filters: Resonance at the central frequency,
                 sets the transition from one side of the “shelf” to the other. "
              />
            </div>
            <div className="configurationLightGrayBox" style={{ width: '20vw' }} hidden={!(filterConfig.filterType === 'high pass' || filterConfig.filterType === 'low pass')}>
              <ADSSingleSelectDropdownBox
                dropdownBoxOptions={rollOffOptions}
                setSelectedOption={selectedRollOffOption}
                defaultSelectedOption={rollOffOptions.find((el) => el.value === filterConfig.rollOff)}
                formLabel="Roll Off"
                isFormLabelHidden={false}
                fieldSize="small"
                elementID="dropRollSelect"
                dropdownName="dropRollSelect"
                tooltipText="Roll Off is rate of a low- or high-pass filter, also known as slope.
                Sometimes carelessly lumped in with Q.  Unit is db/octave, where an octave refers to an interval between two frequencies,
                and one is double the frequency of the other (e.g., 400 Hz and 800 Hz are an octave apart.) "
              />
            </div>
            <div className="configurationLightGrayBox" style={{ width: '20vw' }} hidden={filterConfig.filterType !== 'pitch'}>
              <ADSSlider
                label="Pitch Shift"
                changeFunction={changePitchSlider}
                min={-12}
                max={12}
                step={1}
                defaultValue={filterConfig.pitch}
                tooltipText="Pitch Shift means increasing or decreasing the frequency of a sound."
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default AudioFilter;
