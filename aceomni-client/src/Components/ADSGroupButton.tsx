import React from 'react';
import Form from 'react-bootstrap/Form';
import './ADSGroupButton.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Returns an ADS Group Button
 *
 * ADS Group Buttons must be in a ADSButtonGroup
 *
 * @param label - Radio button text
 * @param disabled - true | false
 * @param checked - true | false
 * @param icon - Name of FontAwesome icon
 * @param groupName - Name of radio button group shared between mutually exclusive buttons
 *
 * @returns ADS Radio Button
 */

function ADSGroupButton(props: {
  label: string;
  disabled?: boolean;
  checked?: boolean;
  groupName: string;
  icon?: any;
}) {
  const {
    label, disabled, checked, groupName, icon
  } = props;

  if (icon) {
    return (
      <Form.Check
        id={label}
        inline
      >
        <div className="radio-button-wrapper">
          <Form.Check.Input
            className="radio-button"
            disabled={disabled}
            checked={checked}
            type="radio"
            name={groupName}
          />
          <Form.Check.Label className="radio-button">
            <span aria-hidden="true">
              <FontAwesomeIcon icon={icon} />
            </span>
          </Form.Check.Label>
        </div>
      </Form.Check>
    );
  }

  return (
    <Form.Check
      id={label}
      inline
    >
      <div className="radio-button-wrapper">
        <Form.Check.Input
          className="radio-button"
          disabled={disabled}
          checked={checked}
          type="radio"
          name={groupName}
        />
        <Form.Check.Label className="radio-button">{label}</Form.Check.Label>
      </div>
    </Form.Check>
  );
}

ADSGroupButton.defaultProps = {
  disabled: false,
  checked: null,
  icon: ''
};

export default ADSGroupButton;
