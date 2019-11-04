import React, { Fragment, useEffect, useState } from "react"
import {
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core"
import ProductSearch from "./ProductSearch"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import server from "./server"

export default function Recipe(props) {
  const ingredients = props.ingredients
  const recipes = props.recipes
  const setIngredients = props.setIngredients
  const recipeId = props.recipeId

  let [products, setProducts] = useState([])
  let [selectedIngredient, setSelectedIngredient] = useState()
  let [mappings, setMappings] = useState({})

  const productInfo = ingredients.map(
    i => mappings[i.ingredient.toLowerCase()] || {}
  )

  useEffect(() => {
    if (ingredients.length > 0) {
      setSelectedIngredient(ingredients[0])
    }
    if (recipeId) {
      server
        .get(`products/mappings?uid=${recipeId}`)
        .then(function(mappingsResponse) {
          setMappings(mappingsResponse.data)
        })
    }
  }, [ingredients, recipeId])

  async function search(item, customSearch) {
    const query = customSearch ? customSearch : item.ingredient
    const searchResponse = await server.get(
      `products?query=${query}&full=${selectedIngredient.ingredient}`
    )
    let products = searchResponse.data
    setProducts(products)
  }

  async function translate(uid) {
    const recipe = recipes.find(r => r.uid === uid)
    const res = await server.post("recipes/translate", { recipeId: uid })
    setIngredients(res.data.ingredients)
    recipe.ingredients = ingredients
  }

  return (
    <Fragment>
      <Grid item xs={3}>
        <div
          style={{
            alignItems: "left",
            justifyContent: "left"
          }}
        >
          <Grid item>
            <Paper style={{ backgroundColor: blue[50] }}>
              <List dense>
                {(ingredients || []).map((item, i) => (
                  <ListItem
                    divider={true}
                    button
                    key={i}
                    onClick={e => setSelectedIngredient(item)}
                  >
                    <ListItemText
                      key={i}
                      secondary={
                        <Typography
                          variant="subtitle2"
                          style={{ color: green[500], fontSize: 9 }}
                        >
                          {(productInfo[i] || {}).title}
                        </Typography>
                      }
                    >
                      {item.full}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
          <Button
            color="secondary"
            variant="contained"
            style={{
              margin: 5,
              textTransform: "none"
            }}
            onClick={e => translate(recipeId)}
          >
            Translate
          </Button>
        </div>
      </Grid>

      {selectedIngredient ? (
        <ProductSearch
          products={products}
          selectedIngredient={selectedIngredient}
          search={search}
          recipeId={recipeId}
          mappings={mappings}
          setMappings={setMappings}
        />
      ) : null}
    </Fragment>
  )
}
