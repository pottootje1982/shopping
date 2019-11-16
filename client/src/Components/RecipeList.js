import React, { useState, useEffect } from "react"
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
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import Recipe from "./Recipe"
import { Button, Fab } from "./Styled"
import getDateString from "./date"

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
        setSelectedRecipe(recipe)
      }
    })
  }

  useEffect(selectedFirstRecipe, [])

  useEffect(selectRecipe, [selectedRecipe])

  function selectRecipe() {
    if (!selectedRecipe) return
    setRecipeTitle(selectedRecipe.name)
    setRecipeReadyToOrder(
      selectedRecipe.ingredients.length ===
        Object.keys(selectedRecipe.mappings || {}).length
    )
    if (!recipes.includes(selectedRecipe)) {
      const index = recipes.indexOf(
        recipes.find(r => r.uid === selectedRecipe.uid)
      )
      const newRecipes = [...recipes]
      if (index >= 0) {
        // edit
        newRecipes.splice(index, 1, selectedRecipe)
      } else {
        // add
        newRecipes.push(selectedRecipe)
      }
      setRecipes(newRecipes)
    }
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
    const created = getDateString()
    setSelectedRecipe({
      ingredients: [],
      mappings: [],
      created
    })
  }

  function removeRecipe() {
    if (recipes.length > 0) {
      server.delete("recipes", { data: selectedRecipe })
      const index = recipes.indexOf(selectedRecipe)
      const newRecipes = [...recipes]
      newRecipes.splice(index, 1)
      setRecipes(newRecipes)
      const newIndex = Math.min(index, newRecipes.length - 1)
      setSelectedRecipe(newRecipes[newIndex])
    }
  }

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }}>
      <Grid container item xs={3}>
        <div>
          <Button onClick={order}>Order</Button>
          <Fab onClick={addRecipe}>
            <AddIcon />
          </Fab>
          <Fab color="secondary" size="small" onClick={removeRecipe}>
            <DeleteIcon />
          </Fab>
        </div>
        <Grid item xs={12} style={{ minHeight: "75vh" }}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List dense={true} style={{ maxHeight: "75vh", overflow: "auto" }}>
              {recipes.map((item, index) => (
                <ListItem
                  button
                  key={`${item.created}_${item.name}`}
                  divider={true}
                  selected={(selectedRecipe || {}).uid === item.uid}
                  onClick={() => setSelectedRecipe(item)}
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
      {selectedRecipe ? (
        <Recipe
          key={selectedRecipe.uid}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
        />
      ) : null}
    </Grid>
  )
}
