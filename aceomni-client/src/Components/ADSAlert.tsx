import React, { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';

/**
 * Component for alerts
 * @param alertText - Prop for what the alert will say
 * @param alertType - Prop for success, danger, info, or warning alert types
 * @param isDismissible - Prop to allow user to close the alert
 * @returns Alert
 */
function ADSAlert(props : { alertText: string, alertType: string, isDismissible: boolean,
  autoClose: boolean, showAlert: boolean, setShowAlert: any, fontType: string }) {
  const {
    alertText, alertType, isDismissible, autoClose, showAlert, setShowAlert, fontType
  } = props;
  const [autoCloseID, setAutoCloseID] = useState(-1);

  /**
   *  Tell the parent component the alert has been closed
   */
  function closeAlert() {
    setShowAlert(false);
  }

  // Trigger when showAlert changes
  useEffect(() => {
    setShowAlert(showAlert);

    // Timer for auto dismissal of alert
    if (showAlert && autoClose) {
      setAutoCloseID(
        window.setTimeout(() => {
          closeAlert();
        }, 10000)
      );
    }

    if (!showAlert) {
      clearTimeout(autoCloseID);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAlert]);

  if (showAlert) {
    return (
      <div>
        <Alert
          variant={alertType}
          onClose={() => closeAlert()}
          dismissible={isDismissible}
          aria-live="assertive"
          className={fontType}
        >
          {alertText}
        </Alert>
      </div>
    );
  }
  return (
    null
  );
}

export default ADSAlert;
