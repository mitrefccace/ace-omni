import React, { useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import './ADSButtonGroup.css';

interface Props {
  label?: string;
  children: any;
}

/**
 * Creates an ADS Button Group
 *
 * @param id - An id for css purposes
 * @param label - Label to be displayed on radio button group
 * @param children - Buttons to be in group
 *
 * @returns ADS Radio Button Group
 */

function ADSButtonGroup({
  label, children
}: Props) {
  const setFirstGroupButtonToChecked = () => {
    const radioGroups = document.getElementsByClassName('ads-button-group');
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
    setFirstGroupButtonToChecked();
  });

  return (
    <ButtonGroup aria-label={label} className="ads-button-group">
      {children}
    </ButtonGroup>
  );
}

ADSButtonGroup.defaultProps = {
  label: ''
};

export default ADSButtonGroup;
