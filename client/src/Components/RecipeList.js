import React, { useState, useEffect } from "react"
import server from "./server"
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import DeleteIcon from "@material-ui/icons/Delete"

import Recipe from "./Recipe"
import Recipes from "./Recipes"
import { Fab } from "./Styled"
import getDateString from "./date"

export default function RecipeList({ setRecipeTitle }) {
  let [selectedRecipes, setSelectedRecipes] = useState(() => [])
  let [recipes, setRecipes] = useState([])
  let [, setRecipeReadyToOrder] = useState()
  let [selectedRecipe, setSelectedRecipe] = useState()
  const [selectedOrder, setSelectedOrder] = useState("")
  const [orders, setOrders] = useState()

  function selectedFirstRecipe() {
    server.get("recipes").then(function(result) {
      const data = result.data
      recipes = data.recipes
      setRecipes(recipes)
      if (recipes.length > 0) {
        const recipe = recipes[0]
        setSelectedRecipe(recipe)
        sync()
      }
      setOrders(data.orders)
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

  async function order() {
    const { data } = await server.post("orders/", {
      recipes: selectedRecipes
    })
    let message = data.failed
      ? `Following items were not ordered: ${data.failed}`
      : "All products were successfully ordered"
    message = data.error
      ? `Error when ordering recipes: ${data.error}`
      : message
    alert(message)
  }

  function selectOrder(event) {
    setSelectedOrder(event.target.value)
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

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }} alignItems="flex-start">
      <Grid container item xs={4} spacing={1}>
        <Fab onClick={order}>
          <ShoppingCartIcon />
        </Fab>
        <Fab onClick={addRecipe}>
          <AddIcon />
        </Fab>
        <Fab onClick={removeRecipe}>
          <DeleteIcon />
        </Fab>
        <FormControl style={{ minWidth: 200 }} variant="filled">
          <InputLabel id="demo-simple-select-label">Orders</InputLabel>
          <Select onChange={selectOrder} value={selectedOrder}>
            <MenuItem key="Orders" value="">
              Orders
            </MenuItem>
            {(orders || []).map(order => (
              <MenuItem key={order.date} value={order}>
                {order.date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid item xs={12}>
          <Recipes
            recipes={(selectedOrder && selectedOrder.recipes) || recipes}
            setRecipes={setRecipes}
            setSelectedRecipe={setSelectedRecipe}
            setSelectedRecipes={setSelectedRecipes}
          />
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
