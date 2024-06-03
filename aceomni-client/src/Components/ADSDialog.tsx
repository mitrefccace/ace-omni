/* eslint-disable react/jsx-props-no-spreading */
import React, { } from 'react';

import { styled } from '@mui/material/styles';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import Draggable from 'react-draggable';
import Paper, { PaperProps } from '@mui/material/Paper';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import ADSFullWidthDivider from './ADSFullWidthDivider';

import './ADSDialog.css';

/**
 * For draggable common dialogs
 * @param props from material icons
 * @returns Paper component
 */

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const CustomDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2)
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1)
  }
}));

/**
 * Returns an ADS Dialog
 *
 * @param buttons - ADS Buttons for the dialog
 * @param children - Body
 * @param common - Specify Common Dialog. Default without this is Modal Dialog
 * @param title - Title of the dialog
 * @param onClose - Callback fired when the component requests to be closed.
 * @param open - If true, the component is shown.
 * @param width - Width of the dialog ('xs' | 'sm' | 'md' | 'lg' | false)
 *                Set to false to use automatic width
 *
 * @returns ADS Dialog
 */
export default function ADSDialog(props: {
  buttons: React.ReactNode;
  children?: any;
  common?: boolean;
  title: string;
  onClose: () => void;
  open: boolean;
  width?: 'xs' | 'sm' | 'md' | 'lg' | false;
}) {
  const {
    buttons,
    children,
    common,
    title,
    onClose,
    open,
    width
  } = props;

  // Variables for Common Dialog
  let disableEnforceFocus = false;
  let hideBackdrop = false;
  let draggableStyle;

  // These are settings for a Common Dialog
  if (common) {
    disableEnforceFocus = true;
    hideBackdrop = true;
    draggableStyle = { cursor: 'move' };
  }

  let fullWidth = false;
  if (width !== false) fullWidth = true;

  // Prevent closing of the dialog if user clicks on the backdrop
  const onCloseInternal = (event:object, reason:string) => {
    if (reason && reason === 'backdropClick') {
      return;
    }
    onClose();
  };

  return (
    <div>
      <CustomDialog
        aria-labelledby="dialog-title"
        open={open}
        onClose={onCloseInternal}
        fullWidth={fullWidth}
        maxWidth={width}
        // Control what the pointer can do
        style={{ pointerEvents: 'auto' }}
        PaperProps={{
          style: {
            pointerEvents: 'auto',
            boxShadow: 'none',
            border: '1px solid #C8C8C8', // --ADS_Grayscale_20: #C8C8C8;
            position: 'inherit'
          }
        }}
        // For Common Dialogs
        PaperComponent={common ? PaperComponent : undefined}
        disableEnforceFocus={disableEnforceFocus}
        hideBackdrop={hideBackdrop}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2
          }}
          className="adsdialogtitle h5"
          id="dialog-title"
          style={draggableStyle}
        // {...other}
        >
          {title}
          {onClose !== undefined ? (
            // TODO Later for close use ADSIconButton instead of MUI/Material-UI IconButton
            // <span className="adscloseright">
            //   <ADSIconButton ariaLabel="close"
            //     variant="standard" icon={faTimes} onClick={onClose} />
            // </span>
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'black'
              }}
            >
              <CloseIcon />
            </IconButton>
          ) : null}
        </DialogTitle>

        <ADSFullWidthDivider />

        {children
          ? (
            <>
              <DialogContent>
                {children}
              </DialogContent>
              <ADSFullWidthDivider />
            </>
          )
          : null}

        <DialogActions className="adsdialogbuttons">
          {buttons}
        </DialogActions>
      </CustomDialog>
    </div>
  );
}

ADSDialog.defaultProps = {
  common: false,
  children: undefined,
  width: false
};
