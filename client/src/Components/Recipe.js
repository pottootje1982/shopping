import React, { Fragment, useEffect, useState } from "react"
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import ProductSearch from "./ProductSearch"
import EditAddRecipe from "./EditAddRecipe"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import grey from "@material-ui/core/colors/grey"
import server from "./server"
import { Button, Fab } from "./Styled"

export default function Recipe({ selectedRecipe, setSelectedRecipe }) {
  let [products, setProducts] = useState([])
  let [selectedIngredient, setSelectedIngredient] = useState()
  let [editOrAddRecipe, setEditOrAddRecipe] = useState()
  const addRecipe = selectedRecipe.uid === undefined

  const recipeId = selectedRecipe.uid
  const mappings = selectedRecipe.mappings
  const ingredients = selectedRecipe.ingredients

  const productInfo = ingredients.map(
    i => mappings[i.ingredient.toLowerCase()] || {}
  )

  useEffect(() => {
    setEditOrAddRecipe(addRecipe)
    if (ingredients.length > 0) {
      setSelectedIngredient(ingredients[0])
    }
  }, [selectedRecipe, ingredients, addRecipe])

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
    setEditOrAddRecipe(true)
  }

  return (
    <Fragment>
      <Grid container item xs={2}>
        <div>
          <Button onClick={e => translate(recipeId)}>Translate</Button>
          <Fab onClick={editRecipeClick}>
            <EditIcon />
          </Fab>
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
                    primary={
                      <Typography
                        style={{
                          color: productInfo[i].ignore ? grey[500] : undefined
                        }}
                      >
                        {item.full}
                      </Typography>
                    }
                    secondary={
                      !productInfo[i].ignore ? (
                        <Typography
                          variant="subtitle2"
                          style={{ color: green[500], fontSize: 9 }}
                        >
                          {productInfo[i].quantity} {productInfo[i].title}
                        </Typography>
                      ) : null
                    }
                  ></ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {editOrAddRecipe ? (
        <EditAddRecipe
          key={selectedRecipe.name}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          setEditOrAddRecipe={setEditOrAddRecipe}
        />
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
