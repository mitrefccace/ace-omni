/* eslint-disable jsx-a11y/click-events-have-key-events */
// eslint-disable-next-line jsx-a11y/no-static-element-interactions

import React, { useEffect, useState } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import './ADSNavigationPanel.css';
import './ADSSidebarMenu.css';

interface ADSSidebarMenuProps {
  menuItems: Array<any>,
  sideBarRef?: any,
  customPadding?: string
}
/**
   * Returns an ADS Sidebar Menu
   * @param menuItems -- Array of elements for the sidebar menu.
   *
   * @returns ADS Sidebar Menu
   */
function ADSSidebarMenu(props: ADSSidebarMenuProps) {
  const {
    menuItems,
    sideBarRef,
    customPadding
  } = props;
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  //   const navigate = useNavigate();

  useEffect(() => {
    setActiveMenuItem(menuItems[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavClick = (option: any, id: string) => {
    // navigate(option.action);
    sideBarRef.forEach((itemRef: any) => {
      if (option.label === itemRef.current.innerText) {
        itemRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    });
    setActiveMenuItem(id);
  };

  return (
    <Container
      no-gutters="true"
      fluid
      style={{ width: '250px', position: 'fixed' }}
      className="sidebarMenu"
    >
      <Row style={{ paddingLeft: '16px', paddingRight: '16px', paddingTop: customPadding }}>
        {/* Loop through list */}
        {menuItems.map((option: any) => (
          option.value === 'divider'
            ? (
              <Col
                style={{ paddingLeft: '0', paddingRight: '0', marginTop: '5' }}
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

ADSSidebarMenu.defaultProps = {
  sideBarRef: {},
  customPadding: '0px'
};

export default ADSSidebarMenu;
