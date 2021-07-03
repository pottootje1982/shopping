import React, { useState, useEffect, useContext } from "react"
import server from "../server"
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core"
import { ShoppingCart, Delete } from "@material-ui/icons"

import Recipe from "../recipe"
import OrderDialog from "./OrderDialog"
import RecipeTable from "./recipe-table"
import { Fab } from "../styled"
import NoTokenDialog from "./no-token-dialog"
import { getCookie } from "../../cookie.js"
import RecipeContext from "./RecipeProvider"

const MOCK_DATA = process.env.REACT_APP_USE_MOCK_DATA === "true"

export default function RecipeCollection({ setRecipeTitle }) {
  const {
    recipes,
    setRecipes,
    selectedRecipes,
    selectedRecipe,
    setSelectedRecipe,
    selectedOrder,
    setSelectedOrder,
    selectedCategory,
    setSelectedCategory,
  } = useContext(RecipeContext)
  const [, setRecipeReadyToOrder] = useState()
  const [orders, setOrders] = useState()
  const [categories, setCategories] = useState()
  const [open, setOpen] = useState(false)
  const [noTokenOpen, setNoTokenOpen] = useState(false)

  function selectedFirstRecipe() {
    if (!MOCK_DATA) {
      server.get("recipes").then(initialize)
    } else {
      const db = require("./stub/db.test.json")
      const result = { data: { ...db } }
      initialize(result)
    }
  }

  function initialize(result) {
    const data = result.data
    const recipes = data.recipes
    setRecipes(recipes)
    if (recipes.length > 0) {
      const recipe = recipes[0]
      setSelectedRecipe(recipe)
      if (!MOCK_DATA) sync()
    }
    setOrders(data.orders.sort((a, b) => b.date.localeCompare(a.date)))
    setCategories(data.categories)
  }

  function createOrder(recipes) {
    const items = recipes.map((r) => r.mappings).map((m) => Object.values(m))
    return []
      .concat(...items)
      .filter((i) => i.id)
      .map(({ id, quantity }) => ({ id, quantity }))
  }

  useEffect(selectedFirstRecipe, [])

  useEffect(selectRecipe, [selectedRecipe])

  function selectRecipe() {
    if (!selectedRecipe) return
    setRecipeTitle(selectedRecipe.name)
    setRecipeReadyToOrder(
      selectedRecipe.parsedIngredients?.length ===
        Object.keys(selectedRecipe.mappings || {}).length
    )
    if (!recipes.includes(selectedRecipe)) {
      const index = recipes.indexOf(
        recipes.find((r) => r.uid === selectedRecipe.uid)
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

  async function closeOrderDialog(event, isOk) {
    setOpen(false)

    if (isOk && event.nativeEvent.key !== "Escape") {
      try {
        const order = createOrder(selectedRecipes)
        document.cookie = `order=${JSON.stringify(order)}`
        server.post("orders/", { recipes: selectedRecipes })
      } catch (err) {
        alert(err.response.data)
      }
    }
  }

  function selectOrder(event) {
    setSelectedCategory("")
    setSelectedOrder(event.target.value)
  }

  function selectCategory(event) {
    setSelectedOrder("")
    setSelectedCategory(event.target.value)
  }

  async function sync() {
    const res = await server.get("recipes/sync")
    const recipes = res.data
    if (recipes && recipes !== "") {
      setRecipes(recipes)
    }
  }

  function showOrderDialog() {
    if (!getCookie("HAS_SHOPPING_EXTENSION")) setNoTokenOpen(true)
    else if (selectedRecipes.length === 0) {
      alert("Please select recipes before ordering")
      return
    } else setOpen(true)
  }

  function deleteOrder() {
    if (recipes.length > 0 && selectedOrder) {
      server.delete(`orders/${selectedOrder._id}`)
      const index = orders.indexOf(selectedOrder)
      orders.splice(index, 1)
      setOrders([...orders])
      const newIndex = Math.min(index, orders.length - 1)
      setSelectedOrder(orders[newIndex])
    }
  }

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }} alignItems="flex-start">
      <Grid container item xs={4} spacing={1}>
        <Fab onClick={showOrderDialog}>
          <ShoppingCart />
        </Fab>
        <FormControl
          style={{ minWidth: 100, marginTop: -7 }}
          hiddenLabel
          margin="dense"
        >
          <InputLabel id="demo-simple-select-label">Orders</InputLabel>

          <Select
            onChange={selectOrder}
            value={selectedOrder}
            style={{ marginLeft: 5 }}
          >
            <MenuItem key="Orders" value="">
              <em>None</em>
            </MenuItem>
            {(orders || []).map((order) => (
              <MenuItem key={order.date} value={order}>
                {order.date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Fab onClick={deleteOrder}>
          <Delete />
        </Fab>

        <FormControl
          style={{ minWidth: 150, marginTop: -7 }}
          hiddenLabel
          margin="dense"
        >
          <InputLabel id="demo-simple-select-label">Categories</InputLabel>
          <Select
            onChange={selectCategory}
            value={selectedCategory}
            style={{ marginLeft: 5 }}
          >
            <MenuItem key="Categories" value="">
              <em>None</em>
            </MenuItem>
            {(categories || []).map((category) => (
              <MenuItem key={category.name} value={category}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid item xs={12}>
          <RecipeTable />
        </Grid>
      </Grid>
      {selectedRecipe ? (
        <Recipe
          key={selectedRecipe.uid}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
        />
      ) : null}
      <OrderDialog
        open={open}
        handleClose={closeOrderDialog}
        selectedRecipes={selectedRecipes}
      />
      <NoTokenDialog
        dialogOpen={noTokenOpen}
        setDialogOpen={setNoTokenOpen}
      ></NoTokenDialog>
    </Grid>
  )
}
