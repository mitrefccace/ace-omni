import React, {
  useState, useEffect, useRef
} from 'react';
import { useImmer } from 'use-immer';
import { Col, Container, Row } from 'react-bootstrap';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import type {
  unstable_BlockerFunction as BlockerFunction
} from 'react-router-dom';
import {
  useNavigate,
  useParams,
  unstable_useBlocker as useBlocker
} from 'react-router-dom';
import ADSButton from '../../ADSButton';
import ADSAlert from '../../ADSAlert';
import ADSDialog from '../../ADSDialog';
import Step1 from './CreateExperimentPages/Step1';
import Step2 from './CreateExperimentPages/Step2';
import Step3 from './CreateExperimentPages/Step3';
import Step4 from './CreateExperimentPages/Step4';
import Step5 from './CreateExperimentPages/Step5';
import Step6 from './CreateExperimentPages/Step6';
import Step7 from './CreateExperimentPages/Step7';
import Step8 from './CreateExperimentPages/Step8';
import ADSStepper from '../../Components/ADSStepper';
import ADSBreadcrumbs from '../../ADSBreadcrumbs';
import './CreateExperiment.css';

// Default object for a brand new study (has no modules)
const studyDefault: any = require('../../Assets/JSON/StudyDefault.json');
// Default object for IPCTS module
const ipctswithasrdefault: any = require('../../Assets/JSON/IPCTSwASRdefault.json');
// Default object for VRS module
const vrsDefault: any = require('../../Assets/JSON/VRSdefault.json');
// Stepper steps
const defaultStepperPages = [
  {
    label: 'Name Your Study',
    isActive: true,
    isComplete: false
  },
  {
    label: 'Specify Study Details',
    isActive: false,
    isComplete: false
  },
  {
    label: 'Choose TRS Experience',
    isActive: false,
    isComplete: false
  },
  {
    label: 'Configure Components',
    isActive: false,
    isComplete: false
  },
  {
    label: 'Review Configurations',
    isActive: false,
    isComplete: false
  },
  {
    label: 'Define Study Sequence',
    isActive: false,
    isComplete: false
  },
  {
    label: 'Set Up Data Collection',
    isActive: false,
    isComplete: false
  },
  {
    id: '8',
    label: 'Review Study Summary',
    isActive: false,
    isComplete: false
  }
];

function deepClone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

function CreateExperiment() {
  const [studyID, setStudyID] = useState(useParams().studyID);
  const [stepPages, setStepPages] = useState(defaultStepperPages);
  const [stepIndex, setStepIndex] = useState(1);
  const [previousBtnDisabled, setPreviousBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const latestUnsavedChanges = useRef(unsavedChanges);
  const [saveAlert, setSaveAlert] = useState(false);
  const [currStudyConfig, setCurrStudyConfig] = useImmer(studyDefault);
  const navigate = useNavigate();

  // Use this when updating config and you want to set the unsavedChanges flag
  const updateCurrStudyConfig = (configUpdateFunc: Function) => {
    setCurrStudyConfig(configUpdateFunc);
    setUnsavedChanges(true);
  };

  async function loadEditStudy() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/experiment/getExperiment/${studyID}`, {
      method: 'GET',
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
        if (response.status === 200) {
          const data = await response.json();
          if (data.queryResult.length > 0) {
            setCurrStudyConfig(data.queryResult[0]);
          } else {
            navigate('/error');
          }
        } else {
          const data = await response.json();
          console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  useEffect(() => {
    if (studyID && studyID.length > 0) {
      console.log(`EDITING STUDY ${studyID}`);
      loadEditStudy();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyID]);

  const removeModuleConfiguration = (moduleIndex:number, configIndex:number) => {
    // Don't allow deleting all configs for now, as that breaks rendering
    console.log(deepClone(currStudyConfig.modules[moduleIndex].configurations));
    if (currStudyConfig.modules[moduleIndex].configurations.length > 1) {
      updateCurrStudyConfig((existingConfig: any) => {
        const currModule = existingConfig.modules[moduleIndex];
        currModule.configurations.splice(configIndex, 1);
      });
    }
  };

  const addIPCTSconfiguration = () => {
    for (let i = 0; i < currStudyConfig.modules.length; i += 1) {
      if (currStudyConfig.modules[i].type === 'IPCTS') {
        const lastConfig = currStudyConfig.modules[i].configurations.slice(-1).pop();
        const configNum = parseInt(lastConfig.name.slice(-1), 10) + 1;
        const newStudyConfig = deepClone(ipctswithasrdefault.configurations[0]);
        newStudyConfig.name = `Configuration${configNum}`;
        const part2number = configNum * 2;
        const part1number = part2number - 1;
        if (part2number > 9999) {
          console.log('Maximum extensions reached');
        } else {
          newStudyConfig.participants[0].extension = String(part1number).padStart(4, '0');
          newStudyConfig.participants[1].extension = String(part2number).padStart(4, '0');
        }
        updateCurrStudyConfig((existingConfig: any) => {
          existingConfig.modules[i].configurations.push(newStudyConfig);
        });
      }
    }
  };

  const addVRSconfiguration = () => {
    for (let i = 0; i < currStudyConfig.modules.length; i += 1) {
      if (currStudyConfig.modules[i].type === 'VRS') {
        const lastConfig = currStudyConfig.modules[i].configurations.slice(-1).pop();
        const configNum = parseInt(lastConfig.name.slice(-1), 10) + 1;
        const newStudyConfig = deepClone(vrsDefault.configurations[0]);
        newStudyConfig.name = `Configuration${configNum}`;
        const part3number = configNum * 3;
        const part2number = part3number - 1;
        const part1number = part2number - 1;
        if (part3number > 9999) {
          console.log('Maximum extensions reached');
        } else {
          newStudyConfig.participants[0].extension = String(part1number).padStart(4, '0');
          newStudyConfig.participants[1].extension = String(part2number).padStart(4, '0');
          newStudyConfig.participants[2].extension = String(part3number).padStart(4, '0');
        }
        updateCurrStudyConfig((existingConfig: any) => {
          existingConfig.modules[i].configurations.push(newStudyConfig);
        });
      }
    }
  };

  function getModuleIndex(moduleName: string, configurationJSON: any) {
    for (let i = 0; i < configurationJSON.modules.length; i += 1) {
      if (configurationJSON.modules[i].type === moduleName) {
        return i;
      }
    }
    return null;
  }

  const addStudyModule = (moduleType: string) => {
    switch (moduleType) {
      case 'IPCTS':
        // Check for if we are in edit mode.
        // If so, we dont want to manually add any more to the config
        if (!studyID) {
          updateCurrStudyConfig((conf: any) => { conf.modules.push(ipctswithasrdefault); });
        }
        break;
      case 'IP Relay with ASR':
        break;
      case 'VRS':
        if (!studyID) {
          updateCurrStudyConfig((conf: any) => { conf.modules.push(vrsDefault); });
        }
        break;
      case 'Custom':
      default:
        break;
    }
  };

  const removeStudyModule = (moduleType: string) => {
    if (!studyID) {
      updateCurrStudyConfig((existingConfig: any) => {
        if (existingConfig.modules.length > 0) {
          const moduleIndexToDelete = getModuleIndex(moduleType, existingConfig);
          if (moduleIndexToDelete != null) {
            existingConfig.modules.splice(moduleIndexToDelete, 1);
          }
        }
      });
    }
  };

  useEffect(() => {
    latestUnsavedChanges.current = unsavedChanges;
  }, [unsavedChanges]);

  // eslint-disable-next-line react-hooks/exhaustive-deps, max-len
  const shouldBlock = React.useCallback<BlockerFunction>(() => latestUnsavedChanges.current, [unsavedChanges]);

  const blocker = useBlocker(shouldBlock);

  async function saveStudy() {
    const studyToSave = deepClone(currStudyConfig);
    studyToSave.modifiedBy = sessionStorage.getItem('omniUsername');
    studyToSave.createdBy = sessionStorage.getItem('omniUsername');
    studyToSave.lastUsedBy = sessionStorage.getItem('omniUsername');
    studyToSave.alias = studyToSave.name.replace(/\s+|\W+/g, '');
    let url = '';
    let params = {};
    if (studyID) {
      url = `${process.env.REACT_APP_LOCATION}/api/experiment/updateExperiment`;
      params = { experiment: studyToSave, alias: studyID };
    } else {
      url = `${process.env.REACT_APP_LOCATION}/api/experiment/createExperiment`;
      params = { experiment: studyToSave };
      setStudyID(studyToSave.alias);
    }
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(params),
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
        // Check different response
        if (response.status === 200) {
          // Good response.  Alert the user of success and clear fields for making another profile
          setSaveAlert(true);
          setUnsavedChanges(false);
          latestUnsavedChanges.current = false;
          if (stepIndex === stepPages.length) {
            navigate('/Study');
          }
        } else {
          const data = await response.json();
          console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
        }
      } else {
        const data = await response.json();
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  function cancelStudy() {
    setUnsavedChanges(true);
    latestUnsavedChanges.current = true;
    navigate('/Study');
  }

  // Set next and previous for stepper component
  // Previous or Next button for Stepper component
  const prevNextButtonClicked = (step: string) => {
    const newStepPages = [...stepPages];

    // get active element
    const activeIndex = stepIndex - 1;
    if (step === 'next' && activeIndex <= stepPages.length) {
      newStepPages[activeIndex].isComplete = true;
      newStepPages[activeIndex].isActive = false;
      newStepPages[activeIndex + 1].isActive = true;
      setPreviousBtnDisabled(false);
      setStepIndex((currentStepIndex) => currentStepIndex + 1);
    } else if (step === 'previous' && activeIndex > 0) {
      newStepPages[activeIndex].isActive = false;
      newStepPages[activeIndex - 1].isComplete = false;
      newStepPages[activeIndex - 1].isActive = true;
      setNextBtnDisabled(false);
      // Set what step the stepper is in
      setStepIndex((currentStepIndex) => currentStepIndex - 1);
    }
    if (stepIndex === 1) {
      setPreviousBtnDisabled(true);
    } else if (stepIndex === stepPages.length) {
      setNextBtnDisabled(true);
    }
    setStepPages(newStepPages);
  };

  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    blocker.reset?.();
  };

  const handleLeave = () => {
    blocker.proceed?.();
  };

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setOpenConfirmDialog(true);
    }
  }, [blocker]);

  useEffect(() => {
    const cleanup = (event: any) => {
      // Trigger browser confirmation dialog if there are unsaved
      // changes on reload or close tab/window
      if (unsavedChanges) {
        event.preventDefault();
        // eslint-disable-next-line no-param-reassign
        event.returnValue = '';
        return '';
      }
      return true;
    };

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    };
  }, [unsavedChanges]);

  useEffect(() => {
    console.log('Component1 has mounted...');
    return () => { console.log('Component1 has unmounted...'); };
  }, []);

  return (
    <Container fluid className="createStudyContainer">
      <Row>
        <Col style={{ paddingTop: '10px' }}>
          <ADSBreadcrumbs
            isCustom
            customCrumbs={[
              { text: 'Studies', path: '/study' },
              { text: `${studyID || 'New Study'}`, path: `/${studyID}` }
            ]}
          />
          <ADSAlert
            alertText="Successfully saved."
            alertType="success"
            isDismissible
            autoClose
            showAlert={saveAlert}
            setShowAlert={setSaveAlert}
            fontType="body1"
          />
        </Col>
      </Row>
      <Row className="indentedRow" style={{ paddingTop: '16px' }}>
        <Col>
          <ADSStepper stepElements={stepPages} />
        </Col>
      </Row>
      <Row className="createStudyMainContent indentedRow">
        <Col>
          <div className="currentPageStyle">
            <span hidden={stepIndex !== 1}>
              <Step1
                currStudyConfig={currStudyConfig}
                setCurrStudyConfig={setCurrStudyConfig}
              />
            </span>
            <span hidden={stepIndex !== 2}>
              <Step2 />
            </span>
            <span hidden={stepIndex !== 3}>
              <Step3
                currStudyConfig={currStudyConfig}
                addStudyModule={addStudyModule}
                removeStudyModule={removeStudyModule}
              />
            </span>
            <span hidden={stepIndex !== 4}>
              <Step4
                currStudyConfig={currStudyConfig}
                setCurrStudyConfig={updateCurrStudyConfig}
                addIPCTSconfiguration={addIPCTSconfiguration}
                addVRSconfiguration={addVRSconfiguration}
                removeModuleConfiguration={removeModuleConfiguration}
              />
            </span>
            <span hidden={stepIndex !== 5}>
              <Step5 />
            </span>
            <span hidden={stepIndex !== 6}>
              <Step6 />
            </span>
            <span hidden={stepIndex !== 7}>
              <Step7
                currStudyConfig={currStudyConfig}
                setCurrStudyConfig={updateCurrStudyConfig}
              />
            </span>
            <span hidden={stepIndex !== 8}>
              <Step8 />
            </span>
          </div>
        </Col>
      </Row>
      <Row className="createStudyFooter indentedRow">
        <Col style={{
          justifyContent: 'right', display: 'flex', paddingTop: '16px', gap: '16px'
        }}
        >
          <ADSButton
            buttonText="Previous"
            icon={faChevronLeft}
            variant="primary"
            disabled={previousBtnDisabled}
            onClick={() => prevNextButtonClicked('previous')}
          />
          <div style={stepIndex === stepPages.length ? { display: 'none' } : { display: 'inherit' }}>
            <ADSButton
              buttonText="Next"
              icon={faChevronRight}
              iconPosition="end"
              variant="primary"
              disabled={
                (currStudyConfig.modules.length === 0 && stepIndex === 3)
                || stepIndex === stepPages.length
                || nextBtnDisabled
                || currStudyConfig.name.length === 0
              }
              onClick={() => prevNextButtonClicked('next')}
            />
          </div>
          <ADSButton
            disabled={currStudyConfig.modules.length === 0}
            variant={stepIndex === stepPages.length ? 'secondary' : 'secondary'}
            onClick={() => saveStudy()}
            buttonText={stepIndex === stepPages.length ? 'Finish & Save' : 'Save'}
          />
          <ADSButton
            variant="tertiary"
            onClick={() => cancelStudy()}
            buttonText="Cancel"
          />
        </Col>
      </Row>
      <ADSDialog
        title='Leave "Create New Study" Workflow?'
        buttons={(
          <><ADSButton onClick={handleLeave} buttonText="Yes, Leave the Workflow" />
            <ADSButton onClick={handleCloseConfirmDialog} variant="secondary" buttonText="No, Stay in the Workflow" />
          </>
        )}
        onClose={handleCloseConfirmDialog}
        open={openConfirmDialog}
        width="md"
      >
        Did you want to leave the &quot;Create New Study&quot; Workflow for your new Study?

        Your most recent save will be available as a draft on the Studies page. Before you can run
        this Study, you&apos;ll have to return to the Tool and finish the creation process.

        Any unsaved changes will be lost.
      </ADSDialog>
    </Container>
  );
}

export default CreateExperiment;
