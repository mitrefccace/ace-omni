/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../ADSButton.css';
import '../Assets/css/ADSMenuIconButton.css';
import { Dropdown } from 'react-bootstrap';
import ADSMenu from '../ADSMenu';

interface ADSMenuIconButtonProps {
  icon: any,
  text?: string,
  disabled?: boolean,
  fontType?: string,
  height?: 'small' | 'medium' | 'large',
  variant?: 'primary' | 'secondary' | 'tertiary',
  menuOptions: Array<any>,
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
  setMenuOption: any,
  menuButtonID: string,
  menuID: string
}

/**
 * Returns an ADS Button
 *
 * @param buttonText - Text of a button.
 * @param disabled - true | false (default: false)
 * @param fontType -
 * @param height - 'small' | 'medium' | 'large' (default: medium)
 * @param menuOptions - array of menu items
 * @param alignOption - 'auto-end'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start'. position of menu relative to menu button
 * @param variant - 'primary' | 'secondary' | 'tertiary' (default: primary)
 * @param menuWidth - pixel value of menu width
 * @param subMenuWidth - pixel value of submenu width
 * @param secondSubMenuWidth - pixel value of second submenu width
 * @param setMenuOption - function to set the menu option
 * @param menuButtonID - ID of menu button
 * @param menuID - ID of menu
 *
 * @returns ADS Button
 */
function ADSMenuIconButton(props: ADSMenuIconButtonProps) {
  const {
    disabled, fontType, height, variant, menuOptions,
    alignOption, menuWidth, subMenuWidth, secondSubMenuWidth, setMenuOption, menuButtonID, menuID
  } = props;

  const [menuIsVisible, setMenuVisibility] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (e: any) => {
    setMenuVisibility(!menuIsVisible);
    setAnchorEl(e.currentTarget);

    // remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleMenuClick = (e: any) => {
    setMenuOption(e);
    setMenuVisibility(!menuIsVisible);
    // remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleClickAway = () => {
    setMenuVisibility(!menuIsVisible);
  };

  return (
    // Rectangular button with dropdown icon
    <Dropdown>
      <Dropdown.Toggle
        disabled={disabled}
        onClick={handleClick}
        variant={`btn btn-${variant} btn-${height} btn-style ${fontType}`}
        id={menuButtonID}
      >
        <span className="dropdown-text">
          <FontAwesomeIcon icon={props.icon} aria-hidden="true" className={`${height}-btn-${variant}`} /> {props.text ? props.text : <></>}
        </span>

      </Dropdown.Toggle>

      {menuIsVisible
        ? (
          <ADSMenu
            anchor={anchorEl}
            open={menuIsVisible}
            options={menuOptions}
            menuPlacement={alignOption || 'bottom-start'}
            menuWidth={menuWidth!}
            subMenuWidth={subMenuWidth!}
            secondSubMenuWidth={secondSubMenuWidth!}
            isChild={false}
            level={1}
            setMenuOption={handleMenuClick}
            clickAway={handleClickAway}
            menuButtonID={menuButtonID}
            menuID={menuID}
          />
        )
        : null}
    </Dropdown>
  );
}

ADSMenuIconButton.defaultProps = {
  text: <></>,
  disabled: false,
  fontType: 'button',
  height: 'medium',
  variant: 'primary',
  alignOption: 'bottom-start',
  menuWidth: '200px',
  subMenuWidth: '200px',
  secondSubMenuWidth: '200px'
};

export default ADSMenuIconButton;
