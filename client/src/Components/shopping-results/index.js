import server from '../server'
import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button as MuiButton,
  Link
} from '@material-ui/core'
import { Button } from '../styled'
import PropTypes from 'prop-types'

const styles = makeStyles(() => ({
  input: {
    height: 36,
    marginRight: 4,
    marginTop: 3
  }
}))

export default function ProductSearch({
  selectedIngredient,
  setSelectedIngredient,
  searchProducts,
  products
}) {
  const classes = styles()
  const searchRef = useRef(null)
  const bareIngredient = selectedIngredient.ingredient
  const { product = {} } = selectedIngredient

  useEffect(doSearch, [selectedIngredient])

  function doSearch() {
    searchProducts(selectedIngredient)
  }

  function selectProduct(completeProduct) {
    const { id, title, price, ignore, notAvailable } = completeProduct
    const newProduct = { id, title, price, ignore, notAvailable }
    setSelectedIngredient({ ...selectedIngredient, product: newProduct })

    server.post('products/choose', {
      ingredient: bareIngredient,
      product: newProduct
    })
  }

  function textFieldSearch(event) {
    if (event.keyCode === 13) {
      searchProducts(undefined, event.target.value)
    }
  }

  function search(value) {
    searchRef.current.value = value
    searchProducts(undefined, value)
  }

  function ignoreIngredient(checked) {
    product.ignore = checked
    product.notAvailable = false
    selectProduct(product)
  }

  function notAvailableIngredient(checked) {
    product.notAvailable = checked
    product.ignore = false
    selectProduct(product)
  }

  return (
    <Grid
      container
      item
      xs={6}
      key={bareIngredient}
      alignItems="stretch"
      spacing={1}
    >
      {bareIngredient.split(' ').map((item) => (
        <Button key={item} variant="outlined" onClick={() => search(item)}>
          {item}
        </Button>
      ))}
      <TextField
        InputProps={{
          className: classes.input
        }}
        inputRef={searchRef}
        defaultValue={bareIngredient}
        onKeyDown={(e) => textFieldSearch(e)}
        variant="outlined"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={(_e, checked) => ignoreIngredient(checked)}
            checked={product && product.ignore}
          ></Checkbox>
        }
        label="Ignore ingredient"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={(_e, checked) => notAvailableIngredient(checked)}
            checked={product && product.notAvailable}
          ></Checkbox>
        }
        label="Not available"
      />
      <Grid item xs={12}>
        {products.length === 0 ? (
          <Typography color="secondary" style={{ paddingTop: 20 }}>
            No products found
          </Typography>
        ) : (
          <GridList
            cols={3}
            cellHeight="auto"
            style={{ maxHeight: '78vh', overflow: 'auto' }}
          >
            {products.map((item) => (
              <GridListTile key={item.id} xs={4}>
                <MuiButton
                  color="primary"
                  onClick={() => selectProduct(item)}
                  style={{
                    textTransform: 'none',
                    border: product.id === item.id ? '2px solid' : ''
                  }}
                  title={item.title}
                >
                  <div>
                    <img
                      src={
                        item.images.length > 0 ? item.images[0].url : undefined
                      }
                      alt={item.title}
                    />
                    <Link
                      href={`https://www.ah.nl${item.link}`}
                      target="_blank"
                    >
                      {item.title} ({item.price.unitSize}) €
                      {item.price.now.toFixed(2)}
                    </Link>
                  </div>
                </MuiButton>
              </GridListTile>
            ))}
          </GridList>
        )}
      </Grid>
    </Grid>
  )
}

ProductSearch.propTypes = {
  selectedIngredient: PropTypes.object.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired,
  searchProducts: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired
}
