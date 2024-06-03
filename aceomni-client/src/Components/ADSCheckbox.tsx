import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import './ADSCheckbox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import ADSTooltip from './ADSTooltip';

/**
 * Returns an ADS Checkbox
 *
 * @param label - Text next to checkbox
 * @param disabled - true | false
 * @param checked - true | false (if default set true it cannot be unchecked)
 * @param inline - true if horizontal checkboxes wanted | false if vertical
 * @param groupName - Name of radio button group shared between mutually exclusive buttons
 * @param padding - The amount of margin between label and checkbox. 'XXpx' where XX is the amount.
 * @param isHoverable - true if tooltip wanted | false if no.
 * @param hoverableText - The text you want to put in the tooltip if isHoverable is true.
 *
 * @returns ADS Checkbox
 */

function ADSCheckbox(props: {
  id?: string;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  inline?: boolean;
  groupName?: string;
  valueChangeFunction: any;
  lineHeight?: '32px' | '40px' | '48px';
  isHoverable?: boolean;
  hoverableText?: string;
}) {
  const {
    id,
    label,
    disabled,
    checked,
    inline,
    groupName,
    valueChangeFunction,
    lineHeight,
    isHoverable,
    hoverableText
  } = props;

  const [currentCheckedValue, setCurrentCheckedValue] = useState(checked);

  let lineHeightClass: string;

  // Conditional for height of the checkbox
  switch (lineHeight) {
    case '32px':
      lineHeightClass = '-small';
      break;
    case '40px':
      lineHeightClass = '-medium';
      break;
    case '48px':
    default:
      lineHeightClass = '-large';
      break;
  }

  const labelHiddenClass: string = label ? '' : 'hidden';

  /**
   * Checkbox changes trigger update function
   * @param toggle checkbox toggle checked or unchecked value
   */
  function updateCheckedValue(toggle: any) {
    setCurrentCheckedValue(toggle);
    valueChangeFunction(toggle);
  }

  // When checkbox is checked or unchecked, we want to set current checkbox value
  useEffect(() => {
    setCurrentCheckedValue(checked);
  }, [checked]);

  return (
    <Form.Check
      className={`ads-checkbox ads-checkbox${lineHeightClass}`}
      id={id || label}
      inline={inline}
    >
      <div className="checkbox-wrapper">
        <Form.Check.Input
          className="checkbox"
          disabled={disabled}
          checked={currentCheckedValue}
          type="checkbox"
          name={groupName}
          onChange={(e) => updateCheckedValue(e.target.checked)}
          style={{ lineHeight }}
        />
        <Form.Check.Label className={`checkbox ${labelHiddenClass}`}>
          {label}
          {isHoverable
            ? (
              <ADSTooltip
                placement="right"
                content={hoverableText}
              >
                <FontAwesomeIcon
                  icon={faCircleQuestion}
                  style={{ marginLeft: '15px' }}
                />
              </ADSTooltip>
            )
            // eslint-disable-next-line react/jsx-no-useless-fragment
            : <></>}
        </Form.Check.Label>
      </div>
    </Form.Check>
  );
}

ADSCheckbox.defaultProps = {
  id: '',
  disabled: false,
  checked: null,
  inline: null,
  groupName: '',
  lineHeight: '48px',
  isHoverable: false,
  hoverableText: ''
};

export default ADSCheckbox;
