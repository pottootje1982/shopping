import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@material-ui/core'
import PropTypes from 'prop-types'
import ServerContext from '../../server-context'

interface UserSettingsDialogProps {
  setDialogOpen: (value: boolean) => void
  dialogOpen: boolean
}

export default function UserSettingsDialog({
  setDialogOpen,
  dialogOpen
}: UserSettingsDialogProps) {
  const { server } = useContext(ServerContext)
  const [picnicUser, setPicnicUser] = useState()
  const [picnicPass, setPicnicPass] = useState()
  const [paprikaUser, setPaprikaUser] = useState()
  const [paprikaPass, setPaprikaPass] = useState()

  const handleChange = (setter) => (event) => {
    setter(event.target.value)
  }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  async function openDialog() {
    if (dialogOpen) {
      const res = await server().get('/users')
      const {
        data: { picnicUser, picnicPass, paprikaUser, paprikaPass } = {}
      } = res
      setPicnicUser(picnicUser)
      setPicnicPass(picnicPass)
      setPaprikaUser(paprikaUser)
      setPaprikaPass(paprikaPass)
    }
  }

  useEffect(() => {
    openDialog()
  }, [dialogOpen])

  function onOkClick() {
    server().post('users', { picnicUser, picnicPass, paprikaUser, paprikaPass })
    closeDialog()
  }

  return (
    <Dialog onClose={closeDialog} open={dialogOpen}>
      <DialogTitle>User settings</DialogTitle>
      <DialogContent>
        <TextField
          key={`picnicUser-${picnicUser}`}
          id="picnic-user"
          label="Picnic user"
          value={picnicUser}
          onChange={handleChange(setPicnicUser)}
        />
        <TextField
          key={`picnicPass-${picnicPass}`}
          id="picnic-pass"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={picnicPass}
          onChange={handleChange(setPicnicPass)}
        />
        <TextField
          key={`paprikaUser-${paprikaUser}`}
          id="paprika-user"
          label="Paprika user"
          value={paprikaUser}
          onChange={handleChange(setPaprikaUser)}
        />
        <TextField
          key={`paprikaPass-${paprikaPass}`}
          id="paprika-pass"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={paprikaPass}
          onChange={handleChange(setPaprikaPass)}
        />
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

UserSettingsDialog.propTypes = {
  setDialogOpen: PropTypes.func.isRequired,
  dialogOpen: PropTypes.bool.isRequired
}
