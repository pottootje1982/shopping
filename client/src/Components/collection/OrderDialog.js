import React, { useEffect, useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Box
} from '@material-ui/core'
import PropTypes from 'prop-types'

export default function OrderDialog({ open, handleClose, selectedRecipes }) {
  const [items, setItems] = useState([])
  const [ignored, setIgnored] = useState([])
  const [notAvailable, setNotAvailable] = useState([])

  useEffect(() => {
    const products = selectedRecipes.map((r) =>
      r.parsedIngredients.map(({ ingredient, product }) => {
        return {
          ingredient,
          ...product
        }
      })
    )
    const items = [].concat(...products).filter((p) => p.id)
    setItems(items.filter((i) => !i.notAvailable && !i.ignore))
    setIgnored(items.filter((i) => i.ignore))
    setNotAvailable(items.filter((i) => i.notAvailable))
  }, [selectedRecipes])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      modal="true"
      maxWidth="md"
    >
      <DialogTitle id="alert-dialog-title">
        {'Order the following items?'}
      </DialogTitle>
      <DialogContent style={{ minWidth: 900 }}>
        <Grid container>
          <Grid item xs={6}>
            <Box fontWeight="fontWeightBold">Ordered items</Box>
            {items.map((item, index) => (
              <li key={index}>
                {item.title || item.ingredient}: {item.quantity}{' '}
              </li>
            ))}
          </Grid>
          <Grid item xs={6}>
            <Box fontWeight="fontWeightBold">Unavailable items</Box>
            {notAvailable.map((item, index) => (
              <li key={index}>
                {item.title || item.ingredient}: {item.quantity}{' '}
              </li>
            ))}
            <Box fontWeight="fontWeightBold">Ignored items</Box>
            {ignored.map((item, index) => (
              <li key={index}>
                {item.title || item.ingredient}: {item.quantity}{' '}
              </li>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={(e) => handleClose(e, false)} color="primary">
          Cancel
        </Button>
        <Button onClick={(e) => handleClose(e, true)} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

OrderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectedRecipes: PropTypes.array.isRequired
}
