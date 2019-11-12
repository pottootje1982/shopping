import server from "./server"
import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Button,
  Typography
} from "@material-ui/core"

const styles = makeStyles(theme => ({
  input: {
    height: 36
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

  const mappings = selectedRecipe.mappings
  const bareIngredient = (selectedIngredient.ingredient || "").toLowerCase()

  useEffect(doSearch, [selectedIngredient])

  function doSearch() {
    searchProducts(selectedIngredient)
  }

  function selectProduct(completeProduct) {
    const { id, title, price } = completeProduct
    const product = { id, title, price }
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
    searchProducts(undefined, value)
  }

  return (
    <Grid container item xs={6} key={bareIngredient} alignItems="stretch">
      <div>
        {bareIngredient.split(" ").map(item => (
          <Button
            key={item}
            variant="contained"
            color="secondary"
            onClick={() => search(item)}
            style={{
              margin: 2,
              textTransform: "none"
            }}
          >
            {item}
          </Button>
        ))}
        <TextField
          style={{ margin: 2 }}
          InputProps={{
            className: classes.input
          }}
          defaultValue={bareIngredient}
          onKeyDown={e => textFieldSearch(e)}
          variant="outlined"
        />
      </div>
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
              <Button
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
              </Button>
            </GridListTile>
          ))}
        </GridList>
      )}
    </Grid>
  )
}
