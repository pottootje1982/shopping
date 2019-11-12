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
import EditAddRecipe from "./EditAddRecipe"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import server from "./server"

export default function Recipe({ selectedRecipe, setSelectedRecipe }) {
  let [products, setProducts] = useState([])
  let [selectedIngredient, setSelectedIngredient] = useState()
  let [editRecipe, setEditRecipe] = useState(false)

  const recipeId = selectedRecipe.uid
  const mappings = selectedRecipe.mappings
  const ingredients = selectedRecipe.ingredients

  const productInfo = ingredients.map(
    i => mappings[i.ingredient.toLowerCase()] || {}
  )

  useEffect(() => {
    setEditRecipe(false)
    const ingredients = selectedRecipe.ingredients
    if (selectedRecipe.ingredients.length > 0) {
      setSelectedIngredient(ingredients[0])
    }
  }, [selectedRecipe])

  async function search(item, customSearch) {
    const query = customSearch ? customSearch : item.ingredient
    const searchResponse = await server.get(
      `products?query=${query}&full=${selectedIngredient.ingredient}`
    )
    let products = searchResponse.data
    setProducts(products)
  }

  async function translate(uid) {
    const res = await server.post("recipes/translate", { recipeId: uid })
    setSelectedRecipe(res.data.recipe)
  }

  function editRecipeClick() {
    setEditRecipe(true)
  }

  return (
    <Fragment>
      <Grid container item xs={3}>
        <div>
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
          <Button
            color="secondary"
            variant="contained"
            style={{
              margin: 5,
              textTransform: "none"
            }}
            onClick={editRecipeClick}
          >
            Edit Recipe
          </Button>
        </div>
        <Grid item xs={12} style={{ minHeight: "75vh" }}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List dense style={{ maxHeight: "75vh", overflow: "auto" }}>
              {(ingredients || []).map((item, i) => (
                <ListItem
                  divider={true}
                  button
                  selected={item === selectedIngredient}
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
                        {productInfo[i].quantity} {productInfo[i].title}
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
      </Grid>

      {editRecipe && selectedRecipe ? (
        <EditAddRecipe selectedRecipe={selectedRecipe} />
      ) : selectedIngredient ? (
        <ProductSearch
          products={products}
          selectedIngredient={selectedIngredient}
          searchProducts={search}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
        />
      ) : null}
    </Fragment>
  )
}
