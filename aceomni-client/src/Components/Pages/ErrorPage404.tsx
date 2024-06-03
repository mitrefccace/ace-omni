import React, {} from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Outlet, useNavigate } from 'react-router-dom';
import NavigationBar from '../Components/NavigationBar';
import './pages.css';
import ADSButton from '../ADSButton';

function ErrorPage404() {
  const navigate = useNavigate();

  return (
    <Container no-gutters="true" fluid style={{ height: '100vh' }}>
      <Container no-gutters="true" fluid style={{ padding: '0' }}>
        <Row>
          <Col style={{ paddingLeft: '0', paddingRight: '0' }}>
            <NavigationBar />
          </Col>
        </Row>
        <Row>
          <Outlet />
        </Row>
      </Container>
      <div>
        <p className="page-not-found">404 Page Not Found</p>
        <p className="supporting-text">You&apos;ve clicked on a bad link or entered an invalid URL. <br /> Go back to the previous page or navigate back to the home page.</p>
      </div>
      <div className="redirect-button">
        <ADSButton
          onClick={() => navigate('/landing')}
          buttonText="Back to Home Page"
        />
      </div>
    </Container>
  );
}

export default ErrorPage404;
