import { faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import InputMask from 'react-input-mask';
import ADSIconButton from './ADSIconButton';
import ADSTooltip from './ADSTooltip';
import './ADSSingleLineTextField.css';

interface ADSSingleLineTextFieldProps {
  formText: string,
  setFormText: any,
  formLabel: string,
  isFormLabelHidden: boolean,
  placeholderText?: string,
  hasDelete: boolean,
  maxLength?: number,
  isPhoneNumber?: boolean,
  helpText?: string,
  fieldSize?: 'small' | 'medium' | 'large',
  elementID: string,
  password?: boolean;
  validationObj?: {
    validateValue: string,
    feedbackValue?: string,
    successFeedback?: boolean,
    passwordValid?: boolean
  };
  blurFunction?: any;
}

/**
 * Returns an ADS Single Line Text Field
 *
 * @param formText - Text inside the field
 * @param setFormText - Function to set formText
 * @param formLabel - Label text - required even if label is not visibile
 * @param isFormLabelHidden - Determnies if the form label is visibile
 * @param placeholderText - Placeholder text
 * @param hasDelete - true | false - determines if the text field has a delete button
 * @param maxLength - Character limit for the field
 * @param isPhoneNumber - true | false - determines if the text field has a masked input
 * @param helpText - Help text
 * @param fieldSize - 'small' | 'medium' | 'large' - default is medium
 * @param elementID - Unique ID for text field element used for accessibility
 * @param password - Determine if input field is for a password or hidden value
 * @param validationObj - Validation criteria value to be passed by user
    * @param validateValue - The text string on which validation will render valid | invalid
    * @param feedbackValue - The string that will display when a user enters an invalid value
    * @param successFeedback - Boolean to enbale/disable ONLY positive feedback within form
 * @param blurFunction - Function that fires on field blur
 *
 * @returns ADS Single Line Text Field
 */
function ADSSingleLineTextField(props: ADSSingleLineTextFieldProps) {
  const {
    formText,
    setFormText,
    formLabel,
    isFormLabelHidden,
    placeholderText,
    hasDelete,
    maxLength,
    isPhoneNumber,
    helpText,
    fieldSize,
    elementID,
    password,
    validationObj,
    blurFunction
  } = props;
  const [textValue, setValue] = React.useState(formText);
  const [validated, setValidated] = useState<boolean | undefined>(undefined);
  const [validatedClassName, setValidatedClassName] = useState('ads-validated-form');

  useEffect(() => {
    setValue(formText);
  }, [formText]);

  const handleChange = (e: any) => {
    setValue(e.target.value);
    setFormText(e.target.value);
  };

  // Can fire on blur
  const handleSubmit = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
    blurFunction();
    if (textValue !== validationObj?.validateValue) {
      setValidated(false);
      setValidatedClassName('ads-validated-form is-invalid');
      return;
    }
    setValidated(true);
    setValidatedClassName('ads-validated-form');
  };

  const clearText = () => {
    setValue('');
    setFormText('');

    // Remove focus from delete button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };
  if (isPhoneNumber) {
    return (
      <Form className="mx-auto">
        <Form.Label htmlFor={elementID} className="body2" visuallyHidden={isFormLabelHidden}>{formLabel}</Form.Label>
        <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
          <Form.Control
            type={password ? 'password' : ''}
            className={fieldSize}
            as={InputMask}
            mask="(999)-999-9999"
            value={formText}
            alwaysShowMask
            id={elementID}
            onChange={handleChange}
          />
          {hasDelete
            ? (
              <div className="input-group-prepend">
                <ADSTooltip content="Clear text" placement="top">
                  <ADSIconButton
                    ariaLabel="Clear Text"
                    disabled={false}
                    icon={faTimes}
                    height="clear-small"
                    onClick={clearText}
                    variant="clear-text"
                    aria-describedby={helpText !== '' ? `${elementID}-caption` : undefined}
                  />
                </ADSTooltip>
              </div>
            )
            : null}
        </Form.Group>
        {helpText !== ''
          ? (
            <Form.Text className="caption" id={`${elementID}-caption`}>
              {helpText}
            </Form.Text>
          )
          : null}
      </Form>
    );
  }

  if (validationObj) {
    return (
      <Form className="mx-auto" noValidate validated={validated} onBlur={handleSubmit} onSubmit={handleSubmit}>
        <Form.Label htmlFor={elementID} className="body2" visuallyHidden={isFormLabelHidden}> {formLabel}</Form.Label>
        <Form.Group className={hasDelete ? 'validated-field-container-delete' : 'validated-field-container'}>
          <Form.Control
            type={password ? 'password' : ''}
            style={validationObj?.successFeedback ? {} : { backgroundImage: 'none' }}
            className={validatedClassName + (hasDelete ? ` form-with-delete ${fieldSize}` : ` ${fieldSize}`)}
            placeholder={placeholderText !== '' ? placeholderText : undefined}
            onChange={handleChange}
            value={textValue}
            maxLength={maxLength}
            id={elementID}
            aria-describedby={helpText !== '' ? `${elementID}-caption` : undefined}
          />
          {hasDelete
            ? (
              <div className="input-group-prepend">
                <ADSTooltip content="Clear text" placement="top">
                  <ADSIconButton
                    ariaLabel="Clear Text"
                    disabled={false}
                    icon={faTimes}
                    height="clear-small"
                    onClick={clearText}
                    variant="clear-text"
                  />
                </ADSTooltip>
              </div>
            )
            : null}
          <Form.Control.Feedback type="invalid" className="caption">
            {validationObj?.feedbackValue ? validationObj.feedbackValue : 'Invalid Value'}
          </Form.Control.Feedback>
        </Form.Group>
        {(!validationObj?.feedbackValue && helpText)
          ? (
            <Form.Text className="caption" id={`${elementID}-caption`}>
              {helpText}
            </Form.Text>
          )
          : null}
      </Form>
    );
  }

  return (
    <Form className="mx-auto">
      <Form.Label htmlFor={elementID} className="body2" visuallyHidden={isFormLabelHidden}>{formLabel}</Form.Label>
      <Form.Group style={{ display: 'flex', alignItems: 'center' }}>
        <Form.Control
          type={password ? 'password' : ''}
          className={hasDelete ? `form-with-delete ${fieldSize}` : `${fieldSize}`}
          placeholder={placeholderText !== '' ? placeholderText : undefined}
          onChange={handleChange}
          value={textValue}
          maxLength={maxLength}
          id={elementID}
          aria-describedby={helpText !== '' ? `${elementID}-caption` : undefined}
        />
        {hasDelete
          ? (
            <div className="input-group-prepend">
              <ADSTooltip content="Clear text" placement="top">
                <ADSIconButton
                  ariaLabel="Clear Text"
                  disabled={false}
                  icon={faTimes}
                  height="clear-small"
                  onClick={clearText}
                  variant="clear-text"
                />
              </ADSTooltip>
            </div>
          )
          : null}
      </Form.Group>
      {helpText !== ''
        ? (
          <Form.Text className="caption" id={`${elementID}-caption`}>
            {helpText}
          </Form.Text>
        )
        : null}
    </Form>
  );
}

// Set default value for optional props
ADSSingleLineTextField.defaultProps = {
  placeholderText: '',
  maxLength: null,
  isPhoneNumber: false,
  helpText: '',
  fieldSize: 'medium',
  password: false,
  validationObj: null,
  blurFunction: null
};

export default ADSSingleLineTextField;
