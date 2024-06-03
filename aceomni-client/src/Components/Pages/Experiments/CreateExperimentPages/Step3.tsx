import React from 'react';
import {
  faComputer,
  faBriefcase,
  faVideo,
  faPhone
} from '@fortawesome/free-solid-svg-icons';
import { Container, Row, Col } from 'react-bootstrap';
import { ADSTileGroup } from '../../../ADSTileGroup';
import '../CreateExperiment.css';

function Step3(props: {
  currStudyConfig: any,
  addStudyModule: (moduleType:string) => void,
  removeStudyModule: (moduleType:string) => void
}) {
  const {
    currStudyConfig, addStudyModule, removeStudyModule
  } = props;

  return (
    <Container no-gutters="true" fluid style={{ paddingLeft: '0' }}>
      <Row style={{ paddingBottom: '40px' }}>
        <Col className="body2">
          <p>
            <b>Step 3</b> of 8: Please select the type of TRS experience(s)
            you wish to create for study participants
          </p>

          <div className="step3-tile-container">
            <ADSTileGroup
              type="multi"
              label="TRS Experience"
              id="choose-experience-group"
              group="multi-tile"
              onChecked={addStudyModule}
              onUnChecked={removeStudyModule}
              tiles={[
                {
                  value: 'IPCTS', textContent: 'IPCTS with ASR', icons: [faComputer], checked: (currStudyConfig.modules.some((m:any) => m.type === 'IPCTS'))
                },
                {
                  value: 'IP Relay with ASR', textContent: 'IP Relay with ASR', icons: [faPhone], checked: (currStudyConfig.modules.some((m:any) => m.type === 'IP Relay with ASR')), disabled: true
                },
                {
                  value: 'VRS', textContent: 'VRS', icons: [faVideo], checked: (currStudyConfig.modules.some((m:any) => m.type === 'VRS'))
                },
                {
                  value: 'Custom', textContent: 'Custom', icons: [faBriefcase], checked: (currStudyConfig.modules.some((m:any) => m.type === 'Custom')), disabled: true
                }
              ]}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Step3;
