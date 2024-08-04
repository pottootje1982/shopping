import React, { useCallback, useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@material-ui/core'
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
  const [picnicUser, setPicnicUser] = useState<string>('')
  const [picnicPass, setPicnicPass] = useState<string>('')
  const [paprikaUser, setPaprikaUser] = useState<string>('')
  const [paprikaPass, setPaprikaPass] = useState<string>('')

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setter(event.target.value)
    }

  const closeDialog = () => {
    setDialogOpen(false)
  }

  const openDialog = useCallback(async () => {
    if (dialogOpen) {
      const { data = {} } = await server().get('/users')
      const { picnicUser, picnicPass, paprikaUser, paprikaPass } = data
      setPicnicUser(picnicUser)
      setPicnicPass(picnicPass)
      setPaprikaUser(paprikaUser)
      setPaprikaPass(paprikaPass)
    }
  }, [dialogOpen, server])

  useEffect(() => {
    openDialog()
  }, [dialogOpen, server, openDialog])

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
