import server from "./server"
import React, { useState, useEffect } from "react"
import {
  Grid,
  GridList,
  GridListTile,
  TextField,
  Button
} from "@material-ui/core"

export default function ProductSearch(props) {
  const recipeId = props.recipeId
  const bareIngredient = (
    props.selectedIngredient.ingredient || ""
  ).toLowerCase()
  const fullSelectedIngredient = props.selectedIngredient.full || ""
  let [mappings, setMappings] = useState({})

  useEffect(() => {
    initMappings()
  }, [props.selectedIngredient])

  async function initMappings() {
    if (recipeId) {
      server
        .get(`products/mappings?uid=${recipeId}`)
        .then(function(mappingsResponse) {
          setMappings(mappingsResponse.data)
        })
    }
    props.search(props.selectedIngredient)
  }

  function selectProduct(productId) {
    mappings[bareIngredient].id = productId
    setMappings(mappings)

    server.post("products/choose", {
      ingredient: bareIngredient,
      product: productId
    })
  }

  function search(event) {
    if (event.keyCode === 13) {
      props.search(undefined, event.target.value)
    }
  }

  return (
    <Grid item xs={6}>
      <div>
        {fullSelectedIngredient.split(" ").map(item => (
          <Button
            key={item}
            variant="contained"
            color="secondary"
            onClick={() => props.search(item, fullSelectedIngredient)}
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
          style={{ margin: 2 }}
          defaultValue={bareIngredient}
          onKeyDown={e => search(e)}
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
