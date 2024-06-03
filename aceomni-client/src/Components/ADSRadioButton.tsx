import React from 'react';
import Form from 'react-bootstrap/Form';
import './ADSRadioButton.css';

/**
 * Returns an ADS Radio Button
 *
 * ADS Radio Buttons must be in a ADSRadioButtonGroup
 *
 * @param label - Radio button text
 * @param disabled - true | false
 * @param checked - true | false
 * @param inline - true if horizontal radio buttons wanted | false if vertical
 * @param groupName - Name of radio button group shared between mutually exclusive buttons
 * @param selectChangeFunction - Function to handle new selected value
 *
 * @returns ADS Radio Button
 */

function ADSRadioButton(props: {
  label: string;
  disabled?: boolean;
  checked?: boolean;
  inline?: boolean;
  groupName: string;
  selectChangeFunction: any;
}) {
  const {
    label, disabled, checked, inline, groupName, selectChangeFunction
  } = props;

  /**
   * Radio button changes trigger update function
   * @param toggle radio toggle checked or unchecked value
   */
  function updateSelectedValue(toggle: any) {
    console.log(toggle);
    selectChangeFunction(toggle);
  }

  return (
    <Form.Check
      id={label}
      inline={inline}
    >
      <div className="radio-button-wrapper">
        <Form.Check.Input
          className="radio-button"
          disabled={disabled}
          checked={checked}
          type="radio"
          name={groupName}
          onChange={(e) => updateSelectedValue(e.target.id)}
        />
        <Form.Check.Label className="radio-button">{label}</Form.Check.Label>
      </div>
    </Form.Check>
  );
}

ADSRadioButton.defaultProps = {
  disabled: false,
  checked: null,
  inline: null
};

export default ADSRadioButton;
