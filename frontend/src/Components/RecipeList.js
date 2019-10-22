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
  let [mappings, setMappings] = useState({})
  let [recipeId, setRecipeId] = useState()
  let [fullSelectedIngredient, setFullSelectedIngredient] = useState(undefined)
  let [selectedIngredient, setSelectedIngredient] = useState(undefined)
  props.setSelectedRecipes(selectedRecipes)

  async function selectedFirstRecipe() {
    const result = await server.get("recipes")
    recipes = result.data
    setRecipes(recipes)
    if (recipes.length > 0) {
      selectRecipe(undefined, recipes[0].uid)
      if (ingredients.length > 0) {
        search(ingredients[0].ingredient)
      }
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
  }

  async function search(ingredient, fullSelectedIngr) {
    setSelectedIngredient(ingredient)
    const searchResponse = await server.get(`products?query=${ingredient}`)
    if (recipeId) {
      const mappingsResponse = await server.get(
        `products/mappings?uid=${recipeId}`
      )
      setMappings(mappingsResponse.data)
    }
    setFullSelectedIngredient(fullSelectedIngr || ingredient)
    setProducts(searchResponse.data)
    return products
  }

  function toggleRecipe(uid) {
    selectedRecipes[uid] = !selectedRecipes[uid]
    setSelectedRecipes(selectedRecipes)
  }

  selectedIngredient = selectedIngredient && selectedIngredient.toLowerCase()
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
          selectedRecipe={selectedRecipe.uid}
          ingredients={ingredients}
          handleSearch={search}
          recipes={recipes}
          setIngredients={setIngredients}
        />
      ) : null}

      {selectedIngredient ? (
        <ProductSearch
          products={products}
          selectedIngredient={selectedIngredient}
          searchIngredient={search}
          fullSelectedIngredient={fullSelectedIngredient}
          mappings={mappings}
        />
      ) : null}
    </Grid>
  )
}
