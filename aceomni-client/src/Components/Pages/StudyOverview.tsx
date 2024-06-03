import React, { useState, useEffect, useRef } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Accordion from 'react-bootstrap/Accordion';
import {
  faCircleQuestion, faDownload, faQrcode
} from '@fortawesome/free-solid-svg-icons';
import ADSFullWidthDivider from '../ADSFullWidthDivider';
import ADSDataTable from '../ADSDataTable';
import ADSButton from '../ADSButton';
import ADSIconButton from '../ADSIconButton';
import ADSAccordion from '../ADSAccordion';
import ADSLink from '../Components/ADSLink';
import ADSSidebarMenu from '../Components/ADSSidebarMenu';
import ADSCheckbox from '../ADSCheckbox';
import ADSTooltip from '../ADSTooltip';
import ADSBreadcrumbs from '../ADSBreadcrumbs';
import ADSPopover from '../ADSPopover';

import '../Assets/css/StudyOverview.css';

function StudyOverview() {
  const { studyID } = useParams();
  const [studyData, setStudyData] = useState({
    _id: '',
    name: '',
    phase: '',
    alias: '',
    description: '',
    purpose: '',
    createdBy: '',
    modifiedBy: '',
    lastUsedBy: '',
    modules: []
  }) as any;

  const [callData, setCallData] = useState([]) as any;
  const navigate = useNavigate();

  // Refs for sidebar
  const studyBasicRef = useRef();
  const moduleConfigRef = useRef();
  const dataCollectionRef = useRef();
  const studyDataRef = useRef();
  const sidebarMenuItems = [
    {
      id: 'study-basics', label: 'Overview'
    },
    {
      id: 'module-configuration', label: 'Modules'
    },
    {
      id: 'data-collection', label: 'Module Data Elements'
    },
    {
      id: 'study-data', label: 'Collected Data'
    }
  ];

  async function getStudyInfo() {
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
            setStudyData(data.queryResult[0]);
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

  async function getCallInfo() {
    await fetch(`${process.env.REACT_APP_LOCATION}/api/call/getCalls/${studyData._id}`, {
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
      const data = await response.json();
      if (response.ok) {
        const calls = data.queryResult;
        for (let i = 0; i < calls.length; i += 1) {
          calls[i].label = i + 1;
        }
        setCallData(calls);
      } else {
        console.log(`ERROR RESPONSE: ${JSON.stringify(data)}`);
      }
    });
  }

  useEffect(() => {
    if (studyID) {
      getStudyInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyID]);

  useEffect(() => {
    if (studyData._id) {
      getCallInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyData]);

  const [captionSelection, setCaptionsRowsSelected] = useState('');
  const [audioRecs, setAudioRecsRowsSelected] = useState('');
  const [screenRecs, setScreenRecsRowsSelected] = useState('');
  const [videoRecs, setVideoRecsRowsSelected] = useState('');
  const [otherRecs, setOtherRowsSelected] = useState('');

  const handleCaptionsRowSelected = (value: any) => {
    setCaptionsRowsSelected(value);
    console.log(captionSelection);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleAudioRecsRowSelected = (value: any) => {
    setAudioRecsRowsSelected(value);
    console.log(audioRecs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleScreenRecsRowSelected = (value: any) => {
    setScreenRecsRowsSelected(value);
    console.log(screenRecs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleVideoRecsRowSelected = (value: any) => {
    setVideoRecsRowsSelected(value);
    console.log(videoRecs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleOtherRowSelected = (value: any) => {
    setOtherRowsSelected(value);
    console.log(otherRecs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const tooltipIcon = (tooltipText: string) => (
    <ADSTooltip placement="right" content={tooltipText}>
      <FontAwesomeIcon
        icon={faCircleQuestion}
        style={{ marginLeft: '15px' }}
      />
    </ADSTooltip>
  );

  const moduleHeader = (study: any, moduleIndex: number, showParticipantLink: boolean) => {
    const moduleData = study.modules[moduleIndex];
    let tooltipText = 'A Study Module';
    if (moduleData.type.includes('IPCTS')) {
      tooltipText = 'Refers to a single module for a TRS experience that is based upon IP CTS with ASR.  Each module is made of multiple components, each of which can be configured for a research study.';
    }
    return (
      <Row>
        <div className="h6">{moduleData.type === 'IPCTS' ? 'IPCTS with ASR' : moduleData.type} {tooltipIcon(tooltipText)}</div>
        <Row className="top-padded bottom-padded" hidden={!moduleData.type.includes('IPCTS')}>
          <ADSLink
            url={`${process.env.REACT_APP_LOCATION}/InfrastructureDiagramOnly.jpeg`}
            linkText="View Module Diagram"
            fontType="body1"
            isExternal
            isNavigational
          />
        </Row>
        <Row className="bottom-padded" hidden={!showParticipantLink}>
          <span className="particip-url-span">
            URL for Participant Clients:&nbsp;<ADSLink
              url={`${process.env.REACT_APP_LOCATION}/Experiment/${moduleData.type}/${study.alias}/`}
              linkText="external link"
              fontType="body1"
              isExternal
              isNavigational
            />
            &nbsp;
            &nbsp;
            &nbsp;
            <ADSPopover
              placement="top"
              trigger={(
                <ADSIconButton
                  ariaLabel="QR Code"
                  icon={faQrcode}
                  onClick={() => { }}
                />
              )}
            >
              <QRCode
                size={256}
                level="L"
                style={{ height: 'auto', maxWidth: '100px', width: '100px' }}
                value={`${window.location.origin}${process.env.REACT_APP_LOCATION}/Experiment/${moduleData.type}/${study.alias}/`}
                viewBox="0 0 60 60"
              />
            </ADSPopover>
          </span>
        </Row>
      </Row>
    );
  };

  const configTable = (study: any, moduleData: any) => {
    let moduleConfigTableCols = [
      {
        name: 'Configurations',
        selector: (row: any) => row.name,
        sortable: true
      },
      {
        name: 'Participant 1 Extension',
        selector: (row: any) => row.participants[0].extension,
        sortable: true
      },
      {
        name: 'Participant 2 Extension',
        selector: (row: any) => row.participants[1].extension,
        sortable: true
      }
    ];

    if (moduleData.type.includes('VRS')) {
      moduleConfigTableCols = [
        {
          name: 'Configurations',
          selector: (row: any) => row.name,
          sortable: true
        },
        {
          name: 'Participant 1 Extension',
          selector: (row: any) => row.participants[0].extension,
          sortable: true
        },
        {
          name: 'Participant 2 Extension',
          selector: (row: any) => row.participants[1].extension,
          sortable: true
        },
        {
          name: 'Participant 3 Extension',
          selector: (row: any) => row.participants[2].extension,
          sortable: true
        }
      ];
    }

    return (
      <Row className="top-padded">
        <ADSDataTable
          title=""
          columns={moduleConfigTableCols}
          data={moduleData.configurations}
          onSelectedRowsChange={() => true}
          clearSelectedRows={false}
          pagination
          searchEnabled={false}
        />
      </Row>
    );
  };

  const handleRowPreSelected = (row: any) => {
    const preSelected = [] as any;
    const rowData = Object.values(studyData.modules[0].dataCollection);
    const nestedRowData = Array.from(rowData) as any;
    nestedRowData.forEach((key: any) => {
      const innerKeys = Object.keys(key);
      const innerValues = Object.values(key);
      Object.entries(key).forEach((_item, i) => {
        if (innerValues[i] === true) {
          preSelected.push(innerKeys[i]);
        }
      });
    });
    return preSelected.includes(row.id);
  };

  const handleDisabledRows = (row: any) => row.id.length >= 0;

  const dataCollectionTables = (moduleData: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const modData = moduleData; // ??
    const dataCollectionTableCols = [
      {
        name: 'Data Label',
        selector: (row: any) => row.label,
        sortable: false
      },
      {
        name: 'Data Description',
        selector: (row: any) => row.description,
        sortable: false
      }
    ];

    if (moduleData.type.includes('VRS')) {
      return (
        <Row className="bottom-left-padded">
          <ADSAccordion defaultActiveKeys={['1', '2', '3', '4']}>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Video Recordings {tooltipIcon('A digital recording of both visual and audible components. ')}
              </Accordion.Header>
              <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
                <ADSDataTable
                  data={[
                    {
                      id: 'Video1',
                      label: 'Video 1',
                      description: 'A computer camera video recording of Participant 3, allowing researchers to observe participant gaze and reactions.'
                    },
                    {
                      id: 'Video2',
                      label: 'Video 2',
                      description: 'A computer camera video recording of Participant 2, allowing researchers to observe participant gaze and reactions.'
                    }
                  ]}
                  columns={dataCollectionTableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={() => handleVideoRecsRowSelected}
                  selectableRowDisabled={handleDisabledRows}
                  selectableRowSelected={handleRowPreSelected}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Audio Recordings {tooltipIcon('Sound information that is captured onto a storage medium.')}
              </Accordion.Header>
              <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
                <ADSDataTable
                  data={[
                    {
                      id: 'AudioStream1',
                      label: 'Audio Stream 1',
                      description: 'An audio recording of Audio Stream 1 (As sent by Participant 1 and received by Participant 3).'
                    },
                    {
                      id: 'AudioStream2',
                      label: 'Audio Stream 2',
                      description: 'An audio recording of Audio Stream 2 (As sent by Participant 3 and received by Participant 1).'
                    }
                  ]}
                  columns={dataCollectionTableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={() => handleAudioRecsRowSelected}
                  selectableRowDisabled={handleDisabledRows}
                  selectableRowSelected={handleRowPreSelected}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Screen Recordings {tooltipIcon('A digital recording of computer screen output, also known as a video screen capture or a screen recording; can be synched with audio recordings.')}
              </Accordion.Header>
              <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
                <ADSDataTable
                  data={[
                    {
                      id: 'UserInterface1',
                      label: 'User Interface 1',
                      description: 'A computer screen recording of UI 1, allowing researchers to observe stimuli as they appear to Participant 1.'
                    },
                    {
                      id: 'UserInterface2',
                      label: 'User Interface 2',
                      description: 'A computer screen recording of UI 2, allowing researchers to observe stimuli as they appear to Participant 2.'
                    },
                    {
                      id: 'UserInterface3',
                      label: 'User Interface 3',
                      description: 'A computer screen recording of UI 3, allowing researchers to observe stimuli as they appear to Participant 3.'
                    }
                  ]}
                  columns={dataCollectionTableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={() => handleScreenRecsRowSelected}
                  selectableRowDisabled={handleDisabledRows}
                  selectableRowSelected={handleRowPreSelected}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Other Data {tooltipIcon('Additional data not already captured by other data collection methods; can include raw data from a source.')}</Accordion.Header>
              <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
                <ADSDataTable
                  data={[
                    {
                      id: 'Rawdata',
                      label: 'Raw Data',
                      description: 'A large set of supporting data provided by the selected systems.'
                    }
                  ]}
                  columns={dataCollectionTableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={() => handleOtherRowSelected}
                  selectableRowDisabled={handleDisabledRows}
                  selectableRowSelected={handleRowPreSelected}
                />
              </Accordion.Body>
            </Accordion.Item>
          </ADSAccordion>
        </Row>
      );
    }

    return (
      <Row className="bottom-left-padded">
        <ADSAccordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>Captions {tooltipIcon('Refers to any text representation of words and other important audio information that is transcribed. ')}
            </Accordion.Header>
            <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
              <ADSDataTable
                data={[
                  {
                    id: 'ASRcaptionStream',
                    label: 'Captions from ASR Engine',
                    description: 'The finalized ASR Caption Stream as displayed to a participant, including timestamps and speaker/recipient labels.'
                  },
                  {
                    id: 'TranslationEngine',
                    label: 'Captions from Translation Engine',
                    description: 'The captions from the Translation Engine in both input and output languages (and including language labels and codes).'
                  }
                ]}
                columns={dataCollectionTableCols}
                selectableRows
                searchEnabled={false}
                onSelectedRowsChange={() => handleCaptionsRowSelected}
                selectableRowSelected={handleRowPreSelected}
                selectableRowDisabled={handleDisabledRows}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Video Recordings {tooltipIcon('A digital recording of both visual and audible components. ')}
            </Accordion.Header>
            <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
              <ADSDataTable
                data={[
                  {
                    id: 'Video1',
                    label: 'Video 1',
                    description: 'A computer camera video recording of Participant 1, allowing researchers to observe participant gaze and reactions.'
                  },
                  {
                    id: 'Video2',
                    label: 'Video 2',
                    description: 'A computer camera video recording of Participant 2, allowing researchers to observe participant gaze and reactions.'
                  }
                ]}
                columns={dataCollectionTableCols}
                selectableRows
                searchEnabled={false}
                onSelectedRowsChange={() => handleVideoRecsRowSelected}
                selectableRowDisabled={handleDisabledRows}
                selectableRowSelected={handleRowPreSelected}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Audio Recordings {tooltipIcon('Sound information that is captured onto a storage medium.')}
            </Accordion.Header>
            <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
              <ADSDataTable
                data={[
                  {
                    id: 'AudioStream1',
                    label: 'Audio Stream 1',
                    description: 'An audio recording of Audio Stream 1 (As sent by Participant 1 and received by Participant 2).'
                  },
                  {
                    id: 'AudioStream2',
                    label: 'Audio Stream 2',
                    description: 'An audio recording of Audio Stream 2 (As sent by Participant 2 and received by Participant 1).'
                  }
                ]}
                columns={dataCollectionTableCols}
                selectableRows
                searchEnabled={false}
                onSelectedRowsChange={() => handleAudioRecsRowSelected}
                selectableRowDisabled={handleDisabledRows}
                selectableRowSelected={handleRowPreSelected}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Screen Recordings {tooltipIcon('A digital recording of computer screen output, also known as a video screen capture or a screen recording; can be synched with audio recordings.')}
            </Accordion.Header>
            <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
              <ADSDataTable
                data={[
                  {
                    id: 'UserInterface1',
                    label: 'User Interface 1',
                    description: 'A computer screen recording of UI 1, allowing researchers to observe stimuli as they appear to Participant 1.'
                  },
                  {
                    id: 'UserInterface2',
                    label: 'User Interface 2',
                    description: 'A computer screen recording of UI 2, allowing researchers to observe stimuli as they appear to Participant 2.'
                  }
                ]}
                columns={dataCollectionTableCols}
                selectableRows
                searchEnabled={false}
                onSelectedRowsChange={() => handleScreenRecsRowSelected}
                selectableRowDisabled={handleDisabledRows}
                selectableRowSelected={handleRowPreSelected}
              />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="4">
            <Accordion.Header>Other Data {tooltipIcon('Additional data not already captured by other data collection methods; can include raw data from a source.')}</Accordion.Header>
            <Accordion.Body className="zero-pad" style={{ padding: 0 }}>
              <ADSDataTable
                data={[
                  {
                    id: 'ASRrawdata',
                    label: 'ASR Raw Data',
                    description: 'A large set of supporting data provided by the selected ASR Engine. Different ASR Engines provide different types of raw data.'
                  }
                ]}
                columns={dataCollectionTableCols}
                selectableRows
                searchEnabled={false}
                onSelectedRowsChange={() => handleOtherRowSelected}
                selectableRowDisabled={handleDisabledRows}
                selectableRowSelected={handleRowPreSelected}
              />
            </Accordion.Body>
          </Accordion.Item>
        </ADSAccordion>
      </Row>
    );
  };

  const downloadFile = (call: any, fileType: string, fileId: string) => {
    window.location.href = `${process.env.REACT_APP_LOCATION}/api/call/getFile/${call._id}/${fileType}/${fileId}`;
  };

  const downloadCallFiles = () => {
    const callCheckboxes = document.getElementById('call-data-table')?.getElementsByClassName('form-check-input');
    if (!callCheckboxes) {
      return;
    }
    const callIds: string[] = [];
    for (let i = 0; i < callCheckboxes.length; i += 1) {
      if ((callCheckboxes[i] as HTMLInputElement).checked) {
        callIds.push(callCheckboxes[i].id.replace('call-', ''));
      }
    }
    if (callIds.length > 0) {
      window.location.href = `${process.env.REACT_APP_LOCATION}/api/call/getCallFiles/${callIds.join(',')}`;
    }
  };

  const getDateOnly = (dateTime: string) => {
    const localDate = new Date(dateTime);
    return `${localDate.getMonth() + 1}-${localDate.getDate()}-${localDate.getFullYear().toString().slice(2, 4)}`;
  };

  const getTimeOnly = (dateTime: string) => {
    const localDate = new Date(dateTime);
    return localDate.toLocaleTimeString('en-US');
  };

  const secondsToMinutes = (seconds: number) => {
    const remainder = seconds % 60;
    const minutes = (seconds - remainder) / 60;
    const separator = remainder >= 10 ? ':' : ':0';
    return minutes + separator + remainder;
  };

  const findEntry = (data: any, field: string, value: string) => {
    if (data && data instanceof Array) {
      return data.find((e) => e[field] === value);
    }
    return null;
  };

  // Hard coding these fields for now, need to make this dynamic based on what data is available
  const callDataRowExpanded = ({ data }: any) => (
    <div className="expand-row-container top-padded">
      <Col className="expand-row-col">
        {data.module.type === 'IPCTS'
          ? (
            <>
              <Row className="expand-header">Captions:</Row>
              <ADSFullWidthDivider />
              <Row>
                <Col className="top-padded">Captions from ASR Engine</Col>
                <Col className="expand-download">
                  <ADSButton
                    onClick={() => downloadFile(data, 'transcripts', findEntry(data.transcripts, 'type', 'AsrStream')?._id)}
                    buttonText="Download"
                    variant="secondary"
                    height="medium"
                    icon={faDownload}
                    disabled={!findEntry(data.transcripts, 'type', 'AsrStream')?._id}
                  />
                </Col>
              </Row>
              <Row>
                <Col className="top-padded">Captions from Translation Engine</Col>
                <Col className="expand-download">
                  <ADSButton
                    onClick={() => downloadFile(data, 'transcripts', findEntry(data.transcripts, 'type', 'translateStream')?._id)}
                    buttonText="Download"
                    variant="secondary"
                    height="medium"
                    icon={faDownload}
                    disabled={!findEntry(data.transcripts, 'type', 'translateStream')?._id}
                  />
                </Col>
              </Row>
            </>
          )
          // eslint-disable-next-line react/jsx-no-useless-fragment
          : (<></>)}
        <Row className="expand-header top-margin">Video Recordings:</Row>
        <ADSFullWidthDivider />
        <Row>
          <Col className="top-padded">Video 1</Col>
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'videoRecordings', findEntry(data.videoRecordings, 'participantName', 'Participant1')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              disabled={!findEntry(data.videoRecordings, 'participantName', 'Participant1')?._id}
            />
          </Col>
        </Row>
        <Row>
          <Col className="top-padded">Video 2</Col>
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'videoRecordings', findEntry(data.videoRecordings, 'participantName', 'Participant2')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              disabled={!findEntry(data.videoRecordings, 'participantName', 'Participant2')?._id}
            />
          </Col>
        </Row>
        <Row className="expand-header top-margin">Audio Recordings:</Row>
        <ADSFullWidthDivider />
        <Row>
          <Col className="top-padded">Audio Stream 1</Col>
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'audioRecordings', findEntry(data.audioRecordings, 'participantName', 'Participant1')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              // Disabling these until recordings are fixed
              disabled={data.module.type === 'VRS' || !findEntry(data.audioRecordings, 'participantName', 'Participant1')?._id}
            />
          </Col>
        </Row>
        <Row>
          <Col className="top-padded">Audio Stream 2</Col>
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'audioRecordings', findEntry(data.audioRecordings, 'participantName', 'Participant2')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              // Disabling these until recordings are fixed
              disabled={data.module.type === 'VRS' || !findEntry(data.audioRecordings, 'participantName', 'Participant2')?._id}
            />
          </Col>
        </Row>
        <Row className="expand-header top-margin">Screen Recordings:</Row>
        <ADSFullWidthDivider />
        <Row>
          <Col className="top-padded">User Interface 1</Col>
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'screenRecordings', findEntry(data.screenRecordings, 'participantName', 'Participant1')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              disabled={!findEntry(data.screenRecordings, 'participantName', 'Participant1')?._id}
            />
          </Col>
        </Row>
        <Row>
          <Col className="top-padded">User Interface 2</Col>
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'screenRecordings', findEntry(data.screenRecordings, 'participantName', 'Participant2')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              disabled={!findEntry(data.screenRecordings, 'participantName', 'Participant1')?._id}
            />
          </Col>
        </Row>
        {data.module.type === 'VRS'
          ? (
            <Row>
              <Col className="top-padded">User Interface 3</Col>
              <Col className="expand-download">
                <ADSButton
                  onClick={() => downloadFile(data, 'screenRecordings', findEntry(data.screenRecordings, 'participantName', 'Participant3')?._id)}
                  buttonText="Download"
                  variant="secondary"
                  height="medium"
                  icon={faDownload}
                  disabled={!findEntry(data.screenRecordings, 'participantName', 'Participant3')?._id}
                />
              </Col>
            </Row>
          // eslint-disable-next-line react/jsx-no-useless-fragment
          ) : (<></>) }
        <Row className="expand-header top-margin">Other Data:</Row>
        <ADSFullWidthDivider />
        <Row>
          {data.module.type === 'IPCTS'
            ? (
              <Col className="top-padded">Raw ASR Data</Col>
            ) : (
              <Col className="top-padded">Raw Data</Col>
            )}
          <Col className="expand-download">
            <ADSButton
              onClick={() => downloadFile(data, 'otherData', findEntry(data.otherData, 'type', 'Other')?._id)}
              buttonText="Download"
              variant="secondary"
              height="medium"
              icon={faDownload}
              disabled={!findEntry(data.otherData, 'type', 'Other')?._id}
            />
          </Col>
        </Row>
      </Col>
    </div>
  );

  const callDataTable = () => {
    const callDataTableCols = [
      {
        /* eslint-disable react/no-unstable-nested-components */
        cell: (row: any) => (
          <span>
            <ADSCheckbox
              label=""
              checked={false}
              id={`call-${row._id}`}
              valueChangeFunction={() => null}
            />
          </span>
        ),
        /* eslint-disable react/no-unstable-nested-components */
        allowOverflow: false,
        button: true,
        width: '48px',
        // This 'order: -1' lets the checkbox be first in the row,
        // otherwise the expand row icon would be first
        style: { 'white-space': 'nowrap;', 'z-index': '989', order: '-1' }
      },
      {
        name: 'ID',
        selector: (row: any) => row.label,
        sortable: true
      },
      {
        name: 'Date',
        selector: (row: any) => getDateOnly(row.startTime),
        sortable: true
      },
      {
        name: 'Start Time',
        selector: (row: any) => getTimeOnly(row.startTime),
        sortable: true
      },
      {
        name: 'End Time',
        selector: (row: any) => getTimeOnly(row.endTime),
        sortable: true
      },
      {
        name: 'Duration',
        selector: (row: any) => secondsToMinutes(row.duration),
        sortable: true
      },
      {
        name: 'Module',
        selector: (row: any) => row.module.type,
        sortable: true
      },
      {
        name: 'Configuration',
        selector: (row: any) => row.configuration.name,
        sortable: true
      },
      {
        name: 'Participant 1',
        selector: (row: any) => row.participants.find((p: any) => p.role === 'Caller').extension,
        sortable: true
      },
      {
        name: 'Participant 2',
        selector: (row: any) => row.participants.find((p: any) => p.role === 'Callee').extension,
        sortable: true
      },
      {
        name: 'Participant 3',
        selector: (row: any) => {
          const participant = row.participants.find((p: any) => p.role === 'Ca');
          if (participant) {
            return participant.extension;
          }
          return '';
        },
        sortable: true
      }
    ];

    return (
      <Row id="call-data-table-row" className="bottom-left-padded">
        <ADSDataTable
          title=""
          columns={callDataTableCols}
          data={callData}
          onSelectedRowsChange={() => true}
          clearSelectedRows={false}
          pagination
          searchEnabled={false}
          expandableRows
          expandableRowsComponent={callDataRowExpanded}
          id="call-data-table"
        />
      </Row>
    );
  };

  return (
    <Container no-gutters="true" fluid className="background-gray">
      <Row className="background-white">
        <Col sm={9} style={{ paddingLeft: '20px', paddingRight: '20px' }}>
          <Row className="overview-breadcrumb-row">
            <ADSBreadcrumbs
              isCustom
              customCrumbs={[
                { text: 'Studies', path: '/study' },
                { text: `${studyID || 'New Study'}`, path: `/${studyID}` }
              ]}
            />
          </Row>
          <Row style={{ paddingTop: '8px' }}>
            <div className="h1 padded">
              <span>{studyData.name || 'Study Title'}</span>
              <span style={{ float: 'right', marginTop: '-4px' }}>
                <ADSButton
                  onClick={() => navigate(`/EditStudy/${studyData.alias}`)}
                  buttonText="Edit Study"
                  variant="primary"
                />
              </span>
            </div>
          </Row>
          <Row ref={studyBasicRef}>
            <div className="h2 padded">Overview</div>
          </Row>
          <Row>
            <Row>
              <Col sm={3}><div className="h6 padded">Study Title</div></Col>
              <Col>{studyData.name}</Col>
            </Row>
            <Row>
              <Col sm={3}><div className="h6 padded">Study Description</div></Col>
              <Col>{studyData.description}</Col>
            </Row>
            <Row>
              <Col sm={3}><div className="h6 padded">Study Purpose</div></Col>
              <Col>{studyData.purpose}</Col>
            </Row>
          </Row>

          <ADSFullWidthDivider />

          <Row className="top-padded" ref={moduleConfigRef}>
            <div className="h2 padded"> Modules </div>
          </Row>
          <Row className="left-padded">
            {studyData.modules.map((moduleData: any, i: number) => (
              <Row key={moduleData._id}>
                {moduleHeader(studyData, i, true)}
                {configTable(studyData, moduleData)}
              </Row>
            ))}
          </Row>

          <ADSFullWidthDivider />

          <Row className="top-padded" ref={dataCollectionRef}>
            <div className="h2 padded"> Module Data Elements </div>
          </Row>
          <Row className="left-padded">
            {studyData.modules.map((moduleData: any, i: number) => (
              <Row key={moduleData._id}>
                {moduleHeader(studyData, i, false)}
                {dataCollectionTables(moduleData)}
              </Row>
            ))}
          </Row>

          <ADSFullWidthDivider />

          <Row className="top-padded" ref={studyDataRef}>
            <div className="h2 collected-data-padding"> Collected Data </div>
          </Row>
          <Row>
            <Col className="call-download-button">
              <ADSTooltip content="Download all files for selected calls" placement="left">
                <ADSIconButton
                  onClick={downloadCallFiles}
                  variant="standard"
                  height="large"
                  size="lg"
                  icon={faDownload}
                  ariaLabel="standard icon"
                />
              </ADSTooltip>
            </Col>
          </Row>

          <Row className="left-padded">
            {callDataTable()}
          </Row>
        </Col>
        <Col sm={3} className="background-gray">
          <ADSSidebarMenu
            menuItems={sidebarMenuItems}
            sideBarRef={[studyBasicRef, moduleConfigRef, dataCollectionRef, studyDataRef]}
            customPadding="12px"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default StudyOverview;
