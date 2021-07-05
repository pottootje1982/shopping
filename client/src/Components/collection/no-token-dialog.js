import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@material-ui/core'
import PropTypes from 'prop-types'

import { getServerUrl } from '../server'

export default function NoTokenDialog({ dialogOpen, setDialogOpen }) {
  const closeDialog = () => {
    setDialogOpen(false)
  }

  function onOkClick() {
    closeDialog()
    onOk()
  }

  function getExtension() {
    window.open(`${getServerUrl()}/orders/extension`)
  }

  function onOk() {
    closeDialog()
  }

  return (
    <Dialog onClose={closeDialog} open={dialogOpen}>
      <DialogTitle>AH token cannot be found</DialogTitle>
      <DialogContent>
        <Typography>
          Make sure you have ah.nl opened in the browser and have the chrome
          extension installed. After installation of the extension you should
          refresh this page.
        </Typography>
        <Button onClick={getExtension}>Get extension</Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button autoFocus onClick={onOkClick}>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

NoTokenDialog.propTypes = {
  dialogOpen: PropTypes.bool.isRequired,
  setDialogOpen: PropTypes.func.isRequired
}
