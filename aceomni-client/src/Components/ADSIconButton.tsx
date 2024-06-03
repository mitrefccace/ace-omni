/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ADSMenu from './ADSMenu';

import './ADSIconButton.css';

/**
 * Returns an ADS Icon Button
 *
 * @param ariaLabel - ARIA label for icon button
 * @param disabled - true | false
 * @param height - 'small' | 'medium' | 'large' (default: medium)
 * @param icon - FontAwesome IconDefinition
 * @param onClick - onClick Event Handler
 * @param variant - 'standard' | 'filled' | 'outlined' (default: filled)
 * @param color - 'any hex value' | (default: blue #1E3050)
 * @param size - 'fontawesome icon default sizes' | 'css px em etc size'
 *
 * @returns ADS Icon Button
 */
export default function ADSIconButton(props: {
  ariaLabel: string;
  disabled?: boolean;
  height?: 'clear-small' | 'small' | 'medium' | 'large';
  icon: any;
  onClick: () => void;
  // Props for if this icon has an associated menu
  hasMenu?: boolean;
  variant?: 'standard' | 'filled' | 'outlined' | 'clear-text';
  color?: string;
  size?: 'xs' | 'sm' | 'med' | 'lg' | 'xl' | string;
  menuOptions?: Array<any>,
  alignOption?: 'auto-end'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start',
  menuWidth?: string,
  subMenuWidth?: string,
  secondSubMenuWidth?: string,
  setMenuOption?: any,
  menuButtonID?: string,
  menuID?: string
}) {
  const {
    ariaLabel, disabled, height, icon, onClick, hasMenu, variant, color, size, menuOptions,
    alignOption, menuWidth, subMenuWidth, secondSubMenuWidth, setMenuOption, menuButtonID, menuID
  } = props;

  const [menuIsVisible, setMenuVisibility] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (e: any) => {
    setMenuVisibility(!menuIsVisible);
    setAnchorEl(e.currentTarget);

    // Remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleMenuClick = (e: any) => {
    setMenuOption(e);
    setMenuVisibility(!menuIsVisible);
    // Remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleClickAway = () => {
    setMenuVisibility(!menuIsVisible);
  };

  // Circular icon button
  if (icon) {
    return (
      <>
        <button
          className={`btn btn-circular-${variant} btn-circular-${height} btn-style`}
          disabled={disabled}
          type="button"
          onClick={hasMenu ? handleClick : onClick}
          aria-label={ariaLabel}
        >
          <FontAwesomeIcon icon={icon} aria-hidden="true" className={`${height}-btn-${variant} fa-${size}`} style={{ color: `${color}` }} />
        </button>
        {menuIsVisible
          ? (
            <ADSMenu
              anchor={anchorEl}
              open={menuIsVisible}
              options={menuOptions!}
              menuPlacement={alignOption || 'bottom-start'}
              menuWidth={menuWidth!}
              subMenuWidth={subMenuWidth!}
              secondSubMenuWidth={secondSubMenuWidth!}
              isChild={false}
              level={1}
              setMenuOption={handleMenuClick}
              clickAway={handleClickAway}
              menuButtonID={menuButtonID!}
              menuID={menuID!}
            />
          )
          : null}
      </>
    );
  }
  return (
    <>
      <button
        className={`btn btn-circular-${variant} btn-circular-${height} btn-style`}
        disabled={disabled}
        type="button"
        onClick={hasMenu ? handleClick : onClick}
        aria-label={ariaLabel}
      />
      {menuIsVisible
        ? (
          <ADSMenu
            anchor={anchorEl}
            open={menuIsVisible}
            options={menuOptions!}
            menuPlacement={alignOption || 'bottom-start'}
            menuWidth={menuWidth!}
            subMenuWidth={subMenuWidth!}
            secondSubMenuWidth={secondSubMenuWidth!}
            isChild={false}
            level={1}
            setMenuOption={handleMenuClick}
            clickAway={handleClickAway}
            menuButtonID={menuButtonID!}
            menuID={menuID!}
          />
        )
        : null}
    </>
  );
}

ADSIconButton.defaultProps = {
  disabled: false,
  height: 'medium',
  hasMenu: false,
  variant: 'filled',
  color: '',
  size: '',
  menuOptions: [],
  alignOption: 'bottom-start',
  menuWidth: '200px',
  subMenuWidth: '200px',
  secondSubMenuWidth: '200px',
  setMenuOption: null,
  menuButtonID: '',
  menuID: ''
};
