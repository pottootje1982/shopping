import React, { useState, useEffect } from "react"
import server from "./server"
import {
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
  Fab
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import Recipe from "./Recipe"

export default function RecipeList({ setRecipeTitle }) {
  const [selectedRecipes] = useState(() => [])
  let [recipes, setRecipes] = useState([])
  let [_, setRecipeReadyToOrder] = useState()
  let [selectedRecipe, setSelectedRecipe] = useState()

  function selectedFirstRecipe() {
    server.get("recipes").then(function(result) {
      recipes = result.data
      setRecipes(recipes)
      if (recipes.length > 0) {
        const recipe = recipes[0]
        selectRecipe(undefined, recipe.uid)
      }
    })
  }

  useEffect(selectedFirstRecipe, [])

  function selectRecipe(_button, id) {
    const selectedRecipe = recipes.find(r => r.uid === id)
    setSelectedRecipe(selectedRecipe)
    setRecipeTitle(selectedRecipe.name)
    setRecipeReadyToOrder(
      selectedRecipe.ingredients.length ===
        Object.keys(selectedRecipe.mappings || {}).length
    )
  }

  function toggleRecipe(checked, uid) {
    if (checked) {
      selectedRecipes.push(uid)
    } else {
      selectedRecipes.splice(selectedRecipes.indexOf(uid), 1)
    }
  }

  function order() {
    server.post("products/order", { recipes: selectedRecipes })
  }

  function addRecipe() {
    setSelectedRecipe()
  }

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }}>
      <Grid container item xs={3}>
        <div>
          <Button
            color="secondary"
            variant="contained"
            style={{
              margin: 5,
              textTransform: "none"
            }}
            onClick={order}
          >
            Order
          </Button>
          <Fab
            color="secondary"
            aria-label="add"
            size="small"
            onClick={addRecipe}
          >
            <AddIcon />
          </Fab>
        </div>
        <Grid item xs={12} style={{ minHeight: "75vh" }}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List dense={true} style={{ maxHeight: "75vh", overflow: "auto" }}>
              {recipes.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  divider={true}
                  selected={(selectedRecipe || {}).uid === item.uid}
                  onClick={e => selectRecipe(e, item.uid)}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      onChange={(e, checked) => toggleRecipe(checked, item.uid)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    style={{
                      color:
                        item.ingredients.length ===
                        Object.keys(item.mappings || {}).length
                          ? green[600]
                          : "black"
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      <Recipe
        key={(selectedRecipe || {}).uid}
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
      />
    </Grid>
  )
}
