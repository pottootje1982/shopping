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
import { Product, Recipe } from './RecipeProvider'
import * as R from 'ramda'

interface OrderDialogProps {
  open: boolean
  handleClose: (e: object, cancel: boolean) => void
  selectedRecipes: Recipe[]
}

type ProductWithIngredient = Product & { ingredient: string; quantity: string }

export default function OrderDialog({
  open,
  handleClose,
  selectedRecipes
}: OrderDialogProps) {
  const [items, setItems] = useState<ProductWithIngredient[]>([])
  const [ignored, setIgnored] = useState<ProductWithIngredient[]>([])
  const [notAvailable, setNotAvailable] = useState<ProductWithIngredient[]>([])

  useEffect(() => {
    const products = selectedRecipes.map((r) =>
      (r?.parsedIngredients ?? []).map(({ product, ...rest }) => {
        return {
          ...rest,
          ...product
        }
      })
    )
    const items = R.flatten(products).filter((p) => p.id)
    setItems(items.filter((i) => !i.notAvailable && !i.ignore))
    setIgnored(items.filter((i) => i.ignore))
    setNotAvailable(items.filter((i) => i.notAvailable))
  }, [selectedRecipes])

  return (
    <Dialog
      open={open}
      onClose={(e) => handleClose(e, false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
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
