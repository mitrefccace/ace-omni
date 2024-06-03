import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col
} from 'react-bootstrap';
import {
  faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import ADSButton from '../ADSButton';
import ADSSingleLineTextField from '../ADSSingleLineTextField';
import ADSAlert from '../ADSAlert';
import ADSIconButton from '../ADSIconButton';
// Bring back when we are ready to implement forgot password
// import ADSLink from '../Components/ADSLink';
import '../Assets/css/Login.css';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [strPword, setStrPword] = useState('');
  const [displayPword, setDisplayPword] = useState(false);
  const [showDangerAlert, setShowDangerAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Destroy session if user returns to login page.
    sessionStorage.removeItem('omniAuthenticated');
    sessionStorage.removeItem('omniUsername');
    sessionStorage.removeItem('omniRole');
    sessionStorage.removeItem('NavigationRailPanelId');
  }, []);

  async function performLogin() {
    const response = await fetch(`${process.env.REACT_APP_LOCATION}/api/users/login`, {
      method: 'POST',
      body: JSON.stringify({ username, strPword }),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`DATA ${JSON.stringify(data)}`);
      if (data.status === 'Success') {
        sessionStorage.setItem('omniAuthenticated', 'true');
        sessionStorage.setItem('omniUsername', username);
        sessionStorage.setItem('omniRole', data.role);
        navigate('/landing');
      } else {
        setErrorMessage('Invalid username and/or password.');
        setShowDangerAlert(true);
      }
    } else {
      setErrorMessage('Server Error: Please check your connection.');
    }
  }

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        performLogin();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username, strPword]);

  // Use these lines for the password reset when ready again
  /*
    <div style={{ paddingTop: '5px' }}>
      <ADSLink
        url="/login"
        linkText="Forgot Password?"
        fontType="body1"
        isExternal={false}
        isNavigational
      />
    </div>
  */

  return (
    <main className="login-parent-container">
      <Container className="d-flex justify-content-center login-container">
        <div className="configurationLightGrayBoxLogin">
          <Col>
            <div className="h2" style={{ textAlign: 'center', padding: '16px' }}><b>ACE Omni Login</b></div>
            <Row className="loginRow" style={{ margin: 'auto' }}>
              <ADSSingleLineTextField
                formText={username}
                setFormText={(e: any) => setUsername(e)}
                formLabel="Username"
                isFormLabelHidden={false}
                placeholderText="Enter Username"
                helpText=""
                hasDelete={false}
                fieldSize="small"
                elementID="username"
              />
            </Row>
            <Row className="loginRowPassword">
              <Col sm={8}>
                <ADSSingleLineTextField
                  formText={strPword}
                  setFormText={(e: any) => setStrPword(e)}
                  formLabel="Password"
                  isFormLabelHidden={false}
                  placeholderText="Enter Password"
                  helpText=""
                  hasDelete={false}
                  fieldSize="small"
                  elementID="strPword"
                  password={!displayPword}
                />
              </Col>
              <Col sm={2} className="iconWithInput">
                <ADSIconButton
                  onClick={() => setDisplayPword(!displayPword)}
                  variant="filled"
                  height="small"
                  icon={displayPword ? faEyeSlash : faEye}
                  ariaLabel="disabled filled icon"
                />
              </Col>
            </Row>
            <Row className="centerButton" style={{ margin: 'auto' }}>
              <ADSButton
                onClick={() => performLogin()}
                buttonText="Login"
                height="medium"
                disabled={username.length <= 1 && strPword.length <= 1}
              />
            </Row>
          </Col>
        </div>
      </Container>

      <ADSAlert
        alertText={errorMessage}
        alertType="danger"
        isDismissible
        autoClose={false}
        showAlert={showDangerAlert}
        setShowAlert={setShowDangerAlert}
        fontType="body1"
      />
    </main>
  );
}

export default Login;
