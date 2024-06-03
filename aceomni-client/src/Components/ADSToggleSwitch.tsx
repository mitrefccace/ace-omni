import React from 'react';
import Form from 'react-bootstrap/Form';
import './ADSToggleSwitch.css';

interface Props {
  id: string;
  disabled?: boolean;
  label: string;
  onChangeFunction: any;
}

/**
 * Creates a Toggle Switch
 *
 * @param label - Label to be displayed on toggle element (required)
 * @param id - An id to associate with label (required)
 * @param disabled - To disable or enable a toggle switch
 *
 */

function ADSToggleSwitch({
  id, disabled, label, onChangeFunction
}: Props) {
  const handleChange = (e: any) => {
    console.log(e.target.checked);
    onChangeFunction(e.target.checked);
  };
  return (
    <Form className="ads-toggle">
      <Form.Check
        className="toggle-switch"
        type="switch"
        id={id}
        label={label}
        disabled={disabled}
        onChange={handleChange}
      />
    </Form>
  );
}

ADSToggleSwitch.defaultProps = {
  disabled: ''
};

export default ADSToggleSwitch;
