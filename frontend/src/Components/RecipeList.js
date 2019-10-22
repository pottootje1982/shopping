import React, { useState } from "react"
import server from "./server"
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox
} from "@material-ui/core"
import blue from "@material-ui/core/colors/blue"
import Recipe from "./Recipe"
import ProductSearch from "./ProductSearch"

let firstRun = true

export default function RecipeList(props) {
  let [recipes, setRecipes] = useState([])
  let [products, setProducts] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState({})
  let [ingredients, setIngredients] = useState([])
  let selectedRecipe = {}
  let [recipeId, setRecipeId] = useState()
  let [selectedIngredient, setSelectedIngredient] = useState(undefined)
  props.setSelectedRecipes(selectedRecipes)

  async function selectedFirstRecipe() {
    const result = await server.get("recipes")
    recipes = result.data
    setRecipes(recipes)
    if (recipes.length > 0) {
      const recipe = recipes[0]
      selectRecipe(undefined, recipe.uid)
    }
  }

  if (firstRun) {
    selectedFirstRecipe()
    firstRun = false
  }

  function selectRecipe(_button, id) {
    recipeId = id
    setRecipeId(id)
    selectedRecipe = recipes.find(r => r.uid === id)
    ingredients = selectedRecipe.ingredients
    setIngredients(ingredients)
    if (ingredients.length > 0) {
      setSelectedIngredient(ingredients[0])
    }
  }

  async function search(item, customSearch) {
    const query = customSearch ? customSearch : item.ingredient
    if (item) {
      setSelectedIngredient(item)
    }
    const searchResponse = await server.get(`products?query=${query}`)
    setProducts(searchResponse.data)
  }

  function toggleRecipe(uid) {
    selectedRecipes[uid] = !selectedRecipes[uid]
    setSelectedRecipes(selectedRecipes)
  }

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }}>
      <Grid item xs={3}>
        <Paper style={{ backgroundColor: blue[50] }}>
          <List dense={true} style={{ maxHeight: "80vh", overflow: "auto" }}>
            {recipes.map((item, index) => (
              <ListItem button key={index} divider={true}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    onChange={e => toggleRecipe(item.uid)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  onClick={e => selectRecipe(e, item.uid)}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      {ingredients ? (
        <Recipe
          recipeId={recipeId}
          ingredients={ingredients}
          search={search}
          recipes={recipes}
          setIngredients={setIngredients}
        />
      ) : null}

      {selectedIngredient ? (
        <ProductSearch
          products={products}
          selectedIngredient={selectedIngredient}
          search={search}
          recipeId={recipeId}
        />
      ) : null}
    </Grid>
  )
}
