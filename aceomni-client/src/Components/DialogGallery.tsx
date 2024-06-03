import React, { useState } from 'react';

import ADSButton from './ADSButton';
import ADSDialog from './ADSDialog';
import ADSSingleLineTextField from './ADSSingleLineTextField';

const reactlogo = require('../SandboxImages/logo512.png');

const pad = {
  padding: '5px 30px 20px'
};

/**
 * Complilation of dialogs
 * @returns Dialogs of all sizes
 */
export default function DialogGallery() {
  // #region Text Field Variables
  const [nameTextOrig, setNameTextOrig] = useState('');
  const [nameText, setNameText] = useState('');
  const updateNameText = (value: any) => {
    setNameText(value);
  };

  const [addressTextOrig, setAddressTextOrig] = useState('');
  const [addressText, setAddressText] = useState('');
  const updateAddressText = (value: any) => {
    setAddressText(value);
  };
  // #endregion

  // #region Open/Close
  const [openXS, setOpenXS] = useState(false);
  const handleClickOpenXS = () => {
    setOpenXS(true);
  };
  const handleCloseXS = () => {
    setOpenXS(false);
  };

  const [openS, setOpenS] = useState(false);
  const handleClickOpenS = () => {
    setOpenS(true);
  };
  const handleCloseS = () => {
    setOpenS(false);
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const [openL, setOpenL] = useState(false);
  const handleClickOpenL = () => {
    setOpenL(true);
  };
  const handleCloseL = () => {
    setOpenL(false);
  };

  const [openWithForm, setOpenWithForm] = useState(false);
  const handleClickOpenWithForm = () => {
    setNameText(nameTextOrig);
    setAddressText(addressTextOrig);
    setOpenWithForm(true);
  };
  const handleCloseWithFormSave = () => {
    console.log('Close (Save)');
    console.log(`${nameText} ${addressText}`);
    setNameTextOrig(nameText);
    setAddressTextOrig(addressText);
    setOpenWithForm(false);
  };
  const handleCloseWithFormCancel = () => {
    setNameText(nameTextOrig);
    setAddressText(addressTextOrig);
    console.log('Close (Cancel)');
    setOpenWithForm(false);
  };

  const [openWithImage, setOpenWithImage] = useState(false);
  const handleClickOpenWithImage = () => {
    setOpenWithImage(true);
  };
  const handleCloseWithImage = () => {
    setOpenWithImage(false);
  };

  const [openNoBody, setOpenNoBody] = useState(false);
  const handleClickOpenNoBody = () => {
    setOpenNoBody(true);
  };
  const handleCloseNoBody = () => {
    setOpenNoBody(false);
  };

  const [openCommonDialog, setOpenCommonDialog] = useState(false);
  const handleClickOpenCommonDialog = () => {
    setOpenCommonDialog(true);
  };
  const handleCloseCommonDialog = () => {
    setOpenCommonDialog(false);
  };
  // #endregion

  return (
    <div>
      <div className="h2" style={pad}>Modal Dialog</div>
      <div style={pad}>
        <ADSButton onClick={handleClickOpenXS} buttonText="Open ADS Dialog (xs)" /> &nbsp; &nbsp;
        <ADSButton onClick={handleClickOpenS} buttonText="Open ADS Dialog (sm)" /> &nbsp; &nbsp;
        <ADSButton onClick={handleClickOpen} buttonText="Open ADS Dialog (md)" /> &nbsp; &nbsp;
        <ADSButton onClick={handleClickOpenL} buttonText="Open ADS Dialog (lg)" />

        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseXS} buttonText="Primary Button" />
              <ADSButton onClick={handleCloseXS} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleCloseXS}
          open={openXS}
          width="xs"
        >
          Modal dialog body text and/or content goes here. Some more text
          to see how it wraps around inside of the dialog. Round and round.
        </ADSDialog>

        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseS} buttonText="Primary Button" />
              <ADSButton onClick={handleCloseS} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleCloseS}
          open={openS}
          width="sm"
        >
          Modal dialog body text and/or content goes here. Some more text
          to see how it wraps around inside of the dialog. Round and round.
        </ADSDialog>

        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleClose} buttonText="Primary Button" />
              <ADSButton onClick={handleClose} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleClose}
          open={open}
          width="md"
        >
          Modal dialog body text and/or content goes here. Some more text
          to see how it wraps around inside of the dialog. Round and round.
        </ADSDialog>

        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseL} buttonText="Primary Button" />
              <ADSButton onClick={handleCloseL} variant="secondary" buttonText="Secondary Button" />
              <ADSButton onClick={handleCloseNoBody} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleCloseL}
          open={openL}
          width="lg"
        >
          Modal dialog body text and/or content goes here. Some more text
          to see how it wraps around inside of the dialog. Round and round.
        </ADSDialog>
      </div>

      <div style={pad} title="Open ADS Dialog with form">
        <ADSButton onClick={handleClickOpenWithForm} buttonText="Open ADS Dialog with form" />
        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseWithFormSave} buttonText="Primary Button (Save)" />
              <ADSButton onClick={handleCloseWithFormCancel} variant="secondary" buttonText="Secondary Button (Cancel)" />
            </>
          )}
          onClose={handleCloseWithFormCancel}
          open={openWithForm}
        >
          <div>
            <ADSSingleLineTextField
              formText={nameText}
              setFormText={updateNameText}
              formLabel="Name"
              isFormLabelHidden={false}
              hasDelete={false}
              elementID="dialogNameText"
            />
            <ADSSingleLineTextField
              formText={addressText}
              setFormText={updateAddressText}
              formLabel="Address"
              isFormLabelHidden={false}
              hasDelete
              elementID="dialogAddressText"
            />
          </div>
        </ADSDialog>
      </div>
      <div style={pad} title="Open ADS Dialog with image">
        <ADSButton onClick={handleClickOpenWithImage} buttonText="Open ADS Dialog with image" />
        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseWithImage} buttonText="Primary Button" />
              <ADSButton onClick={handleCloseWithImage} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleCloseWithImage}
          open={openWithImage}
        >
          <img
            src={reactlogo}
            alt="react logo"
            style={{
              display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '40%'
            }}
          />
        </ADSDialog>
      </div>
      <div style={pad} title="Open ADS Dialog no body">
        <ADSButton onClick={handleClickOpenNoBody} buttonText="Open ADS Dialog no body" />
        <ADSDialog
          title="Modal Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseNoBody} buttonText="Primary Button" />
              <ADSButton onClick={handleCloseNoBody} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleCloseNoBody}
          open={openNoBody}
        />
      </div>
      <div className="h2" style={pad}>Common Dialog</div>
      <div style={pad} title="Open ADS Common Dialog">
        <ADSButton onClick={handleClickOpenCommonDialog} buttonText="Open ADS Common Dialog" />
        <ADSDialog
          common
          title="Common Dialog Title"
          buttons={(
            <><ADSButton onClick={handleCloseCommonDialog} buttonText="Primary Button" />
              <ADSButton onClick={handleCloseCommonDialog} variant="secondary" buttonText="Secondary Button" />
            </>
          )}
          onClose={handleCloseCommonDialog}
          open={openCommonDialog}
        >
          Common dialog body text and/or content goes here.
        </ADSDialog>
      </div>
    </div>
  );
}
