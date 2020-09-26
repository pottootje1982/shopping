import React, { useState, useEffect } from "react"
import server from "../server"
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import DeleteIcon from "@material-ui/icons/Delete"

import Recipe from "../recipe"
import OrderDialog from "./OrderDialog"
import RecipeTable from "./recipe-table"
import { Fab } from "../styled"
import getDateString from "../date"
import NoTokenDialog from "./no-token-dialog"
import ConfirmationDialog from "./confirmation-dialog"
import { getCookie } from "../../cookie"

const DEBUG = process.env.NODE_ENV === "development"

export default function RecipeCollection({ setRecipeTitle }) {
  let [selectedRecipes, setSelectedRecipes] = useState(() => [])
  let [recipes, setRecipes] = useState([])
  let [, setRecipeReadyToOrder] = useState()
  let [selectedRecipe, setSelectedRecipe] = useState()
  const [selectedOrder, setSelectedOrder] = useState("")
  const [orders, setOrders] = useState()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categoryRecipes, setCategoryRecipes] = useState()
  const [categories, setCategories] = useState()
  const [open, setOpen] = useState(false)
  const [deletionDialogOpen, setDeletionDialogOpen] = useState(false)
  const [noTokenOpen, setNoTokenOpen] = useState(false)

  function selectedFirstRecipe() {
    if (!DEBUG) {
      server.get("recipes").then(initialize)
    } else {
      const db = require("./stub/db.test.json")
      const result = { data: { ...db } }
      initialize(result)
    }
  }

  function initialize(result) {
    const data = result.data
    recipes = data.recipes
    setRecipes(recipes)
    if (recipes.length > 0) {
      const recipe = recipes[0]
      setSelectedRecipe(recipe)
      if (!DEBUG) sync()
    }
    setOrders(data.orders.sort((a, b) => b.date.localeCompare(a.date)))
    setCategories(data.categories)
  }

  useEffect(selectedFirstRecipe, [])

  useEffect(selectRecipe, [selectedRecipe])

  useEffect(() => {
    setCategoryRecipes(
      recipes.filter(
        (r) => !r.categories || r.categories.includes(selectedCategory.uid)
      )
    )
  }, [selectedCategory, recipes])

  function selectRecipe() {
    if (!selectedRecipe) return
    setRecipeTitle(selectedRecipe.name)
    setRecipeReadyToOrder(
      selectedRecipe.parsedIngredients.length ===
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
      const ah_token = getCookie("ah_token") || ""
      const { data } = await server.post(
        "orders/",
        {
          recipes: selectedRecipes,
        },
        { headers: { ah_token } }
      )
      let message = data.failed
        ? `Following items were not ordered: ${data.failed}`
        : "All products were successfully ordered"
      message = data.error
        ? `Error when ordering recipes: ${data.error}`
        : message
      alert(message)
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

  function addRecipe() {
    const created = getDateString()
    setSelectedRecipe({
      parsedIngredients: [],
      mappings: [],
      created,
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

  function showOrderDialog() {
    /*if (!localStorage.getItem("ah_token")) {
      setNoTokenOpen(true)
    } else*/ if (
      selectedRecipes.length === 0
    ) {
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

  const { name } = selectedRecipe || {}

  return recipes === undefined ? (
    <div>Loading</div>
  ) : (
    <Grid container spacing={1} style={{ padding: 10 }} alignItems="flex-start">
      <Grid container item xs={4} spacing={1}>
        <Fab onClick={showOrderDialog}>
          <ShoppingCartIcon />
        </Fab>
        <Fab onClick={addRecipe}>
          <AddIcon />
        </Fab>
        <Fab
          onClick={() => setDeletionDialogOpen(true)}
          disabled={!selectedRecipe}
        >
          <DeleteIcon />
        </Fab>
        <ConfirmationDialog
          dialogOpen={deletionDialogOpen}
          setDialogOpen={setDeletionDialogOpen}
          title={"Remove recipe"}
          message={`Are you sure you want to remove ${name}`}
          onOk={removeRecipe}
        />
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
          <DeleteIcon />
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
          <RecipeTable
            recipes={
              (selectedOrder && selectedOrder.recipes) ||
              (selectedCategory && categoryRecipes) ||
              recipes
            }
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
