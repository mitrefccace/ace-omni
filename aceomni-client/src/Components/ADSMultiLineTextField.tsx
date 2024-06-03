import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import './ADSMultiLineTextField.css';

interface TextFieldProps {
  formText: string,
  setFormText: any,
  formLabel: string,
  isFormLabelHidden: boolean,
  helpText?: string,
  placeholderText?: string,
  isDynamic: boolean,
  fieldHeight?: number, // pixels
  expandDownward?: boolean,
  maxFieldHeight?: number,
  elementID: string
}

/**
 * Returns an ADS Multi Line Text Field
 *
 * @param formText - Text inside the field
 * @param setFormText - Function to set formText
 * @param formLabel - Label text
 * @param isFormLabelHidden - Determnies if the form label is visibile
 * @param helpText - Help text
 * @param placeholderText - Placeholder text
 * @param isDynamic - true | false - determines if the text field has a fixed height
 * @param fieldHeight - Height of fixed field height in pixels
 * @param expandDownward - true | false - determines if the text field expands up or down
 * @param maxFieldHeight - Xax height of dynamic field in pixels. Default is 200
 * @param elementID - Unique ID for text field element used for accessibility
 *
 * @returns ADS Multi Line Text Field
 */

function TextField(props : TextFieldProps) {
  const {
    formText,
    setFormText,
    formLabel,
    isFormLabelHidden,
    helpText,
    placeholderText,
    isDynamic,
    fieldHeight,
    expandDownward,
    maxFieldHeight,
    elementID
  } = props;
  const textareaRef = useRef(document.createElement('textarea'));
  const [dynamicText, setDynamicText] = useState('');

  useEffect(() => {
    console.log(
      formText,
      setFormText,
      formLabel,
      helpText,
      placeholderText,
      isDynamic,
      fieldHeight,
      expandDownward
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    textareaRef.current.style.height = '0px';
    const { scrollHeight } = textareaRef.current;
    textareaRef.current.style.height = `${scrollHeight}px`;
  }, [dynamicText]);

  const handleFixedChange = (e: any) => {
    setFormText(e.target.value);
  };

  const handleDynamicChange = (e: any) => {
    setDynamicText(e.target.value);
    setFormText(e.target.value);
  };
  const dynamicFieldStyle = {
    maxHeight: `${maxFieldHeight}px`
  };

  if (isDynamic) {
    return (
      <Form className={expandDownward ? '' : 'expand-up-container'}>
        <Form.Group className={expandDownward ? 'mx-auto' : 'mx-auto expand-up-form-group'}>
          <Form.Label
            className="body2"
            htmlFor={elementID}
            visuallyHidden={isFormLabelHidden}
          >
            {formLabel}
          </Form.Label>
          <Form.Control
            className="textarea"
            ref={textareaRef}
            id={elementID}
            as="textarea"
            type="text"
            value={formText}
            style={dynamicFieldStyle}
            placeholder={placeholderText !== '' ? placeholderText : undefined}
            onChange={handleDynamicChange}
            aria-describedby={helpText !== '' ? `${elementID}-caption` : undefined}
          />
          {helpText !== ''
            ? (
              <Form.Text className="caption" id={`${elementID}-caption`}>
                {helpText}
              </Form.Text>
            )
            : null }
        </Form.Group>
      </Form>
    );
  }
  return (
    <Form>
      <Form.Group className="mx-auto">
        <Form.Label htmlFor={elementID} className="body2" visuallyHidden={isFormLabelHidden}>{formLabel}</Form.Label>
        <Form.Control
          className="textarea"
          id={elementID}
          as="textarea"
          type="text"
          value={formText}
          placeholder={placeholderText !== '' ? placeholderText : undefined}
          onChange={handleFixedChange}
          style={{ height: `${fieldHeight}px` }}
          aria-describedby={helpText !== '' ? `${elementID}-caption` : undefined}
        />
        {helpText !== ''
          ? (
            <Form.Text className="caption" id={`${elementID}-caption`}>
              {helpText}
            </Form.Text>
          )
          : null }
      </Form.Group>
    </Form>
  );
}

// Set default value for optional props
TextField.defaultProps = {
  helpText: '',
  placeholderText: '',
  expandDownward: true,
  fieldHeight: 80,
  maxFieldHeight: 200
};

export default TextField;
