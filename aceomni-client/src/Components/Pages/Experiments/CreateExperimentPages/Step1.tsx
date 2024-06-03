import React from 'react';
import { Updater } from 'use-immer';
import { Container, Col, Row } from 'react-bootstrap';
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ADSSingleLineTextField from '../../../ADSSingleLineTextField';
import ADSMultiLineTextField from '../../../ADSMultiLineTextField';
import ADSTooltip from '../../../ADSTooltip';

function Step1(props: {
  currStudyConfig: any,
  setCurrStudyConfig: Updater<any>
}) {
  const {
    currStudyConfig, setCurrStudyConfig
  } = props;

  const updateStudyName = (value: any) => {
    setCurrStudyConfig((existingConfig: any) => { existingConfig.name = value; });
  };

  const updateStudyDesc = (value: any) => {
    setCurrStudyConfig((existingConfig: any) => { existingConfig.description = value; });
  };

  const updateStudyPurpose = (value: any) => {
    setCurrStudyConfig((existingConfig: any) => { existingConfig.purpose = value; });
  };

  return (
    <Container no-gutters="true" fluid style={{ paddingLeft: '0' }}>
      <Row style={{ paddingBottom: '40px' }}>
        <Col className="body2">
          <b>Step 1</b> of 8:
          <span>
            &nbsp;Name your study and decide where to save it.
            You can also assign researchers and roles/access to the study.
          </span>
        </Col>
      </Row>
      <Row className="align-items-center pb-3" style={{ paddingLeft: '32px' }}>
        <Col xs={2}>
          Study Title *
          <ADSTooltip
            content="This is the researcher-defined title of the study.
            (Note that this field is required – the researcher must enter a title for their study when it is created.)"
            placement="right"
          >
            <FontAwesomeIcon
              icon={faCircleQuestion}
              style={{ marginLeft: '15px' }}
            />
          </ADSTooltip>
        </Col>
        <Col xs={10}>
          <ADSSingleLineTextField
            formText={currStudyConfig.name}
            setFormText={updateStudyName}
            formLabel="Study Title"
            isFormLabelHidden
            hasDelete={false}
            elementID="studyTitle"
          />
        </Col>
      </Row>
      <Row className="align-items-center pb-3" style={{ paddingLeft: '32px' }}>
        <Col xs={2}>
          Study Description
          <ADSTooltip
            content="This text area contains a researcher-defined description of the study, or summary of the research the study aims to investigate."
            placement="right"
          >
            <FontAwesomeIcon
              icon={faCircleQuestion}
              style={{ marginLeft: '15px' }}
            />
          </ADSTooltip>
        </Col>
        <Col xs={10}>
          <ADSMultiLineTextField
            formText={currStudyConfig.description}
            setFormText={updateStudyDesc}
            formLabel="Study Description"
            isFormLabelHidden
            elementID="studyDescription"
            isDynamic={false}
          />
        </Col>
      </Row>
      <Row className="align-items-center pb-3" style={{ paddingLeft: '32px' }}>
        <Col xs={2}>
          Study Purpose
          <ADSTooltip
            content="This text area contains researcher-defined details of the purpose of the study,
             and illustrates what the study will do, which should reflect the statement of the problem."
            placement="right"
          >
            <FontAwesomeIcon
              icon={faCircleQuestion}
              style={{ marginLeft: '15px' }}
            />
          </ADSTooltip>
        </Col>
        <Col xs={10}>
          <ADSMultiLineTextField
            formText={currStudyConfig.purpose}
            setFormText={updateStudyPurpose}
            formLabel="Study Purpose"
            isFormLabelHidden
            elementID="studyPurpose"
            isDynamic={false}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Step1;
