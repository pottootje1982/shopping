import React from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@material-ui/core"

import { getServerUrl } from "../server"

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
          Make sure you are signed in into ah.nl and have the chrome extension
          installed
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
