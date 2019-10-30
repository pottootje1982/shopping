import React, { Fragment, useEffect, useState } from "react"
import {
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core"
import ProductSearch from "./ProductSearch"
import blue from "@material-ui/core/colors/blue"
import server from "./server"

export default function Recipe(props) {
  const ingredients = props.ingredients
  const recipes = props.recipes
  const setIngredients = props.setIngredients
  const recipeId = props.recipeId

  let [products, setProducts] = useState([])
  let [selectedIngredient, setSelectedIngredient] = useState()
  let [mappings, setMappings] = useState()

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
    if (item) {
      setSelectedIngredient(item)
    }
    const searchResponse = await server.get(`products?query=${query}`)
    setProducts(searchResponse.data)
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
                    onClick={e => search(item)}
                  >
                    <ListItemText key={i}>{item.full}</ListItemText>
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

      {selectedIngredient && mappings ? (
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
