import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import { useNavigate } from 'react-router-dom';
import {
  faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons';
import ADSSingleLineTextField from '../ADSSingleLineTextField';
import ADSButton from '../ADSButton';
import ADSAlert from '../ADSAlert';
import ADSSingleSelectDropdownBox from '../ADSSingleSelectDropdownBox';
import ADSIconButton from '../ADSIconButton';
import ADSBreadcrumbs from '../ADSBreadcrumbs';

const inputChecker = require('../utils/inputs');

function CreateProfile() {
  // const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [strPword, setStrPword] = useState('');
  const [confirmStrPword, setConfirmStrPword] = useState('');
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const [displayConfirm, setDisplayConfirm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDangerAlert, setShowDangerAlert] = useState(false);

  useEffect(() => {
    // TODO Call for all roles in the system
  });

  function validatePassword() {
    if (inputChecker.isPasswordComplex(strPword)) {
      setPasswordMessage('');
      setValidPassword(true);
    } else {
      setPasswordMessage('Password format is invalid');
    }
  }

  function passwordMatch() {
    if (strPword === confirmStrPword) {
      setConfirmPassword(true);
      setConfirmMessage('');
    } else {
      setConfirmMessage('Your passwords do not match');
    }
  }

  async function saveProfile() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/users/addUser`, {
      method: 'POST',
      body: JSON.stringify(
        {
          username,
          strPword,
          role,
          firstname,
          lastname
        }
      ),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async (response: {
      ok: boolean; json: () => any; status: {
        toString: () => string;
      };
    }) => {
      if (response.ok) {
        // const data = await response.json();
        // Check different response
        if (response.status === 200) {
          // Good response.  Alert the user of success and clear fields for making another profile
          setUsername('');
          setStrPword('');
          setConfirmStrPword('');
          setFirstName('');
          setLastName('');
          setValidPassword(false);
          setConfirmPassword(false);
          setPasswordMessage('');
          setConfirmMessage('');
          setShowSuccessAlert(true);
        } else {
          const data = await response.json();
          console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
          setShowDangerAlert(true);
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
        setShowDangerAlert(true);
      }
    });
  }

  const roleOptions = [
    { id: '0', value: '', label: '-- Select --' },
    { id: '1', value: 'systemAdministrator', label: 'System Administrator' },
    { id: '2', value: 'researcher', label: 'Researcher' }
  ];

  const updateRoleDropdown = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setRole(value.value);
  };

  return (
    <Container>
      {/* <ADSButton
        onClick={() => navigate('/landing')}
        buttonText="Back to Landing"
      /> */}
      <Row>
        <Col style={{ paddingTop: '10px' }}>
          <ADSBreadcrumbs />
        </Col>
      </Row>
      <Row>
        <div className="h1 padded">
          <span>Create New User</span>
        </div>
      </Row>
      <Row style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Col sm={5}>
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
        </Col>
      </Row>
      <Row style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Col sm={5}>
          <ADSSingleLineTextField
            formText={strPword}
            setFormText={(e: any) => setStrPword(e)}
            formLabel="Password"
            isFormLabelHidden={false}
            placeholderText="Enter Password"
            helpText=""
            blurFunction={() => validatePassword()}
            password={!displayPassword}
            validationObj={{
              validateValue: strPword,
              feedbackValue: passwordMessage,
              successFeedback: false
            }}
            hasDelete={false}
            fieldSize="small"
            elementID="pWord"
          />
        </Col>
        <Col sm={1} className="iconWithInput">
          <ADSIconButton
            onClick={() => setDisplayPassword(!displayPassword)}
            variant="filled"
            height="small"
            icon={displayPassword ? faEyeSlash : faEye}
            ariaLabel="disabled filled icon"
          />
        </Col>
        <Col sm={4} className="iconWithInput">
          {passwordMessage}
        </Col>
      </Row>
      <Row style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Col sm={5}>
          <ADSSingleLineTextField
            formText={confirmStrPword}
            setFormText={(e: any) => setConfirmStrPword(e)}
            formLabel="Confirm Password"
            isFormLabelHidden={false}
            placeholderText="Confirm Password"
            helpText=""
            blurFunction={() => passwordMatch()}
            password={!displayConfirm}
            validationObj={{
              validateValue: confirmStrPword,
              feedbackValue: confirmMessage,
              successFeedback: false
            }}
            hasDelete={false}
            fieldSize="small"
            elementID="confirmPword"
          />
        </Col>
        <Col sm={1} className="iconWithInput">
          <ADSIconButton
            onClick={() => setDisplayConfirm(!displayConfirm)}
            variant="filled"
            height="small"
            icon={displayConfirm ? faEyeSlash : faEye}
            ariaLabel="disabled filled icon"
          />
        </Col>
        <Col sm={4} className="iconWithInput">
          {confirmMessage}
        </Col>
      </Row>
      <Row style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Col sm={5}>
          <ADSSingleLineTextField
            formText={firstname}
            setFormText={(e: any) => setFirstName(e)}
            formLabel="First Name"
            isFormLabelHidden={false}
            placeholderText="Enter user's first name"
            helpText=""
            hasDelete={false}
            fieldSize="small"
            elementID="firstName"
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Col sm={5}>
          <ADSSingleLineTextField
            formText={lastname}
            setFormText={(e: any) => setLastName(e)}
            formLabel="Last Name"
            isFormLabelHidden={false}
            placeholderText="Enter user's last name"
            helpText=""
            hasDelete={false}
            fieldSize="small"
            elementID="lastName"
          />
        </Col>
      </Row>
      <Row style={{ paddingTop: '8px', paddingBottom: '8px' }}>
        <Col sm={5}>
          <ADSSingleSelectDropdownBox
            dropdownBoxOptions={roleOptions}
            setSelectedOption={updateRoleDropdown}
            formLabel="Roles and Permissions"
            isFormLabelHidden={false}
            helpText=""
            fieldSize="medium"
            elementID="dropdownbox_6"
            isDisabled={false}
            dropdownName="role"
          />
        </Col>
      </Row>
      <div style={{ paddingTop: '8px' }}>
        <ADSButton
          onClick={() => saveProfile()}
          buttonText="Save User"
          disabled={
            username.length === 0 || strPword.length === 0 || confirmStrPword.length === 0
            || firstname.length === 0 || lastname.length === 0 || role === ''
            || validPassword === false || confirmPassword === false
          }
        />
      </div>

      <ADSAlert
        alertText="Error. The username or password you entered is invalid or this user already exists."
        alertType="danger"
        isDismissible
        autoClose={false}
        showAlert={showDangerAlert}
        setShowAlert={setShowDangerAlert}
        fontType="body1"
      />

      <ADSAlert
        alertText="Success.  The profile you entered has been created."
        alertType="success"
        isDismissible
        autoClose
        showAlert={showSuccessAlert}
        setShowAlert={setShowSuccessAlert}
        fontType="body1"
      />
    </Container>
  );
}

export default CreateProfile;
