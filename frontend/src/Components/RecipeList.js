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
import blue from "@material-ui/core/colors/blue"
import Recipe from "./Recipe"

export default function RecipeList(props) {
  let [recipes, setRecipes] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState({})
  let [recipeId, setRecipeId] = useState()
  props.setSelectedRecipes(selectedRecipes)

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
    recipeId = id
    setRecipeId(id)
    const selectedRecipe = recipes.find(r => r.uid === id)
    props.setRecipeTitle(selectedRecipe.name)
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
              <ListItem
                button
                key={index}
                divider={true}
                selected={recipeId === item.uid}
                onClick={e => selectRecipe(e, item.uid)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    onChange={e => toggleRecipe(item.uid)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Grid>
      {recipeId ? <Recipe recipeId={recipeId} recipes={recipes} /> : null}
    </Grid>
  )
}
