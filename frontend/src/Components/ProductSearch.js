import server from "./server"
import React, { useState, useEffect, useRef } from "react"
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Button
} from "@material-ui/core"

export default function ProductSearch(props) {
  const recipeId = props.recipeId
  const selectedIngredient = props.selectedIngredient
  const bareIngredient = (selectedIngredient.ingredient || "").toLowerCase()
  let [mappings, setMappings] = useState({})
  const textFieldRef = useRef(null)

  useEffect(() => {
    initMappings()
  }, [selectedIngredient])

  async function initMappings() {
    if (recipeId) {
      server
        .get(`products/mappings?uid=${recipeId}`)
        .then(function(mappingsResponse) {
          setMappings(mappingsResponse.data)
        })
    }
    props.search(selectedIngredient)
    textFieldRef.current.value = bareIngredient
  }

  function selectProduct(productId) {
    mappings[bareIngredient].id = productId
    setMappings(mappings)

    server.post("products/choose", {
      ingredient: bareIngredient,
      product: productId
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
              onClick={() => selectProduct(item.id)}
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
                <div>{item.title}</div>
              </div>
            </Button>
          </GridListTile>
        ))}
      </GridList>
    </Grid>
  )
}
