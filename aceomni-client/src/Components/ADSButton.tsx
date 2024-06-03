import React, { } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './ADSButton.css';

/**
 * Returns an ADS Button
 *
 * @param buttonText - Text of a button.
 * @param className - CSS class to use
 * @param disabled - true | false (default: false)
 * @param fontType - CSS class with font to use
 * @param height - 'small' | 'medium' | 'large' (default: medium)
 * @param icon - FontAwesome IconDefinition
 * @param onClick - onClick Event Handler
 * @param variant - 'primary' | 'secondary' | 'tertiary' (default: primary)
 * @param id - id for css purposes
 *
 * @returns ADS Button
 */
export default function ADSButton(props: {
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  fontType?: string;
  height?: 'small' | 'medium' | 'large';
  icon?: any;
  iconPosition?: 'start' | 'end'
  onClick?: any;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'hangup';
  shape?: string;
  width?: string;
  id?: string;
}) {
  const {
    buttonText,
    className,
    disabled,
    fontType,
    height,
    icon,
    iconPosition,
    onClick,
    variant,
    shape,
    width,
    id
  } = props;

  if (icon) {
    if (shape) {
      return (
        // Rectangular button with icon
        <button
          id={id}
          className={`btn btn-${shape}-${variant}-filled btn-${shape}-${height} btn-style ${className} ${fontType}`}
          style={{ width: `${width}` }}
          disabled={disabled}
          type="button"
          onClick={onClick}
        >
          <span aria-hidden="true">
            {/* Rotate icon if this is a hangup button */}
            <FontAwesomeIcon icon={icon} className={variant === 'hangup' ? 'icon-rotate' : ''} />
          </span>
          {buttonText}
        </button>
      );
    }
    return (
      // Rectangular button with icon
      <button
        id={id}
        className={`btn btn-${variant} btn-${height} btn-style ${className} ${fontType}`}
        style={{ width: `${width}` }}
        disabled={disabled}
        type="button"
        onClick={onClick}
      >
        {iconPosition === 'start' ? (
          <span aria-hidden="true" style={{ paddingRight: '8px' }}>
            {/* Rotate icon if this is a hangup button */}
            <FontAwesomeIcon icon={icon} className={variant === 'hangup' ? 'icon-rotate' : ''} />
          </span>
        ) : ''}
        {buttonText}
        {iconPosition === 'end' ? (
          <span aria-hidden="true" style={{ paddingLeft: '8px' }}>
            {/* Rotate icon if this is a hangup button */}
            <FontAwesomeIcon icon={icon} className={variant === 'hangup' ? 'icon-rotate' : ''} />
          </span>
        ) : ''}
      </button>
    );
  }

  return (
    // Rectangular button without icon
    <button
      id={id}
      className={`btn btn-${variant} btn-${height} btn-style ${className} ${fontType}`}
      style={{ width: `${width}` }}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}

ADSButton.defaultProps = {
  buttonText: '',
  className: '',
  disabled: false,
  fontType: 'button',
  height: 'medium',
  icon: '',
  iconPosition: 'start',
  onClick: {},
  variant: 'primary',
  shape: '',
  width: '',
  id: ''
};
