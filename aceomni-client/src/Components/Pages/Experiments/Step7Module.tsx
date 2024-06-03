import React from 'react';
import { Updater } from 'use-immer';
import {
  Accordion, Container, Row
} from 'react-bootstrap';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ADSLink from '../../Components/ADSLink';
import ADSAccordion from '../../ADSAccordion';
import ADSDataTable from '../../ADSDataTable';
import ADSFullWidthDivider from '../../ADSFullWidthDivider';
import ADSTooltip from '../../ADSTooltip';

function Step7Module(props: {
  module: any,
  index: number,
  currStudyConfig: any,
  setCurrStudyConfig: Updater<any>
}) {
  const {
    module,
    index,
    currStudyConfig,
    setCurrStudyConfig
  } = props;

  // useEffect(() => {
  //   console.log(' ');
  //   console.log(`Change to ${module.type}`);
  //   console.log(currStudyConfig.modules[index].dataCollection);
  // });

  const tableCols = [
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

  const captionTableData = [
    {
      id: 'ASRcaptionStream',
      label: 'Captions from ASR Engine',
      description: 'The finalized ASR Caption Stream as displayed to a participant, including timestamps and speaker/recipient labels.',
      ipctsDisabled: true
    },
    {
      id: 'TranslationEngine',
      dataSection: 'Transcripts',
      label: 'Captions from Translation Engine',
      description: 'The captions from the Translation Engine in both input and output languages (and including language labels and codes).',
      ipctsDisabled: false
    }
  ];

  const audioRecsTableData = [
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
  ];

  const audioRecsTableDataVRS = [
    {
      id: 'AudioStream1',
      label: 'Audio Stream 1',
      description: 'An audio recording of Audio Stream 1 (As sent by Participant 1 and received by Participant 3).',
      ipctsDisabled: true
    },
    {
      id: 'AudioStream2',
      label: 'Audio Stream 2',
      description: 'An audio recording of Audio Stream 2 (As sent by Participant 3 and received by Participant 1).',
      ipctsDisabled: true
    }
  ];

  const screenRecsTableData = [
    {
      id: 'UserInterface1',
      label: 'User Interface 1',
      description: 'A computer screen recording of UI 1, allowing researchers to observe stimuli as they appear to Participant 1.',
      ipctsDisabled: true
    },
    {
      id: 'UserInterface2',
      label: 'User Interface 2',
      description: 'A computer screen recording of UI 2, allowing researchers to observe stimuli as they appear to Participant 2.',
      ipctsDisabled: true
    }
  ];

  const screenRecsTableDataVRS = [
    {
      id: 'UserInterface1',
      label: 'User Interface 1',
      description: 'A computer screen recording of UI 1, allowing researchers to observe stimuli as they appear to Participant 1.',
      ipctsDisabled: true
    },
    {
      id: 'UserInterface2',
      label: 'User Interface 2',
      description: 'A computer screen recording of UI 2, allowing researchers to observe stimuli as they appear to Participant 2.',
      ipctsDisabled: true
    },
    {
      id: 'UserInterface3',
      label: 'User Interface 3',
      description: 'A computer screen recording of UI 3, allowing researchers to observe stimuli as they appear to Participant 3.',
      ipctsDisabled: true
    }
  ];

  const videoRecsTableData = [
    {
      id: 'Video1',
      label: 'Video 1',
      description: 'A computer camera video recording of Participant 1, allowing researchers to observe participant gaze and reactions.',
      ipctsDisabled: true
    },
    {
      id: 'Video2',
      dataSection: 'VideoRecordings',
      label: 'Video 2',
      description: 'A computer camera video recording of Participant 2, allowing researchers to observe participant gaze and reactions.',
      ipctsDisabled: true
    }
  ];

  const videoRecsTableDataVRS = [
    {
      id: 'Video1',
      label: 'Video 1',
      description: 'A computer camera video recording of Participant 3, allowing researchers to observe participant gaze and reactions.',
      ipctsDisabled: true
    },
    {
      id: 'Video2',
      dataSection: 'VideoRecordings',
      label: 'Video 2',
      description: 'A computer camera video recording of Participant 2, allowing researchers to observe participant gaze and reactions.',
      ipctsDisabled: true
    }
  ];

  const otherTableData = [
    {
      id: 'ASRrawdata',
      label: 'ASR Raw Data',
      description: 'A large set of supporting data provided by the selected ASR Engine. Different ASR Engines provide different types of raw data.',
      ipctsDisabled: true
    }
  ];

  const otherTableDataVRS = [
    {
      id: 'ASRrawdata',
      label: 'Raw Data',
      description: 'A large set of supporting data provided by the selected systems.',
      ipctsDisabled: true
    }
  ];

  const tooltipIcon = (tooltipText: string) => (
    <ADSTooltip placement="right" content={tooltipText}>
      <FontAwesomeIcon
        icon={faCircleQuestion}
        style={{ marginLeft: '15px' }}
      />
    </ADSTooltip>
  );

  const handleRowSelected = (selectedRows: any, moduleIndex: number, dataSection: string) => {
    // Because the underlying react-data-table calls this function a million times
    // We need to avoid updating the studyconfig unless it has really changed
    const selectedValues = selectedRows.map((value: any) => value.id);
    let changed = false;
    const currDataCollection = currStudyConfig.modules[moduleIndex].dataCollection[dataSection];

    Object.keys(currDataCollection).forEach((key) => {
      changed = changed || (currDataCollection[key] !== selectedValues.includes(key));
    });

    if (changed) {
      setCurrStudyConfig((existingConfig: any) => {
        const dataCollection = existingConfig.modules[moduleIndex].dataCollection[dataSection];
        Object.keys(dataCollection).forEach((key) => {
          dataCollection[key] = selectedValues.includes(key);
        });
      });
    }
  };

  const handleCaptionRowPreSelected = (row: any) => {
    const objects = Object.entries(currStudyConfig.modules[index].dataCollection.Transcripts)
      .filter((item: any) => {
        if (currStudyConfig.modules[index].type === 'IPCTS' && row.id === 'ASRcaptionStream') {
          return false;
        }

        return (item[1] === true);
      })
      .map((item: any) => item[0]);

    return objects.includes(row.id);
  };

  const handleVideoRowPreSelected = (row: any) => {
    const objects = Object.entries(currStudyConfig.modules[index].dataCollection.VideoRecordings)
      .filter((item: any) => item[1] === true)
      .map((item: any) => item[0]);

    return objects.includes(row.id);
  };

  const handleAudioRowPreSelected = (row: any) => {
    const objects = Object.entries(currStudyConfig.modules[index].dataCollection.AudioRecordings)
      .filter((item: any) => item[1] === true)
      .map((item: any) => item[0]);

    return objects.includes(row.id);
  };

  const handleScreenRecsRowPreSelected = (row: any) => {
    const objects = Object.entries(currStudyConfig.modules[index].dataCollection.ScreenRecordings)
      .filter((item: any) => item[1] === true)
      .map((item: any) => item[0]);

    return objects.includes(row.id);
  };

  const handleOtherRowPreSelected = (row: any) => {
    const objects = Object.entries(currStudyConfig.modules[index].dataCollection.OtherData)
      .filter((item: any) => item[1] === true)
      .map((item: any) => item[0]);

    return objects.includes(row.id);
  };

  const rowSelectedDisabled = (row: { ipctsDisabled: boolean; }) => row.ipctsDisabled === true;
  const rowSelectedCriteria = (row: { ipctsDisabled: boolean; }) => row.ipctsDisabled !== true;

  return (
    <Container
      no-gutters="true"
      fluid
    >
      <Row key={module.type}>
        <div style={{ padding: '16px' }}>
          <div className="h3">{module.type === 'IPCTS' ? 'IPCTS with ASR Data Elements' : module.type}</div>
          <div>
            {module.type === 'VRS' ? (
              <ADSLink
                url={`${process.env.REACT_APP_LOCATION}/VRSInfrastructureDiagramOnly.jpeg`}
                linkText="View Module Diagram"
                fontType="body1"
                isExternal
                isNavigational
              />
            ) : (
              <ADSLink
                url={`${process.env.REACT_APP_LOCATION}/InfrastructureDiagramOnly.jpeg`}
                linkText="View Module Diagram"
                fontType="body1"
                isExternal
                isNavigational
              />
            )}
          </div>
        </div>
        {module.type === 'VRS' ? (
          <ADSAccordion defaultActiveKeys={['1', '2', '3', '4']}>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Video Recordings {
                tooltipIcon('A digital recording of both visual and audible components. ')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={videoRecsTableDataVRS}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'VideoRecordings')}
                  selectableRowDisabled={rowSelectedDisabled}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Audio Recordings {
                tooltipIcon('Sound information that is captured onto a storage medium.')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={audioRecsTableDataVRS}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'AudioRecordings')}
                  selectableRowDisabled={rowSelectedDisabled}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Screen Recordings {
                tooltipIcon('A digital recording of computer screen output, also known as a video screen capture or a screen recording; can be synched with audio recordings.')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={screenRecsTableDataVRS}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'ScreenRecordings')}
                  selectableRowDisabled={rowSelectedDisabled}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Other Data {
                tooltipIcon('Additional data not already captured by other data collection methods; can include raw data from a source.')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={otherTableDataVRS}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'OtherData')}
                  selectableRowDisabled={rowSelectedDisabled}
                />
              </Accordion.Body>
            </Accordion.Item>
            <div className="fill-padding" style={{ padding: '24px' }} />
          </ADSAccordion>
        ) : (
          <ADSAccordion defaultActiveKeys={['0', '1', '2', '3', '4']}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Captions {
                tooltipIcon('Refers to any text representation of words and other important audio information that is transcribed. ')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={captionTableData}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'Transcripts')}
                  selectableRowSelected={handleCaptionRowPreSelected}
                  selectableRowDisabled={module.type === 'IPCTS' ? rowSelectedDisabled : null}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="1">
              <Accordion.Header>Video Recordings {
                tooltipIcon('A digital recording of both visual and audible components. ')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={videoRecsTableData}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'VideoRecordings')}
                  selectableRowSelected={module.type === 'IPCTS' ? rowSelectedCriteria : handleVideoRowPreSelected}
                  selectableRowDisabled={module.type === 'IPCTS' ? rowSelectedDisabled : null}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Audio Recordings {
                tooltipIcon('Sound information that is captured onto a storage medium.')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={audioRecsTableData}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'AudioRecordings')}
                  selectableRowSelected={handleAudioRowPreSelected}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Screen Recordings {
                tooltipIcon('A digital recording of computer screen output, also known as a video screen capture or a screen recording; can be synched with audio recordings.')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={screenRecsTableData}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'ScreenRecordings')}
                  selectableRowSelected={module.type === 'IPCTS' ? rowSelectedCriteria : handleScreenRecsRowPreSelected}
                  selectableRowDisabled={module.type === 'IPCTS' ? rowSelectedDisabled : null}
                />
              </Accordion.Body>
            </Accordion.Item>
            <Accordion.Item eventKey="4">
              <Accordion.Header>Other Data {
                tooltipIcon('Additional data not already captured by other data collection methods; can include raw data from a source.')
              }
              </Accordion.Header>
              <Accordion.Body style={{ padding: 0 }}>
                <ADSDataTable
                  data={otherTableData}
                  columns={tableCols}
                  selectableRows
                  searchEnabled={false}
                  onSelectedRowsChange={(e: any) => handleRowSelected(e.selectedRows, index, 'OtherData')}
                  selectableRowSelected={module.type === 'IPCTS' ? rowSelectedCriteria : handleOtherRowPreSelected}
                  selectableRowDisabled={module.type === 'IPCTS' ? rowSelectedDisabled : null}
                />
              </Accordion.Body>
            </Accordion.Item>
            <div className="fill-padding" style={{ padding: '24px' }} />
          </ADSAccordion>
        )}
        {index < currStudyConfig.modules.length - 1
          ? <div style={{ paddingTop: '16px' }}><ADSFullWidthDivider /> </div>
          : null}
      </Row>
    </Container>
  );
}

export default Step7Module;
