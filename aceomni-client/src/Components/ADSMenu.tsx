/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Popper from '@mui/material/Popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import ADSFullWidthDivider from './ADSFullWidthDivider';

interface ADSMenuProps {
  anchor: any,
  open: boolean,
  options: Array<any>,
  menuPlacement: 'auto-end'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start'
  menuWidth: string,
  isChild?: boolean,
  level?: number,
  setMenuOption: any,
  clickAway: any,
  subMenuWidth: string,
  secondSubMenuWidth: string,
  menuButtonID: string,
  menuID: string
}

/**
 * Returns an ADS Button
 *
 * @param anchor - HTML value of parent element.
 * @param open - true | false (default: false) determines if menu is visible
 * @param options - List of menu options
 * @param menuPlacement - 'auto-end'
  | 'bottom-end'
  | 'bottom-start'
  | 'left-end'
  | 'left-start'
  | 'right-end'
  | 'right-start'
  | 'top-end'
  | 'top-start'. Position of menu relative to menu button
 * @param menuWidth - Pixel value of menu width
 * @param subMenuWidth - Pixel value of submenu width
 * @param secondSubMenuWidth - Pixel value of second submenu width
 * @param isChild - Determines if the menu is a parent or submenu. Always set to false
 * @param level - Determines depth of submenu. Always set to 1.
 * @param setMenuOption - Function to set the menu option
 * @param clickAway - Function that fires when clicking off of menu
 * @param menuButtonID - ID of menu button
 * @param menuID - ID of menu
 *
 * @returns ADS Button
 */

function ADSMenu(props: ADSMenuProps) {
  const {
    anchor, open, options, menuPlacement, menuWidth, isChild,
    level, setMenuOption, clickAway, subMenuWidth, secondSubMenuWidth, menuButtonID, menuID
  } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [secondAnchorEl, setSecondAnchorEl] = React.useState<null | HTMLElement>(null);
  const [subMenuIsVisible, setSubMenuVisibility] = React.useState(false);
  const [secondSubMenuIsVisible, setSecondSubMenuVisibility] = React.useState(false);

  const handleClick = (option: any) => {
    setMenuOption(option);
    // Remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleLeave = () => {
    setSecondSubMenuVisibility(false);
  };

  const handleHover = (e: any) => {
    const menuOption = JSON.parse(e.currentTarget.getAttribute('value'));
    if (menuOption.items?.length > 0) {
      if (isChild) {
        setSecondSubMenuVisibility(true);
        setSecondAnchorEl(e.currentTarget);
      } else {
        setSubMenuVisibility(true);
        setAnchorEl(e.currentTarget);
      }
    } else if (isChild) {
      setSecondSubMenuVisibility(false);
    } else {
      setSubMenuVisibility(false);
    }
  };

  const closeMenu = () => {
    clickAway();
  };

  function getMenuWidth() {
    switch (level) {
      case 1:
        return menuWidth;
      case 2:
        return subMenuWidth;
      case 3:
        return secondSubMenuWidth;
      default:
        return menuWidth;
    }
  }

  return (
    <Popper
      open={open}
      anchorEl={anchor}
      role={undefined}
      placement={menuPlacement}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: () => {
              if (level! > 1) {
                return [0, -4];
              }
              return [0, 2];
            }
          }
        }
      ]}
      disablePortal
      sx={{
        width: `${getMenuWidth()}`,
        minWidth: '128px',
        border: '1px solid #C8C8C8',
        boxShadow: 'none',
        borderRadius: '0'
      }}
    >
      <Paper sx={{
        boxShadow: 'none', borderRadius: '0'
      }}
      >
        <ClickAwayListener onClickAway={() => { closeMenu(); }}>
          <MenuList
            autoFocusItem={open}
            id={menuID}
            aria-labelledby={menuButtonID}
            style={{ borderRadius: '0' }}
            sx={{
              boxShadow: 'none', borderRadius: '0'
            }}
          >
            {options.map((option, index) => (
              option.value !== 'group' && option.value !== 'divider'
                ? (
                  <MenuItem
                    key={index}
                    value={JSON.stringify(option)}
                    onClick={option.items ? () => null : () => handleClick(option)}
                    onMouseOver={handleHover}
                    onMouseLeave={handleLeave}
                    style={{ display: 'flex', alignItems: 'center' }}
                    disableRipple
                    sx={{
                      height: '40px',
                      color: 'black',
                      '&:hover': { backgroundColor: '#DDDDDD' }
                    }}
                    className="body1"
                  >
                    {/* Add icon to menu item if it exists */}
                    {option.icon ? (
                      <span
                        aria-hidden="true"
                        style={{
                          marginRight: '16px', height: '16px', width: '16px', display: 'flex'
                        }}
                      >
                        <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={option.icon} />
                      </span>
                    ) : null}
                    <span style={{ display: 'flex' }}>
                      {option.label}
                    </span>
                    {/* Add icon indicating it contains child items */}
                    {
                      option.items?.length > 0 ? (
                        <span
                          aria-hidden="true"
                          style={{
                            marginLeft: 'auto', height: '8px', width: '8px', display: 'flex', order: 2
                          }}
                        >
                          <FontAwesomeIcon style={{ height: '8px', width: '8px' }} icon={faCaretRight} />
                        </span>
                      ) : null
                    }

                    {/* Add nested menu */}
                    {
                      option.items?.length > 0 ? (
                        <ADSMenu
                          options={option.items}
                          anchor={isChild ? secondAnchorEl : anchorEl}
                          open={subMenuIsVisible || secondSubMenuIsVisible}
                          menuPlacement="right-start"
                          menuWidth={menuWidth}
                          subMenuWidth={subMenuWidth}
                          secondSubMenuWidth={secondSubMenuWidth}
                          isChild
                          level={level! + 1}
                          setMenuOption={setMenuOption}
                          clickAway={clickAway}
                          menuID={menuID}
                          menuButtonID={menuButtonID}
                        />
                      ) : null
                    }
                  </MenuItem>
                )
                : option.value === 'group'
                  ? (
                    <span key={index}>
                      {/* Add group header */}
                      <MenuItem
                        key={index}
                        style={{ display: 'flex', alignItems: 'center' }}
                        disableRipple
                        sx={{
                          height: '40px',
                          tabIndex: -1,
                          color: 'black',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          '&:hover': { backgroundColor: 'transparent' },
                          pointerEvents: 'none'
                        }}
                      >
                        {/* Add icon to menu item if it exists */}
                        {option.icon ? (
                          <span
                            aria-hidden="true"
                            style={{
                              marginRight: '16px', height: '16px', width: '16px', display: 'flex'
                            }}
                          >
                            <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={option.icon} />
                          </span>
                        ) : null}
                        <span style={{ display: 'flex' }}>
                          {option.label}
                        </span>
                      </MenuItem>
                      {/* Add group items */}
                      {option.items.map((subOption: any, subOptionIndex: any) => (
                        <MenuItem
                          key={subOptionIndex}
                          value={JSON.stringify(subOption)}
                          onClick={subOption.items
                            ? () => null : () => handleClick(subOption)}
                          onMouseOver={handleHover}
                          style={{ display: 'flex', alignItems: 'center' }}
                          disableRipple
                          sx={{
                            height: '40px',
                            paddingLeft: '24px',
                            color: 'black',
                            '&:hover': { backgroundColor: '#DDDDDD' }
                          }}
                          className="body1"
                        >
                          {/* Add icon to menu item if it exists */}
                          {subOption.icon ? (
                            <span
                              aria-hidden="true"
                              style={{
                                marginRight: '16px', height: '16px', width: '16px', display: 'flex'
                              }}
                            >
                              <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={subOption.icon} />
                            </span>
                          ) : null}

                          <span style={{ display: 'flex' }}>
                            {option.label}
                          </span>

                          {/* Add icon indicating it contains child items */}
                          {subOption.items?.length > 0 ? (
                            <span
                              aria-hidden="true"
                              style={{
                                marginLeft: 'auto', height: '8px', width: '8px', display: 'flex', order: 2
                              }}
                            >
                              <FontAwesomeIcon style={{ height: '8px', width: '8px' }} icon={faCaretRight} />
                            </span>
                          ) : null}

                          {/* Add nested menu */}
                          {subOption.items?.length > 0 ? (
                            <ADSMenu
                              options={subOption.items}
                              anchor={isChild ? secondAnchorEl : anchorEl}
                              open={subMenuIsVisible || secondSubMenuIsVisible}
                              menuPlacement="right-start"
                              menuWidth={menuWidth}
                              subMenuWidth={subMenuWidth}
                              secondSubMenuWidth={secondSubMenuWidth}
                              isChild
                              level={level! + 1}
                              setMenuOption={setMenuOption}
                              clickAway={clickAway}
                              menuID={menuID}
                              menuButtonID={menuButtonID}
                            />
                          ) : null}
                        </MenuItem>
                      ))}
                    </span>

                  )
                  : (
                    <div key={index} style={{ paddingTop: '8px', paddingBottom: '8px' }}>
                      <ADSFullWidthDivider />
                    </div>
                  )
            ))}
          </MenuList>
        </ClickAwayListener>
      </Paper>
    </Popper>
  );
}

ADSMenu.defaultProps = {
  level: 1,
  isChild: false
};

export default ADSMenu;
