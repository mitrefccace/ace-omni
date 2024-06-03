/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col
} from 'react-bootstrap';
import { io } from 'socket.io-client';
import ADSSingleSelectDropdownBox from '../ADSSingleSelectDropdownBox';
import ADSSingleLineTextField from '../ADSSingleLineTextField';
import ADSMultiLineTextField from '../ADSMultiLineTextField';
import ADSButton from '../ADSButton';
import ADSAlert from '../ADSAlert';
import './pages.css';

function CSPCredentials() {
  const socket = io({ path: `${process.env.REACT_APP_LOCATION}/socket.io` });

  const watsonAuthenticationOptions = [
    { id: '0', value: '', label: '-- Select Type --' },
    { id: '1', value: 'bearer', label: 'Bearer Token' },
    { id: '2', value: 'iam-auth', label: 'IAM Authentication' }
  ];
  const googleType = [
    { id: '0', value: '', label: '-- Select Type --' },
    { id: '1', value: 'service_account', label: 'Service Account' }
  ];
  // const amazonAuthenticationOptions = [
  //   { id: '0', value: '', label: '-- Select Type --' },
  //   { id: '1', value: 'one', label: 'Server Account' },
  //   { id: '2', value: 'two', label: 'Credentials' },
  //   { id: '3', value: 'three', label: 'Credentials with MFA' }
  // ];

  const [watsonSttAuthenticationSelected, setWatsonSttAuthenticationType] = useState({});
  const [watsonSttKey, setWatsonSttKey] = useState('');
  const [watsonSttUrl, setWatsonSttUrl] = useState('');
  const [defaultWatsonStt, setDefaultWatsonStt] = useState(watsonAuthenticationOptions[0]);

  const [watsonTranslationAuthSelected, setWatsonTranslationAuthType] = useState({});
  const [watsonTranslationKey, setWatsonTranslationKey] = useState('');
  const [watsonTranslationUrl, setWatsonTranslationUrl] = useState('');
  const [
    defaultWatsonTranslation, setDefaultWatsonTranslation
  ] = useState(watsonAuthenticationOptions[0]);

  // const [azureId, setAzureId] = useState('');
  // const [azureUrl, setAzureUrl] = useState('');
  // const [azureLocation, setAzureLocation] = useState('');

  const [googleTypeSelected, setGoogleType] = useState({});
  const [googleProject, setGoogleProject] = useState('');
  const [googlePrivateKeyId, setGooglePrivateKeyId] = useState('');
  const [googlePrivateKey, setGooglePrivateKey] = useState('');
  const [googleClientEmail, setGoogleClientEmail] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const [googleAuthUri, setGoogleAuthUri] = useState('');
  const [googleTokenUri, setGoogleTokenUri] = useState('');
  const [googleAuthCert, setGoogleAuthCert] = useState('');
  const [googleClientCert, setGoogleClientCert] = useState('');
  const [defaultGoogleType, setdefaultGoogleType] = useState(googleType[0]);

  const [successAlert, setSuccessAlert] = useState(false);

  // const [amazonAuthenticationSelected, setAmazonAuthenticationType] = useState({});

  const updateWatsonSttAuthenticationType = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setWatsonSttAuthenticationType(value.value);
  };
  const updateWatsonSttKey = (value: any) => {
    // Update the parent component when the child component changes the text value
    setWatsonSttKey(value);
  };
  const updateWatsonSttUrl = (value: any) => {
    // Update the parent component when the child component changes the text value
    setWatsonSttUrl(value);
  };
  const updateWatsonTranslationAuthType = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setWatsonTranslationAuthType(value.value);
  };
  const updateWatsonTranslationKey = (value: any) => {
    // Update the parent component when the child component changes the text value
    setWatsonTranslationKey(value);
  };
  const updateWatsonTranslationUrl = (value: any) => {
    // Update the parent component when the child component changes the text value
    setWatsonTranslationUrl(value);
  };

  // const updateAzureId = (value: any) => {
  //   // Update the parent component when the child component changes the text value
  //   setAzureId(value);
  // };
  // const updateAzureUrl = (value: any) => {
  //   // Update the parent component when the child component changes the text value
  //   setAzureUrl(value);
  // };
  // const updateAzureLocation = (value: any) => {
  //   // Update the parent component when the child component changes the text value
  //   setAzureLocation(value);
  // };

  const updateGoogleType = (value: any) => {
    // Update the parent component when the child component changes the dropdown box value
    setGoogleType(value.value);
  };
  const updateGoogleProject = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleProject(value);
  };
  const updateGooglePrivateKeyId = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGooglePrivateKeyId(value);
  };
  const updateGooglePrivateKey = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGooglePrivateKey(value);
  };
  const updateGoogleClientEmail = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleClientEmail(value);
  };
  const updateGoogleClientId = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleClientId(value);
  };
  const updateGoogleAuthUri = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleAuthUri(value);
  };
  const updateGoogleTokenUri = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleTokenUri(value);
  };
  const updateGoogleAuthCert = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleAuthCert(value);
  };
  const updateGoogleClientCert = (value: any) => {
    // Update the parent component when the child component changes the text value
    setGoogleClientCert(value);
  };

  // const updateAmazonAuthenticationType = (value: any) => {
  //   // Update the parent component when the child component changes the dropdown box value
  //   setAmazonAuthenticationType(value);
  // };

  function logDropdownObject(obj: any) {
    if (Object.keys(obj).length > 0) {
      console.log(obj);
    }
  }

  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(watsonSttAuthenticationSelected);
  }, [watsonSttAuthenticationSelected]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(watsonTranslationAuthSelected);
  }, [watsonTranslationAuthSelected]);
  // useEffect(() => {
  //   // Example showing the selected object we get back from the dropdown box component
  //   logDropdownObject(amazonAuthenticationSelected);
  // }, [amazonAuthenticationSelected]);
  useEffect(() => {
    // Example showing the selected object we get back from the dropdown box component
    logDropdownObject(googleTypeSelected);
  }, [googleTypeSelected]);

  const setGoogleCredentials = (credentials: any) => {
    googleType.forEach((value: any, index: any) => {
      if (value.value.substring(0, 3) === credentials.type.substring(0, 3)) {
        setdefaultGoogleType(googleType[index]);
      }
    });
    setGoogleType(credentials.type);
    setGoogleProject(credentials.project_id);
    setGooglePrivateKeyId(credentials.private_key_id);
    setGooglePrivateKey(credentials.private_key);
    setGoogleClientEmail(credentials.client_email);
    setGoogleClientId(credentials.client_id);
    setGoogleAuthUri(credentials.auth_uri);
    setGoogleTokenUri(credentials.token_uri);
    setGoogleAuthCert(credentials.auth_provider_x509_cert_url);
    setGoogleClientCert(credentials.client_x509_cert_url);
  };

  const setWatsonTranslationCredentials = (credentials: any) => {
    watsonAuthenticationOptions.forEach((value: any, index: any) => {
      if (value.value.substring(0, 3) === credentials.authtype.substring(0, 3)) {
        setDefaultWatsonTranslation(watsonAuthenticationOptions[index]);
      }
    });
    setWatsonTranslationAuthType(credentials.authtype);
    setWatsonTranslationKey(credentials.apikey);
    setWatsonTranslationUrl(credentials.url);
  };

  const setWatsonSttCredentials = (credentials: any) => {
    watsonAuthenticationOptions.forEach((value: any, index: any) => {
      if (value.value.substring(0, 3) === credentials.authtype.substring(0, 3)) {
        setDefaultWatsonStt(watsonAuthenticationOptions[index]);
      }
    });
    setWatsonSttAuthenticationType(credentials.authtype);
    setWatsonSttKey(credentials.apikey);
    setWatsonSttUrl(credentials.url);
  };

  async function getGoogleCredentials() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/admin/getCredentials/google`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        const credentials = data.data;
        if (Object.values(credentials)) {
          setGoogleCredentials(credentials);
        } else {
          console.log('Insufficient Google Credentials');
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  async function getWatsonTranslationCredentials() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/admin/getCredentials/watson-translation`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        const credentials = data.data;
        if (Object.values(credentials)) {
          setWatsonTranslationCredentials(credentials);
        } else {
          console.log('Insufficient Watson Translation Credentials');
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  async function getWatsonSttCredentials() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/admin/getCredentials/watson-stt`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }).then(async (response) => {
      if (response.status === 200) {
        const data = await response.json();
        const credentials = data.data;
        if (Object.values(credentials)) {
          setWatsonSttCredentials(credentials);
        } else {
          console.log('Insufficient Watson STT Credentials');
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  // load all of the CSP things
  useEffect(() => {
    getGoogleCredentials();
    getWatsonTranslationCredentials();
    getWatsonSttCredentials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  socket.on('succesCSPCredentials', () => {
    setSuccessAlert(true);
  });

  // socket.on('failCSPCredentials', () => {
  //   console.log('failCSPCredentials');
  // });

  function saveCredentials() {
    console.log('SAVE');
    const data = {
      googleTypeSelected,
      googleProject,
      googlePrivateKeyId,
      googlePrivateKey,
      googleClientEmail,
      googleClientId,
      googleAuthUri,
      googleTokenUri,
      googleAuthCert,
      googleClientCert,
      watsonSttAuthenticationSelected,
      watsonSttKey,
      watsonSttUrl,
      watsonTranslationAuthSelected,
      watsonTranslationKey,
      watsonTranslationUrl
    };
    // console.log('saveCredentials(): ', data);
    socket.emit('updateCSPCredentials', data);
  }

  return (
    <main className="csp-main">
      <ADSAlert
        alertText="Successfully saved."
        alertType="success"
        isDismissible
        autoClose
        showAlert={successAlert}
        setShowAlert={setSuccessAlert}
        fontType="body1"
      />
      <Container>
        {/* <Row>
          <div className="h2">Amazon Accounts</div>
        </Row>
        <Row>
          <ADSSingleSelectDropdownBox
            dropdownBoxOptions={amazonAuthenticationOptions}
            setSelectedOption={updateAmazonAuthenticationType}
            formLabel="Authentication Type"
            isFormLabelHidden={false}
            helpText=""
            fieldSize="small"
            elementID="dropdownbox_amazon"
            isDisabled={false}
            dropdownName="amazonAuthentication"
          />
        </Row> */}
        {/* <Row>
          <div className="h2">Azure Account</div>
        </Row>
        <Row>
          <ADSSingleLineTextField
            formText={azureId}
            setFormText={updateAzureId}
            formLabel="Client ID"
            isFormLabelHidden={false}
            placeholderText=""
            hasDelete={false}
            fieldSize="small"
            elementID="azureId"
          />
        </Row>
        <Row>
          <ADSSingleLineTextField
            formText={azureUrl}
            setFormText={updateAzureUrl}
            formLabel="URL"
            isFormLabelHidden={false}
            placeholderText=""
            hasDelete={false}
            fieldSize="small"
            elementID="azureUrl"
          />
        </Row>
        <Row>
          <ADSSingleLineTextField
            formText={azureLocation}
            setFormText={updateAzureLocation}
            formLabel="Location"
            isFormLabelHidden={false}
            placeholderText=""
            hasDelete={false}
            fieldSize="small"
            elementID="azureLocation"
          />
        </Row> */}
        <Row>
          <div className="h2">Google Account</div>
          <Row>
            <Col sm={4}>
              <ADSSingleSelectDropdownBox
                dropdownBoxOptions={googleType}
                setSelectedOption={updateGoogleType}
                defaultSelectedOption={defaultGoogleType}
                formLabel="Type"
                isFormLabelHidden={false}
                helpText=""
                fieldSize="small"
                elementID="dropdownbox_google"
                isDisabled={false}
                dropdownName="googleType"
              />
            </Col>
            <Col sm={4}>
              <ADSSingleLineTextField
                formText={googleProject}
                setFormText={updateGoogleProject}
                formLabel="Project ID"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googleProject"
              />
            </Col>
            <Col sm={4}>
              <ADSSingleLineTextField
                formText={googlePrivateKeyId}
                setFormText={updateGooglePrivateKeyId}
                formLabel="Private Key ID"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googlePrivateKeyId"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <ADSMultiLineTextField
                formText={googlePrivateKey}
                setFormText={updateGooglePrivateKey}
                formLabel="Private Key"
                isFormLabelHidden={false}
                placeholderText=""
                isDynamic
                fieldHeight={100}
                elementID="googlePrivateKey"
              />
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <ADSSingleLineTextField
                formText={googleClientEmail}
                setFormText={updateGoogleClientEmail}
                formLabel="Client Email"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googleClientEmail"
              />
            </Col>
            <Col sm={6}>
              <ADSSingleLineTextField
                formText={googleClientId}
                setFormText={updateGoogleClientId}
                formLabel="Client ID"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googleClientId"
              />
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <ADSSingleLineTextField
                formText={googleAuthUri}
                setFormText={updateGoogleAuthUri}
                formLabel="Auth URI"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googleAuthUri"
              />
            </Col>
            <Col sm={4}>
              <ADSSingleLineTextField
                formText={googleTokenUri}
                setFormText={updateGoogleTokenUri}
                formLabel="Token URI"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googleTokenUri"
              />
            </Col>
            <Col sm={4}>
              <ADSSingleLineTextField
                formText={googleAuthCert}
                setFormText={updateGoogleAuthCert}
                formLabel="Auth Provider x509 Certificate URL"
                isFormLabelHidden={false}
                placeholderText=""
                hasDelete={false}
                fieldSize="small"
                elementID="googleAuthCert"
              />
            </Col>
          </Row>
          <Row>
            <ADSSingleLineTextField
              formText={googleClientCert}
              setFormText={updateGoogleClientCert}
              formLabel="Client x509 Certificate URL"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="googleClientCert"
            />
          </Row>
        </Row>

        <Row>
          <div className="h2">Watson Accounts</div>
          <div className="h3">Speech to Text</div>
          <Row>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={watsonAuthenticationOptions}
              setSelectedOption={updateWatsonSttAuthenticationType}
              defaultSelectedOption={defaultWatsonStt}
              formLabel="Authentication Type"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="small"
              elementID="dropdownbox_watsonstt"
              isDisabled={false}
              dropdownName="watsonSttAuthentication"
            />
          </Row>
          <Row>
            <ADSSingleLineTextField
              formText={watsonSttKey}
              setFormText={updateWatsonSttKey}
              formLabel="Key"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="watsonSttKey"
            />
          </Row>
          <Row>
            <ADSSingleLineTextField
              formText={watsonSttUrl}
              setFormText={updateWatsonSttUrl}
              formLabel="URL"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="watsonSttUrl"
            />
          </Row>
          <div className="h3">Translation</div>
          <Row>
            <ADSSingleSelectDropdownBox
              dropdownBoxOptions={watsonAuthenticationOptions}
              setSelectedOption={updateWatsonTranslationAuthType}
              defaultSelectedOption={defaultWatsonTranslation}
              formLabel="Authentication Type"
              isFormLabelHidden={false}
              helpText=""
              fieldSize="small"
              elementID="dropdownbox_watsontranslation"
              isDisabled={false}
              dropdownName="watsonTranslationAuthentication"
            />
          </Row>
          <Row>
            <ADSSingleLineTextField
              formText={watsonTranslationKey}
              setFormText={updateWatsonTranslationKey}
              formLabel="Key"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="watsonTranslationKey"
            />
          </Row>
          <Row>
            <ADSSingleLineTextField
              formText={watsonTranslationUrl}
              setFormText={updateWatsonTranslationUrl}
              formLabel="URL"
              isFormLabelHidden={false}
              placeholderText=""
              hasDelete={false}
              fieldSize="small"
              elementID="watsonTranslationUrl"
            />
          </Row>
        </Row>
        <ADSButton
          onClick={() => saveCredentials()}
          buttonText="Save Credentials"
          className="save-credentials-button"
        />
      </Container>
    </main>
  );
}

export default CSPCredentials;
