/* eslint-disable no-trailing-spaces */
/* eslint-disable max-len */
import React, {
  useState,
  useEffect
} from 'react';
import {
  Col, Container, Row, Button
} from 'react-bootstrap';
import { Updater } from 'use-immer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTrash } from '@fortawesome/free-solid-svg-icons';
import ADSTreeView from '../../../Components/ADSTreeView';
import ASRengine from '../../../Components/StudyCreation/ASRengine';
import AudioDistortion from '../../../Components/StudyCreation/AudioDistortion';
import AudioFilter from '../../../Components/StudyCreation/AudioFilter';
import Captions from '../../../Components/StudyCreation/Captions';
import LockSetting from '../../../Components/StudyCreation/LockSetting';
import Chat from '../../../Components/StudyCreation/Chat';
import IncomingAudio from '../../../Components/StudyCreation/IncomingAudio';
import '../../../Assets/css/UI2LockSetting.css';
import ADSLink from '../../../Components/ADSLink';
import ADSIconButton from '../../../ADSIconButton';
import VRSVideoQuality from '../../../Components/StudyCreation/VRSVideoQuality';

const ipctsJSON: any = require('../../../Assets/JSON/IPCTSconfig.json'); // IP CTS config JSON used to populate arrow tree
const vrsJSON: any = require('../../../Assets/JSON/VRSconfig.json');

function Step4(props: {
  currStudyConfig: any,
  setCurrStudyConfig: Updater<any>,
  addIPCTSconfiguration: () => void,
  addVRSconfiguration: () => void,
  removeModuleConfiguration: (moduleIndex:number, configIndex:number) => void
}) {
  const {
    currStudyConfig, setCurrStudyConfig,
    addIPCTSconfiguration, addVRSconfiguration, removeModuleConfiguration
  } = props;
  const defaultSelectMessage = 'To configure properties of this module, select options in the Configurations panel';
  // Used to change the configuration being shown based on the arrow tree element that was clicked
  const [currModuleIndex, setCurrModuleIndex] = useState(0);
  const [currConfigurationIndex, setCurrConfigurationIndex] = useState(0);
  const [currParticipantIndex, setCurrParticipantIndex] = useState(0);
  const [selectedSection, setSelectedSection] = useState(defaultSelectMessage);
  const [IPCTSarrowTree, setIPCTSArrowTree] = useState<any>([]);
  const [VRSarrowTree, setVRSArrowTree] = useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [nodeConfig, setNodeHeirarchy] = useState('');

  const getModuleIndex = (moduleName: string, studyConfig: any) => {
    if (!studyConfig || !studyConfig.modules) {
      return 0;
    }
    for (let i = 0; i < studyConfig.modules.length; i += 1) {
      if (studyConfig.modules[i].type === moduleName) {
        return i;
      }
    }
    return 0;
  };

  const getConfigurationIndex = (configurationName: string, moduleConfig: any) => {
    if (!moduleConfig || !moduleConfig.configurations) {
      return 0;
    }
    for (let i = 0; i < moduleConfig.configurations.length; i += 1) {
      if (moduleConfig.configurations[i].name === configurationName) {
        return i;
      }
    }
    return 0;
  };

  const getParticipantIndex = (participantName: string, configuration: any) => {
    if (!configuration || !configuration.participants) {
      return 0;
    }
    for (let i = 0; i < configuration.participants.length; i += 1) {
      if (configuration.participants[i].name === participantName) {
        return i;
      }
    }
    return 0;
  };

  const setSelectedTreeItem = (
    moduleName:string,
    configName:string,
    participantName:string,
    sectionName:string
  ) => {
    if (moduleName) {
      setCurrModuleIndex(getModuleIndex(moduleName, currStudyConfig));
    }
    if (configName) {
      setCurrConfigurationIndex(
        getConfigurationIndex(configName, currStudyConfig.modules[currModuleIndex])
      );
    }
    if (participantName) {
      setCurrParticipantIndex(
        getParticipantIndex(
          participantName,
          currStudyConfig.modules[currModuleIndex].configurations[currConfigurationIndex]
        )
      );
    }
    setSelectedSection(sectionName);
  };

  const removeConfiguration = (moduleIndex:number, configIndex:number) => {
    const confirmMsg = `Delete ${currStudyConfig.modules[moduleIndex].type} ${currStudyConfig.modules[moduleIndex].configurations[configIndex].name} ? This cannot be undone.`;
    // eslint-disable-next-line no-alert
    if (window.confirm(confirmMsg)) {
      // Before we remove a config, we need to select a different config in the tree
      // Otherwise, components will try to display the deleted config and crash
      setSelectedTreeItem('', 'Configuration1', 'Participant1', defaultSelectMessage);
      removeModuleConfiguration(moduleIndex, configIndex);
    }
    return false;
  };

  const treeOnClick = (item: any, clickEvent:any) => {
    // If click was on a button tag or path tag, it was a delete config click, don't do anything
    const clickedTag = clickEvent.event.originalEvent.originalEvent.target.tagName;
    if (clickedTag === 'path' || clickedTag === 'BUTTON') {
      return;
    }
    // If click was on collapsable item, collapse but don't change anything
    if (item.collapsable) {
      if (item.expanded) {
        clickEvent.component.collapseItem(item.ID);
      } else {
        clickEvent.component.expandItem(item.ID);
      }
      return;
    }
    setSelectedTreeItem(item.moduleName, item.configName, item.participantName, item.name);

    const fullStringNodePath : any[] = [];
    let parentNode = clickEvent.node.parent;
    while (parentNode !== null) {
      fullStringNodePath.unshift(parentNode.text);
      parentNode = parentNode.parent;
    }
    // console.log(clickEvent.node);
    setNodeHeirarchy(fullStringNodePath.join('/'));
  };

  const sideBarOpen = () => {
    setIsSidebarOpen(!isSidebarOpen);
    // remove the focus state from the button
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Custom item so we can have a delete button on Configurations
  const renderTreeItem = (item: any) => {
    if (item.showDelete) {
      return (
        <div>
          <span style={{ paddingRight: '20px' }}>{item.name}</span>
          <ADSIconButton
            onClick={() => removeConfiguration(item.moduleIndex, item.configIndex)}
            variant="standard"
            height="small"
            size="xs"
            icon={faTrash}
            alignOption="right-end"
            ariaLabel="delete configuration"
          />
        </div>
      );
    }
    return (
      <span>{item.name}</span>
    );
  };

  const updateMultipleArrowDropdown = () => {
    let ipctsModuleExists = false;
    let vrsModuleExists = false;
    for (let i = 0; i < currStudyConfig.modules.length; i += 1) {
      // This is the overall config that will become the arrow dropdown
      const newArrowConfig: any[] = [];
      const thisModule = currStudyConfig.modules[i];
      const expandedConfigIndex = thisModule.configurations.length - 1;
      let configCount = 0;
      for (let j = 0; j < thisModule.configurations.length; j += 1) {
        const thisConfig = thisModule.configurations[j];
        const theseParticipants = thisConfig.participants;
        configCount += 1;
        let sectionsToAdd;
        if (thisModule.type === 'IPCTS') {
          sectionsToAdd = JSON.parse(JSON.stringify(ipctsJSON));
          ipctsModuleExists = true;
        } else if (thisModule.type === 'VRS') {
          sectionsToAdd = JSON.parse(JSON.stringify(vrsJSON));
          vrsModuleExists = true;
        }
        // The first section is the Module section, which we only want added once
        if (j > 0) {
          sectionsToAdd.shift();
        }
        for (let k = 0; k < sectionsToAdd.length; k += 1) {
          const newSection = sectionsToAdd[k];
          newSection.ID = newSection.ID.replace(newSection.ID.charAt(0), configCount);
          if (newSection.name.includes('Configuration')) {
            newSection.name = thisConfig.name;
            newSection.expanded = j === expandedConfigIndex;
            newSection.configIndex = configCount - 1;
            newSection.moduleIndex = i;
            newSection.showDelete = thisModule.configurations.length > 1;
          } else if (newSection.name.includes('Participant 1:')) {
            // Notice here and below, if participants aren't in order we have a problem
            newSection.name = `Participant 1: Extension ${theseParticipants[0].extension}`;
          } else if (newSection.name.includes('Participant 2:')) {
            newSection.name = `Participant 2: Extension ${theseParticipants[1].extension}`;
          } else if (newSection.name.includes('Participant 3:')) {
            newSection.name = `Participant 3: Extension ${theseParticipants[2].extension}`;
          }
          if (newSection.configName) {
            newSection.configName = `Configuration${configCount}`;
          }
          // Dont change the parent for the first section since its all under the 'Module' section
          if (newSection.parentId && k > 0) {
            newSection.parentId = `${configCount}${newSection.parentId.substring(1)}`;
          }
        }
        newArrowConfig.push(...sectionsToAdd);
        if (thisModule.type === 'IPCTS' && newArrowConfig.length !== IPCTSarrowTree.length) {
          setIPCTSArrowTree(newArrowConfig);
        }
        if (thisModule.type === 'VRS' && newArrowConfig.length !== VRSarrowTree.length) {
          setVRSArrowTree(newArrowConfig);
        }
      }
    }
    // If we didn't see a module but it has an arrow tree already, it was deleted
    if (!vrsModuleExists && VRSarrowTree.length > 0) {
      setVRSArrowTree([]);
    }
    if (!ipctsModuleExists && IPCTSarrowTree.length > 0) {
      setIPCTSArrowTree([]);
    }
  };

  useEffect(() => {
    updateMultipleArrowDropdown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currStudyConfig, setCurrStudyConfig]);

  return (
    <Container
      no-gutters="true"
      fluid
    >
      <Row style={{ paddingBottom: '20px' }}>
        <Col className="body2">
          <span style={{ padding: '0' }}>
            <b>Step 4</b> of 8: For each module in your research study, select the
            components and elements you wish to include and configure their associated properties,
            if applicable. (Components and their configurations may be modified later on, if
            desired.) You may add additional configurations for a module by selecting
            &quot;Add configuration&quot; for the related module in the menu.
          </span>
        </Col>
      </Row>
      <Row>
        <Col
          xs
          lg="4"
          style={isSidebarOpen
            ? {
              border: '1px solid var(--ADS_Grayscale_30)',
              width: 'auto',
              padding: '5px 0 0 0',
              maxHeight: '576px',
              overflowY: 'auto'
            }
            : {
              border: '1px solid var(--ADS_Grayscale_30)',
              width: 'auto',
              padding: '5px 5px 5px 0',
              maxHeight: '576px',
              overflowY: 'auto'
            }}
        >
          <Button
            onClick={sideBarOpen}
            variant="tertiary"
            style={isSidebarOpen ? { padding: '0 ' } : {}}
          >
            <FontAwesomeIcon style={{ height: '16px', width: '16px' }} icon={faBars} />
            <span
              style={{
                paddingLeft: '10px',
                color: 'var(--ADS_Black)',
                fontWeight: 'bold'
              }}
            >
              Configurations
            </span>
          </Button>
          <span hidden={!isSidebarOpen}>
            {IPCTSarrowTree.length > 0
              ? (
                <span>
                  <ADSTreeView
                    treeData={IPCTSarrowTree}
                    renderItem={renderTreeItem}
                    branchClicked={treeOnClick}
                  />
                  <span style={{ paddingLeft: '41px' }}>
                    <ADSLink
                      url=""
                      fontType="body1"
                      linkText="Add IPCTS Configuration"
                      isExternal={false}
                      isNavigational={false}
                      onClickFunction={addIPCTSconfiguration}
                    />
                  </span>
                </span>
              )
              : (
                <span />
              )}
            {VRSarrowTree.length > 0
              ? (
                <span>
                  <ADSTreeView
                    treeData={VRSarrowTree}
                    renderItem={renderTreeItem}
                    branchClicked={treeOnClick}
                  />
                  <span style={{ paddingLeft: '41px' }}>
                    <ADSLink
                      url=""
                      fontType="body1"
                      linkText="Add VRS Configuration"
                      isExternal={false}
                      isNavigational={false}
                      onClickFunction={addVRSconfiguration}
                    />
                  </span>
                </span>
              )
              : (
                <span />
              )}
          </span>
        </Col>
        <Col style={{ paddingLeft: '15px' }}>
          {selectedSection === defaultSelectMessage
            ? (
              <div
                className="body1"
              >
                <i>{selectedSection}</i>
              </div>
            )
            : (
              <div>
                <span className="body1">{nodeConfig}/ </span> 
                <br />
                <span className="h3">{selectedSection}</span>
              </div>
            )}
          {selectedSection === 'ASR 1' && (
            <ASRengine
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {selectedSection === 'Captions' && (
            <Captions
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {selectedSection === 'Chat' && (
            <Chat
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {selectedSection === 'Incoming Audio' && (
            <IncomingAudio
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {selectedSection === 'Lock Settings' && (
            <LockSetting
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {selectedSection === 'Video Quality' && (
            <VRSVideoQuality
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {selectedSection === 'Distortion and Corruption' && (
            <AudioDistortion
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
          {(selectedSection === 'Audio Filters' || selectedSection === 'Audio Controls/Filters') && (
            <AudioFilter
              key={`${currModuleIndex}_${currConfigurationIndex}_${currParticipantIndex}_${selectedSection}`}
              moduleIndex={currModuleIndex}
              configurationIndex={currConfigurationIndex}
              participantIndex={currParticipantIndex}
              currStudyConfig={currStudyConfig}
              setCurrStudyConfig={setCurrStudyConfig}
            />
          )}
        </Col>
        <Col style={{ paddingLeft: '15px' }} hidden={IPCTSarrowTree.length === 0}>
          <img
            src={`${process.env.REACT_APP_LOCATION}/IPCTS_infrastructure_explained.jpeg`}
            alt="Diagram Explaining Audio Streams"
            style={{
              display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '90%'
            }}
          />
        </Col>
        <Col style={{ paddingLeft: '15px' }} hidden={VRSarrowTree.length === 0}>
          <img
            src={`${process.env.REACT_APP_LOCATION}/VRS_Diagram.jpeg`}
            alt="Diagram Explaining VRS Streams"
            style={{
              display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '90%'
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Step4;
