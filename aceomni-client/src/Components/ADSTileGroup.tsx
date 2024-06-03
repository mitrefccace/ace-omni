import React, { useState } from 'react';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ADSTileGroup.css';
import Form from 'react-bootstrap/Form';

/**
 * Returns an ADS TileGroup Element
 *
 * @param label - Mandatory label for tile group (accessibility)
 * @param displayLabel - Boolean to determine whether the label is displayed above Tile Group
 * @param id - Mandatory ID for tile group
 * @param type - Group type Single (acts like radio) or Multi (acts like checkbox)
 * @param className - CSS class to use
 * @param group - Identifier for tile group, for accessibility
 *
 * @returns ADS Tile Group
 */

function ADSTileGroup(props: {
  label: string;
  displayLabel?: boolean;
  id: string;
  tiles: ADSTile[];
  type: 'single' | 'multi';
  group?: string;
  onChecked: (value:string) => void,
  onUnChecked: (value:string) => void
}) {
  const {
    id, label, tiles, type, group, displayLabel, onChecked, onUnChecked
  } = props;

  const [currentRadioValue, setCurrentRadioValue] = useState(0);

  const createTile = (newTile: ADSTile) => {
    if (!newTile.icons || newTile.icons.length < 1) {
      newTile.icons = [faComputer];
    }
    return (
      <div className={`ads-tile-render-container-disabled-${newTile.disabled ? 'true' : 'false'}`}>
        <div className={`ads-tile-container ${newTile.className}`}>
          <div className="ads-tile-icon">
            {
              newTile.icons.map((icon) => <FontAwesomeIcon key={`${newTile.className}_${icon}`} icon={icon} />)
            }
          </div>
          <div className="ads-tile-text">
            {newTile.textContent}
          </div>
        </div>
      </div>
    );
  };

  const displayRadioSelection = (val: any) => {
    console.log('Display Single Tile Selection', val);
  };

  const updateRadioValue = (e: any, val: any) => {
    const curr = e.currentTarget.getAttribute('class');
    setCurrentRadioValue(parseInt(curr.split(' ')[1].slice(-1), 10));
    displayRadioSelection(val);
  };

  const radioHelper = (e: any) => {
    // to prevent bubbling
    e.preventDefault();
    const curr = e.currentTarget.querySelector('input').getAttribute('class');
    const currIndex = parseInt(curr.split(' ')[1].slice(-1), 10);
    const element = document.getElementsByClassName(`ads-radio-button-${currIndex}`)[0] as HTMLElement;
    element.click();
  };

  const updateCheckboxValue = (e: any, value: string) => {
    if (e.target.checked) {
      onChecked(value);
    } else {
      onUnChecked(value);
    }
  };

  if (type === 'single') {
    return (
      <div className="tile-group-container">
        <Form className="ads-tile-radio-group" id={group}>
          <Form.Label htmlFor={group}>{displayLabel ? label : ''}</Form.Label>
          <div role="radiogroup" aria-label={label} className="ads-tile-radio-group-container">
            {tiles.map((tile: any, index: any) => (
              <Form.Check
                className="ads-radio-wrapper"
                key={`ads-tile-multi-key-${index * 5}`}
                onClick={(e) => radioHelper(e)}
              >
                <Form.Check.Label className="ads-tile-radio-label">
                  <Form.Check.Input
                    className={`radio-button ads-radio-button-${index}`}
                    disabled={tile.disabled}
                    checked={currentRadioValue === index}
                    type="radio"
                    onChange={(e) => updateRadioValue(e, tile.value)}
                    name={id}
                  />
                  <span className="ads-tile-radio-span">
                    {createTile(tile)}
                  </span>
                </Form.Check.Label>
              </Form.Check>
            ))}
          </div>
        </Form>
      </div>
    );
  }
  // Return default, which is checkbox tiles
  return (
    <div className="tile-group-container">
      <Form className="ads-tile-checkbox-group" id={group}>
        <Form.Label htmlFor={group}>{displayLabel ? label : ''}</Form.Label>
        <div aria-label={label} className="ads-tile-checkbox-group-container">
          {tiles.map((tile: any, index: any) => (
            <Form.Check
              className={`ads-checkbox-wrapper tile${index}`}
              key={`ads-tile-multi-key-${index * 5}`}
            >
              <Form.Check.Label className="ads-tile-checkbox-label">
                <Form.Check.Input
                  className={`checkbox-button ads-tile-checkbox ads-tile-checkbox-button-${index}`}
                  disabled={tile.disabled}
                  checked={tile.checked}
                  type="checkbox"
                  onChange={(e) => updateCheckboxValue(e, tile.value)}
                  name={id}
                />
                <span className="ads-tile-checkbox-span">
                  {createTile(tile)}
                </span>
              </Form.Check.Label>
            </Form.Check>
          ))}
        </div>
      </Form>
    </div>
  );
}

ADSTileGroup.defaultProps = {
  group: '',
  displayLabel: false
};

export interface ADSTile {
  textContent: any;
  className?: string;
  icons: Array<any>;
  checked?: boolean;
  disabled?: boolean;
  value: string;
}

export { ADSTileGroup };
