import React, { useState } from 'react';
import './ADSSlider.css';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ADSTooltip from './ADSTooltip';
import ADSButton from './ADSButton';

/**
 * Returns an ADS Radio Button
 *
 * ADS Radio Buttons must be in a ADSRadioButtonGroup
 *
 * @param unmarked - true for a blank slider, false for marked slider with text field
 * @param label - Slider text
 * @param disabled - true | false
 * @param min - Minimum value
 * @param max- Maximum value
 * @param resetButton - true | false
 * @param step - Step value
 * @param defaultValue - defaultValue value
 * @param changeFunction - Function to set the slider value
 *
 * @returns ADS Slider
 */

function ADSSlider(props: {
  unmarked?: boolean;
  label?: string;
  disabled?: boolean;
  changeFunction: any;
  min?: number;
  max?: number;
  defaultValue?: number;
  resetButton?: boolean;
  step?: number;
  tooltipText?: string
}) {
  const {
    unmarked, label, disabled,
    min, max, step, defaultValue, resetButton, changeFunction, tooltipText
  } = props;

  const [value, setSliderValue] = useState<number>();
  const inputFieldId = `${label} input field`;

  const handleInputChange = (event: any) => {
    const newValue = event.target.value;
    if (!Number.isNaN(newValue) && newValue <= max! && newValue >= min!) {
      setSliderValue(newValue);
      changeFunction(newValue);
    }
  };

  const resetSlider = () => {
    setSliderValue(defaultValue);
    changeFunction(defaultValue);
  };

  if (unmarked) {
    return (
      <div>
        <div className="labels-wrapper">
          <Typography className="body2">
            {label}
          </Typography>
          {tooltipText !== ''
            ? (
              <ADSTooltip
                content={tooltipText}
                placement="right"
              >
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  style={{ marginLeft: '15px' }}
                />
              </ADSTooltip>
            )
            : null}
        </div>
        <div className="unmarked-slider-wrapper">
          <Slider
            className="ads-slider"
            disabled={disabled}
            aria-disabled={disabled ? 'true' : 'false'}
            defaultValue={defaultValue}
            value={value !== undefined ? value : defaultValue}
            step={step}
            min={min}
            max={max}
            onChange={handleInputChange}
            aria-label="slider"
          />
          { resetButton ? (
            <ADSButton
              className="slider-reset-button"
              onClick={resetSlider}
              buttonText="Reset"
              width="32px"
              disabled={disabled}
              aria-disabled={disabled ? 'true' : 'false'}
              variant="tertiary"
            />
          ) : null}

        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="labels-wrapper">
        <Typography className="body2">
          {label}
        </Typography>
        {tooltipText !== ''
          ? (
            <ADSTooltip
              content={tooltipText}
              placement="right"
            >
              <FontAwesomeIcon
                icon={faCircleQuestion}
                style={{ marginLeft: '15px' }}
              />
            </ADSTooltip>
          )
          : null}
      </div>
      <div className="labeled-slider-wrapper">
        <Typography className="body1" style={{ paddingRight: '16px' }}>
          {min}
        </Typography>
        <Slider
          className="ads-slider"
          disabled={disabled}
          aria-disabled={disabled ? 'true' : 'false'}
          value={value !== undefined ? value : defaultValue}
          step={step}
          min={min}
          max={max}
          onChange={handleInputChange}
          aria-label="slider"
        />
        <Typography className="body1" style={{ paddingLeft: '16px' }}>
          {max}
        </Typography>
        <div className="slider-input-wrapper">
          <OutlinedInput
            style={{ backgroundColor: 'white' }}
            className="outlined-slider-input"
            aria-label={inputFieldId}
            disabled={disabled}
            aria-disabled={disabled ? 'true' : 'false'}
            value={value !== undefined ? value : defaultValue}
            size="small"
            onChange={handleInputChange}
            inputProps={{
              step,
              min,
              max,
              type: 'number',
              'aria-label': 'input-slider text field'
            }}
          />
        </div>
        { resetButton ? (
          <ADSButton
            className="slider-reset-button"
            onClick={resetSlider}
            disabled={disabled}
            aria-disabled={disabled ? 'true' : 'false'}
            buttonText="Reset"
            width="32px"
            variant="tertiary"
          />
        ) : null}
      </div>
    </div>
  );
}

ADSSlider.defaultProps = {
  unmarked: false,
  label: '',
  disabled: false,
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  resetButton: false,
  tooltipText: ''
};

export default ADSSlider;
