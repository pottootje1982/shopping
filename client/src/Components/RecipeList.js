import React, { useState, useEffect } from "react"
import server from "./server"
import { Grid } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import DeleteIcon from "@material-ui/icons/Delete"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import Recipe from "./Recipe"
import { Button, Fab } from "./Styled"
import getDateString from "./date"
import MaterialTable from "material-table"

export default function RecipeList({ setRecipeTitle }) {
  let [selectedRecipes, setSelectedRecipes] = useState(() => [])
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

  function onSelectionChange(selRecipes) {
    setSelectedRecipes(selRecipes)
  }

  function order() {
    server.post("products/order", { recipes: selectedRecipes.map(r => r.uid) })
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

  function clickRow(_event, row) {
    const recipe = recipes.find(r => r.uid === row.uid)
    setSelectedRecipe(recipe)
  }

  const columns = [
    { field: "uid", hidden: true },
    {
      title: "Name",
      field: "name",
      cellStyle: {
        maxHeight: 10
      }
    },
    { title: "Created", field: "created", type: "date" }
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
        <Grid item xs={12}>
          <MaterialTable
            dense={true}
            onRowClick={clickRow}
            title="Recipes"
            style={{ maxHeight: "75vh", minHeight: "75vh", overflow: "auto" }}
            columns={columns}
            data={recipes}
            onSelectionChange={onSelectionChange}
            options={{
              pageSize: 7,
              pageSizeOptions: [7, 14, 28],
              selection: true,
              rowStyle: rowData => ({
                maxHeight: 10,
                backgroundColor: rowData.ingredients.every(
                  i => rowData.mappings[i.ingredient] !== undefined
                )
                  ? green[100]
                  : blue[50]
              })
            }}
          ></MaterialTable>
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
