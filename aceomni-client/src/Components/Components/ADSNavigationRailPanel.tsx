/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  faBars, faQuestion
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';

import './ADSNavigationRail.css';
import './ADSNavigationPanel.css';
import { useNavigate } from 'react-router-dom';

interface ADSNavigationRailPanelProps {
  menuItems: Array<any>,
}
/**
 * Returns an ADS Navigation Rail
 * @param menuItems -- Array of elements for the navigation rail/panel.
 *                     All elements must have an icon, id, label, and action
 *
 * @returns ADS Navigation Rail and ADS Navigation Panel
 */
function ADSNavigationRailPanel(props: ADSNavigationRailPanelProps) {
  const {
    menuItems
  } = props;
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // menuItem[0] is home
    let { id } = menuItems[0];
    const sessionNavigationRailPanelId = sessionStorage.getItem('NavigationRailPanelId');
    if (sessionNavigationRailPanelId !== null) {
      id = sessionNavigationRailPanelId;
    } else {
      // if session variable not set, then go to home
      navigate(menuItems[0].action);
    }
    setActiveMenuItem(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavClick = (option: any, id: string) => {
    navigate(option.action);
    setActiveMenuItem(id);
    sessionStorage.setItem('NavigationRailPanelId', id);
  };

  if (isSidebarOpen) {
    return (
      <Container
        no-gutters="true"
        fluid
        className="navPanel"
      >
        <Row style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          {/* Hamburger menu */}
          <Col style={{ paddingLeft: '0', paddingRight: '0' }}>
            <div
              className="navigationHamburger"
              tabIndex={0}
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{ height: '72px', paddingBottom: '16px' }}
            >
              <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={faBars} />
            </div>
          </Col>
          {/* Loop through list */}
          {menuItems.map((option: any) => (
            option.value === 'divider'
              ? (
                <Col
                  style={{ paddingLeft: '0', paddingRight: '0' }}
                  key={option.id}
                >
                  <div
                    className="navPanelDivider"
                  >
                    <hr style={{ flexGrow: '1' }} />
                  </div>
                </Col>
              )
              : (
                <Col
                  className={activeMenuItem === `${option.id}` ? 'activeCol' : 'navPanelCol'}
                  tabIndex={0}
                  key={option.id}
                  onClick={() => handleNavClick(option, `${option.id}`)}
                >
                  <div
                    className="navPanelIcon"
                  >
                    <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={option.icon || faQuestion} />
                  </div>
                  <div
                    className="navPanelLabel"
                  >
                    {option.label}
                  </div>
                </Col>
              )
          ))}
        </Row>
      </Container>
    );
  }
  return (
    <Container
      no-gutters="true"
      fluid
      className="navRail"
    >
      <Row>
        {/* Hamburger menu */}
        <Col style={{ paddingLeft: '16px', paddingRight: '16px' }}>
          <div
            className="navigationHamburger"
            tabIndex={0}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{ height: '72px', paddingBottom: '16px' }}
          >
            <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={faBars} />
          </div>
        </Col>
        {/* Loop through list */}
        {menuItems.map((option) => (
          option.value === 'divider'
            ? (
              <Col
                style={{ paddingLeft: '16px', paddingRight: '16px' }}
                key={option.id}
              >
                <div
                  className="navRailDivider"
                >
                  <hr style={{ flexGrow: '1' }} />
                </div>
              </Col>
            )
            : (
              <Col
                style={{ paddingLeft: '16px', paddingRight: '16px' }}
                key={option.id}
                onClick={() => handleNavClick(option, `${option.id}`)}
              >
                <div
                  tabIndex={0}
                  className={activeMenuItem === `${option.id}` ? 'activeRailItem' : 'navRailItem'}
                >
                  <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={option.icon || faQuestion} />
                </div>
              </Col>
            )
        ))}
      </Row>
    </Container>
  );
}

ADSNavigationRailPanel.defaultProps = {

};

export default ADSNavigationRailPanel;
