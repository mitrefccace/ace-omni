import React from 'react';
import './ADSStepper.css';

interface ADSStepperProps {
  stepElements: Array<any>
}

/**
 * Returns an ADS Stepper
 *
 * @param stepElements - List of elements to step through.
 * Should be in the following format:
 * [{id: '', label: '', isActive: true/false, isComplete: true/false}]
 *
 * @returns ADS Stepper
 */

function ADSStepper(props: ADSStepperProps) {
  const {
    stepElements
  } = props;

  // add default values
  return (
    <div
      className="usa-step-indicator usa-step-indicator--counters-sm"
      aria-label="progress"
    >
      <ol className="usa-step-indicator__segments">
        {stepElements.map((element, index) => (
          <li
            key={`stepper_${index + 1}`}
            // eslint-disable-next-line no-nested-ternary
            className={`usa-step-indicator__segment ${element.isActive ? 'usa-step-indicator__segment--current' : element.isComplete ? 'usa-step-indicator__segment--complete' : ''}`}
          >
            <span className="usa-step-indicator__segment-label">
              {element.label}<span className="usa-sr-only">{element.isComplete ? 'completed' : 'not completed'}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

ADSStepper.defaultProps = {
};

export default ADSStepper;
