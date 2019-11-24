import React, { useState, useEffect } from "react"
import server from "./server"
import { Grid, Paper } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import Recipe from "./Recipe"
import { Button, Fab } from "./Styled"
import getDateString from "./date"
import MaterialTable from "material-table"

export default function RecipeList({ setRecipeTitle }) {
  const [selectedRecipes] = useState(() => [])
  let [recipes, setRecipes] = useState([])
  let [, setRecipeReadyToOrder] = useState()
  let [selectedRecipe, setSelectedRecipe] = useState()

  function selectedFirstRecipe() {
    server.get("recipes").then(function(result) {
      recipes = result.data
      setRecipes(recipes)
      if (recipes.length > 0) {
        const recipe = recipes[0]
        setSelectedRecipe(recipe)
        sync()
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
      } else if (selectedRecipe.uid) {
        // add
        newRecipes.push(selectedRecipe)
      }
      setRecipes(newRecipes)
    }
  }

  async function toggleRecipe(event, checked, uid) {
    event.stopPropagation()
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

  async function sync() {
    const res = await server.get("recipes/sync")
    const recipes = res.data
    if (recipes && recipes !== "") {
      setRecipes(recipes)
    }
  }

  function clickRow(event, row) {
    const recipe = recipes.find(r => r.uid === row.uid)
    setSelectedRecipe(recipe)
  }

  const columns = [
    { field: "uid", hidden: true },
    { field: "selected", type: "boolean", editable: "always" },
    { field: "name" },
    { field: "created" }
  ]

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }} alignItems="flex-start">
      <Grid container item xs={4}>
        <div>
          <Button onClick={order}>Order</Button>
          <Fab onClick={addRecipe}>
            <AddIcon />
          </Fab>
          <Fab onClick={removeRecipe}>
            <DeleteIcon />
          </Fab>
        </div>
        <Grid item xs={12} style={{ minHeight: "75vh" }}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <MaterialTable
              dense={true}
              onRowClick={clickRow}
              title="Recipes"
              style={{ maxHeight: "75vh", overflow: "auto" }}
              columns={columns}
              data={recipes}
              options={{ pageSize: 7 }}
            ></MaterialTable>
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
