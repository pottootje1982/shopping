import server from "./server"
import React, { useEffect, useRef } from "react"
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Button
} from "@material-ui/core"

export default function ProductSearch(props) {
  const selectedIngredient = props.selectedIngredient
  const bareIngredient = (selectedIngredient.ingredient || "").toLowerCase()
  const textFieldRef = useRef(null)
  const setMappings = props.setMappings
  const mappings = props.mappings

  useEffect(doSearch, [selectedIngredient])

  function doSearch() {
    props.search(selectedIngredient)
    textFieldRef.current.value = bareIngredient
  }

  function selectProduct(completeProduct) {
    const { id, title, price } = completeProduct
    const product = { id, title, price }
    setMappings({ ...mappings, [bareIngredient]: product })

    server.post("products/choose", {
      ingredient: bareIngredient,
      product: product
    })
  }

  function textFieldSearch(event) {
    if (event.keyCode === 13) {
      props.search(undefined, event.target.value)
    }
  }

  function search(value) {
    props.search(undefined, value)
    textFieldRef.current.value = value
  }

  return (
    <Grid item xs={6}>
      <div>
        {bareIngredient.split(" ").map(item => (
          <Button
            key={item}
            variant="contained"
            color="secondary"
            onClick={() => search(item)}
            style={{
              margin: 2,
              height: 54,
              textTransform: "none"
            }}
          >
            {item}
          </Button>
        ))}
        <TextField
          inputRef={textFieldRef}
          style={{ margin: 2 }}
          defaultValue={bareIngredient}
          onKeyDown={e => textFieldSearch(e)}
          variant="outlined"
        />
      </div>

      <GridList cols={3} cellHeight="auto">
        {props.products.map((item, i) => (
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
                  src={item.images.length > 0 ? item.images[0].url : undefined}
                  alt={item.title}
                />
                <div>
                  {item.title} €{item.price.now.toFixed(2)}
                </div>
              </div>
            </Button>
          </GridListTile>
        ))}
      </GridList>
    </Grid>
  )
}
