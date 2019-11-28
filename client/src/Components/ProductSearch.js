import server from "./server"
import React, { useEffect, useRef } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Button as MuiButton
} from "@material-ui/core"
import { Button } from "./Styled"

const styles = makeStyles(theme => ({
  input: {
    height: 36,
    marginRight: 4,
    marginTop: 3
  }
}))

export default function ProductSearch({
  selectedIngredient,
  selectedRecipe,
  setSelectedRecipe,
  searchProducts,
  products
}) {
  const classes = styles()
  const searchRef = useRef(null)
  const mappings = selectedRecipe.mappings
  const bareIngredient = selectedIngredient.ingredient
  const product = mappings[bareIngredient] || {}

  useEffect(doSearch, [selectedIngredient])

  function doSearch() {
    searchProducts(selectedIngredient)
  }

  function selectProduct(completeProduct) {
    const { id, title, price, ignore } = completeProduct
    const product = { id, title, price, ignore }
    mappings[bareIngredient] = product
    setSelectedRecipe({ ...selectedRecipe, mappings })

    server.post("products/choose", {
      ingredient: bareIngredient,
      product: product
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
      {bareIngredient.split(" ").map(item => (
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
        onKeyDown={e => textFieldSearch(e)}
        variant="outlined"
      />
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            onChange={(_e, checked) => ignoreIngredient(checked)}
            checked={product.ignore}
          ></Checkbox>
        }
        label="Ignore ingredient"
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
            style={{ maxHeight: "75vh", overflow: "auto" }}
          >
            {products.map((item, i) => (
              <GridListTile key={item.id} xs={4}>
                <MuiButton
                  color="primary"
                  onClick={() => selectProduct(item)}
                  style={{
                    textTransform: "none",
                    border:
                      (mappings[bareIngredient] || {}).id === item.id
                        ? "2px solid"
                        : ""
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
                    <div>
                      {item.title} ({item.price.unitSize}) €
                      {item.price.now.toFixed(2)}
                    </div>
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
