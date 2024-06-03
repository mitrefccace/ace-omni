import React, { } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import './ADSLink.css';
import { Link } from 'react-router-dom';

interface Props {
  url: string,
  linkText: string,
  fontType: string,
  isExternal: boolean,
  isNavigational: boolean,
  icon?: any,
  iconVariant?: 'standard' | 'filled' | 'outlined' | 'clear-text',
  iconColor?: string,
  iconSize?: 'xs' | 'sm' | 'med' | 'lg' | 'xl' | string,
  iconAriaLabel?: string,
  onClickFunction?: any
}
/**
 * @returns ADS Link
 * @param url - URL
 * @param linkText - Text to be displayed
 * @param fontType - Classname from the ADS Font Style. See type_scale.scss for options
 * @param isExternal - Determines if the link will send users outside of the ACE Omni platform.
 *                     Set to false if the link navigates internally.
 * @param isNavigational - Determines if the link navigates on click
 * @param icon - FontAwesome IconDefinition
 * @param iconVariant - 'standard' | 'filled' | 'outlined' (default: filled)
 * @param iconColor - 'any hex value' | (default: blue #1E3050)
 * @param iconSize - 'fontawesome icon default sizes' | 'css px em etc size'
 * @param iconAriaLabel - ARIA label for icon button
 * @param onClickFunction - REQUIRED IF isNavigational IS FALSE.
 *                          onclick function if link does not navigate the user
 */
export default function ADSLink(props: Props) {
  const {
    url, linkText, fontType, isExternal, isNavigational,
    icon, iconVariant, iconColor, iconSize, iconAriaLabel, onClickFunction
  } = props;

  const keyUpFunction = (e: any) => {
    if (e.keyCode === 32 || e.keyCode === 13) {
      onClickFunction();
    }
  };

  if (!isNavigational) {
    return (
      <span
        className={`ads-link ${fontType}`}
        onClick={onClickFunction}
        onKeyUp={keyUpFunction}
        role="button"
        tabIndex={0}
      >
        {linkText}
      </span>
    );
  }

  if (isExternal) {
    return (
      <span className="ads-link-wrapper">
        <a
          target="_blank"
          href={url}
          className={`ads-link ${fontType}`}
          rel="noreferrer"
        >
          {linkText}
          <FontAwesomeIcon
            aria-label={iconAriaLabel}
            icon={faExternalLinkAlt}
            aria-hidden="true"
            className={`medium-btn-${iconVariant} fa-${iconSize}`}
            style={{ color: `${iconColor}`, textDecoration: 'none', paddingLeft: '6px' }}
          />
        </a>
      </span>
    );
  }

  return (
    <Link
      to={url}
      className={`ads-link ${fontType}`}
    >
      {linkText}
      {icon
        ? (
          <FontAwesomeIcon
            aria-label={iconAriaLabel}
            icon={icon}
            aria-hidden="true"
            className={`medium-btn-${iconVariant} fa-${iconSize}`}
            style={{ color: `${iconColor}`, textDecoration: 'none', paddingLeft: '6px' }}
          />
        )
        : null}
    </Link>
  );
}

ADSLink.defaultProps = {
  icon: null,
  iconVariant: 'filled',
  iconColor: '',
  iconSize: '',
  iconAriaLabel: '',
  onClickFunction: () => null
};
