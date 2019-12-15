import React, { useEffect, useState } from "react"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Box
} from "@material-ui/core"

export default function OrderDialog({ open, handleClose, selectedRecipes }) {
  const [items, setItems] = useState([])
  const [ignored, setIgnored] = useState([])
  const [notAvailable, setNotAvailable] = useState([])

  useEffect(() => {
    const mappings = selectedRecipes.map(r =>
      Object.entries(r.mappings).map(([ingredient, map]) => {
        return {
          ingredient,
          ...map
        }
      })
    )
    const items = [].concat(...mappings)
    setItems(items.filter(i => !i.notAvailable && !i.ignore))
    setIgnored(items.filter(i => i.ignore))
    setNotAvailable(items.filter(i => i.notAvailable))
  }, [selectedRecipes])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      modal={true}
      maxWidth={"md"}
    >
      <DialogTitle id="alert-dialog-title">
        {"Order the following items?"}
      </DialogTitle>
      <DialogContent style={{ minWidth: 900 }}>
        <DialogContentText id="alert-dialog-description">
          <Grid container>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">Ordered items</Box>
              {items.map((item, index) => (
                <li key={index}>
                  {item.ingredient}: {item.quantity}{" "}
                </li>
              ))}
            </Grid>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">Unavailable items</Box>
              {notAvailable.map((item, index) => (
                <li key={index}>
                  {item.ingredient}: {item.quantity}{" "}
                </li>
              ))}
            </Grid>
            <Grid item xs={4}>
              <Box fontWeight="fontWeightBold">Ignored items</Box>
              {ignored.map((item, index) => (
                <li key={index}>
                  {item.ingredient}: {item.quantity}{" "}
                </li>
              ))}
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={e => handleClose(e, false)} color="primary">
          Cancel
        </Button>
        <Button onClick={e => handleClose(e, true)} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}
