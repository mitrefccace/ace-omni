import React, { useState } from 'react';
import './ADSNumberInput.css';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';

/**
 * Returns an ADS Number only input box
 *
 * @param label - Text label
 * @param disabled - true | false
 * @param minValue - Minimum value
 * @param maxValue - Maximum value
 * @param stepValue - Step value
 * @param defaultValue - Default value
 * @param changeFunction - Function to set the input value
 *
 * @returns ADS Number Input
 */

function ADSNumberInput(props: {
  label?: string;
  disabled?: boolean;
  minValue?: number;
  maxValue?: number;
  stepValue?: number;
  defaultValue?: number;
  changeFunction: any;
}) {
  const {
    label, disabled, minValue, maxValue, stepValue, defaultValue, changeFunction
  } = props;

  const [value, setInputValue] = useState();
  const inputFieldId = `${label} input field`;

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
    changeFunction(event.target.value);
  };

  return (
    <div>
      <Typography className="body2">
        {label}
      </Typography>
      <OutlinedInput
        style={{ backgroundColor: 'white' }}
        className="outlined-number-input"
        aria-label={inputFieldId}
        disabled={disabled}
        aria-disabled={disabled ? 'true' : 'false'}
        value={value !== undefined ? value : defaultValue}
        size="small"
        fullWidth
        onChange={handleInputChange}
        inputProps={{
          step: stepValue,
          min: minValue,
          max: maxValue,
          type: 'number',
          'aria-label': 'input-slider text field'
        }}
      />
    </div>
  );
}

ADSNumberInput.defaultProps = {
  label: '',
  disabled: false,
  minValue: 0,
  maxValue: 100,
  stepValue: 1,
  defaultValue: 50
};

export default ADSNumberInput;
