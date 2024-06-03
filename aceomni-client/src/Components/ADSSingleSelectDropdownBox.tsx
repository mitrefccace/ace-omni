import React, { useEffect, useState } from 'react';

import './ADSSingleSelectDropdownBox.css';
import Select from 'react-select';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ADSTooltip from './ADSTooltip';

interface ADSSingleSelectDropdownBoxProps {
  dropdownBoxOptions: Array<any>,
  defaultSelectedOption?: Object,
  setSelectedOption: any,
  formLabel: string,
  isFormLabelHidden: boolean,
  helpText?: string,
  fieldSize?: 'small' | 'medium' | 'large',
  elementID: string,
  isDisabled?: boolean,
  dropdownName: string,
  tooltipText?: string
}

/**
 * Returns an ADS Dropdown Box
 *
 * @param dropdownBoxOptions - Array of elements to be shown in the dropdown menu.
 *                             Each option must have a unique ID
 * @param defaultSelectedOption - The default selected element - default is dropdownBoxOptions[0]
 * @param setSelectedOption - Function to set the selected element
 * @param formLabel - Label text - required even if label is not visibile
 * @param isFormLabelHidden - Determines if the form label is visibile
 * @param helpText - Help text
 * @param fieldSize - 'small' | 'medium' | 'large' - default is medium
 * @param elementID - Unique ID for text field element used for accessibility
 * @param isDisabled - Determines id dropdown box is disabled - default is false
 * @param dropdownName - Unique name for the dropdown box for accessibility
 * @param tooltipText - Text for tooltip next to label
 *
 * @returns ADS Dropdown Box
 */

function ADSSingleSelectDropdownBox(props: ADSSingleSelectDropdownBoxProps) {
  const {
    dropdownBoxOptions,
    defaultSelectedOption,
    setSelectedOption,
    formLabel,
    isFormLabelHidden,
    helpText,
    fieldSize,
    elementID,
    isDisabled,
    dropdownName,
    tooltipText
  } = props;

  const [focusedVal, setFocusedVal] = useState(dropdownBoxOptions[0]);

  useEffect(() => {
    // Set default selected
    let defaultOption;
    if (defaultSelectedOption) {
      if (Object.keys(defaultSelectedOption).length > 0
        && Object.getPrototypeOf(defaultSelectedOption) === Object.prototype) {
        defaultOption = defaultSelectedOption;
        setFocusedVal(defaultOption);
        setSelectedOption(defaultOption);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultSelectedOption]);

  // Get pixel value of field sizes
  let fieldHeight = '40px';
  const size = fieldSize;
  switch (size) {
    case 'small':
      fieldHeight = '32px';
      break;
    case 'medium':
      fieldHeight = '40px';
      break;
    case 'large':
      fieldHeight = '48px';
      break;
    default:
      // Default size medium
      fieldHeight = '40px';
  }

  const colorStyles = {
    control: (styles: any) => ({ ...styles, borderRadius: '0', height: fieldHeight }),
    option: (styles: any, state: any) => ({
      ...styles,
      height: fieldHeight,
      cursor: isDisabled ? 'not-allowed' : 'default',
      backgroundColor: state
    })
  };

  const handleChange = (e: any) => {
    setFocusedVal(e);
    setSelectedOption(e);
  };

  return (
    <>
      <label id={`${elementID}-label`} className={isFormLabelHidden ? 'visually-hidden' : 'body2 form-label'} htmlFor={elementID}>{formLabel}</label>
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
      <Select
        options={dropdownBoxOptions}
        value={dropdownBoxOptions.find((element) => element.id === focusedVal.id)}
        defaultValue={defaultSelectedOption}
        classNamePrefix="ADS"
        isSearchable={false}
        styles={colorStyles}
        onChange={handleChange}
        id={elementID}
        aria-labelledby={`${elementID}-label`}
        aria-describedby={`${elementID}-caption`}
        name={dropdownName}
        isDisabled={isDisabled}
        blurInputOnSelect
      />
      <div className="caption dropdown-helptext" id={`${elementID}-caption`}>{helpText}</div>
    </>
  );
}

ADSSingleSelectDropdownBox.defaultProps = {
  defaultSelectedOption: {},
  helpText: '',
  fieldSize: 'medium',
  isDisabled: false,
  tooltipText: ''
};

export default ADSSingleSelectDropdownBox;
