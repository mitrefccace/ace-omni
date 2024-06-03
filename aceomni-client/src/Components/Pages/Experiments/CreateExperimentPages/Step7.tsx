import React from 'react';
import { Updater } from 'use-immer';
import {
  Container, Row, Col
} from 'react-bootstrap';
import ADSLink from '../../../Components/ADSLink';
import Step7Module from '../Step7Module';

function Step7(props: {
  currStudyConfig: any,
  setCurrStudyConfig: Updater<any>
}) {
  const {
    currStudyConfig,
    setCurrStudyConfig
  } = props;

  return (
    <Container
      no-gutters="true"
      fluid
    >
      <Row style={{ paddingBottom: '20px' }}>
        <Col className="body2">
          <span style={{ padding: '0' }}>
            <b>Step 7 </b>
            of 8: Select all data elements that you wish to capture in data collection.
            (Please check all that apply.)
          </span>
        </Col>
      </Row>
      <Row style={{ paddingBottom: '20px' }}>
        <span className="body1" style={{ padding: '0' }}>
          ACE Omni automatically collects a standard set of research data for you,
          such as the Start Time and End Time for each connection. &nbsp;
          <ADSLink
            fontType="body1"
            url=""
            linkText="Click here for the full list of automatically-collected data."
            isExternal={false}
            isNavigational={false}
            onClickFunction={() => { }}
          />
        </span>
      </Row>
      {currStudyConfig.modules.map((module: any, index: number) => (
        <Step7Module
          key={module.type}
          module={module}
          index={index}
          currStudyConfig={currStudyConfig}
          setCurrStudyConfig={setCurrStudyConfig}
        />
      ))}
    </Container>
  );
}

export default Step7;
