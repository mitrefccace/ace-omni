import React, { useEffect } from 'react';
import Form from 'react-bootstrap/Form';

interface Props {
  id?: string;
  label?: string;
  children: any;
}

/**
 * Creates an ADS Radio Button Group
 *
 * @param id - An id for css purposes
 * @param label - Label to be displayed on radio button group
 * @param children - Radio buttons to be in group
 *
 * @returns ADS Radio Button Group
 */

function ADSRadioButtonGroup({
  id, label, children
}: Props) {
  const setFirstRadioToChecked = () => {
    const radioGroups = document.getElementsByClassName('radio-button-group');
    for (let i = 0; i < radioGroups.length; i += 1) {
      const radioGroup = radioGroups[i];
      const radioButtonDivWrapper = radioGroup.querySelector('.radio-button-wrapper');
      if (radioButtonDivWrapper) {
        const radioButton = radioButtonDivWrapper.querySelector('.form-check-input');
        if (radioButton) {
          radioButton.setAttribute('checked', 'checked');
        }
      }
    }
  };

  useEffect(() => {
    setFirstRadioToChecked();
  });

  return (
    <Form
      id={id}
      className="radio-button-group"
    >
      <Form.Label className="body2">{label}</Form.Label>
      <div role="radiogroup" aria-label={label}>
        {children}
      </div>
    </Form>
  );
}

ADSRadioButtonGroup.defaultProps = {
  id: '',
  label: ''
};

export default ADSRadioButtonGroup;
