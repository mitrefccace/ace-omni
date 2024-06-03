import React, { useState } from 'react';

import './ADSButton.css';
import './ADSSplitButton.css';
import { ButtonGroup, Dropdown } from 'react-bootstrap/';
import ADSButton from './ADSButton';
import ADSMenu from './ADSMenu';

interface ADSSplitButtonProps {
  buttonText: string;
  disabled?: boolean;
  fontType?: string;
  height?: 'small' | 'medium' | 'large';
  icon?: any;
  onButtonClick: () => void;

  alignOption?: 'auto-end'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start';
  menuButtonID: string;
  menuButtonAriaLabel: string;
  menuID: string;
  menuOptions: Array<any>;
  menuWidth?: string;
  subMenuWidth?: string;
  secondSubMenuWidth?: string;
  onItemClick: (e: any) => void;

  variant?: 'primary' | 'secondary' | 'tertiary';
}

/**
 * Returns an ADS Split Button
 *
 * @param buttonText - Text of a button.
 * @param disabled - true | false (default: false)
 * @param fontType - CSS class with font to use
 * @param height - 'small' | 'medium' | 'large' (default: medium)
 * @param icon - FontAwesome IconDefinition
 * @param onButtonClick - onClick Event Handler
 *
 * @param alignOption - 'auto-end'
  | 'bottom-end'
  | 'bottom-start' (default)
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start'. position of menu relative to menu button
 *
 * @param menuButtonID - ID of menu button
 * @param menuButtonAriaLabel - Aria Label of menu button
 * @param menuID - ID of menu
 * @param menuOptions - Array of menu items
 * @param menuWidth - Pixel value of menu width
 * @param onItemClick - onItemClick Event Handler
 * @param subMenuWidth - Pixel value of submenu width
 * @param secondSubMenuWidth - Pixel value of second submenu width
 *
 * @param variant - 'primary' | 'secondary' (default: primary)
 *
 * @returns ADS Split Button
 */
export default function ADSSplitButton(props: ADSSplitButtonProps) {
  const {
    buttonText, disabled, fontType, height, icon, onButtonClick, variant, menuOptions,
    alignOption, menuWidth, subMenuWidth, secondSubMenuWidth,
    menuButtonAriaLabel, menuButtonID, menuID, onItemClick
  } = props;

  const [menuIsVisible, setMenuVisibility] = useState(false);

  const [anchorElement, setAnchorElement] = React.useState<null | HTMLElement>(null);

  const handleDropdownToggleClick = (e: any) => {
    setMenuVisibility(!menuIsVisible);
    setAnchorElement(e.currentTarget.parentElement);

    // Remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleMenuClick = (e: any) => {
    onItemClick(e);
    setMenuVisibility(!menuIsVisible);

    // Remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleMenuClickAway = () => {
    setMenuVisibility(!menuIsVisible);
  };

  return (
    <Dropdown as={ButtonGroup}>

      <ADSButton
        buttonText={buttonText}
        className={`splitButtonButton-${variant}`}
        height={height}
        icon={icon}
        onClick={onButtonClick}
        variant={variant}
        disabled={disabled}
      />
      <Dropdown.Toggle
        disabled={disabled}
        onClick={handleDropdownToggleClick}
        variant={`btn btn-${variant} btn-${height} btn-style ${fontType} splitButtonDropdownToggle-${variant}`}
        id={menuButtonID}
        aria-label={menuButtonAriaLabel}
      />

      {menuIsVisible
        ? (
          <ADSMenu
            anchor={anchorElement}
            open={menuIsVisible}
            options={menuOptions}
            menuPlacement={alignOption || 'bottom-start'}
            menuWidth={menuWidth!}
            subMenuWidth={subMenuWidth!}
            secondSubMenuWidth={secondSubMenuWidth!}
            isChild={false}
            level={1}
            setMenuOption={handleMenuClick}
            clickAway={handleMenuClickAway}
            menuButtonID={menuButtonID}
            menuID={menuID}
          />
        )
        : null}
    </Dropdown>
  );
}

ADSSplitButton.defaultProps = {
  disabled: false,
  fontType: 'button',
  height: 'medium',
  icon: '',

  alignOption: 'bottom-start',
  menuWidth: '200px',
  subMenuWidth: '200px',
  secondSubMenuWidth: '200px',

  variant: 'primary'
};
