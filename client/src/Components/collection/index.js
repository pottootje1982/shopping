import React, { useState, useEffect, useContext } from 'react'
import server from '../server'
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core'
import { ShoppingCart, Delete } from '@material-ui/icons'
import PropTypes from 'prop-types'

import Recipe from '../recipe'
import OrderDialog from './OrderDialog'
import RecipeTable from './recipe-table'
import { Fab } from '../styled'
import NoTokenDialog from './no-token-dialog'
import { getCookie } from '../../cookie.js'
import RecipeContext from './RecipeProvider'

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
    supermarket
  } = useContext(RecipeContext)
  const [orders, setOrders] = useState()
  const [categories, setCategories] = useState()
  const [open, setOpen] = useState(false)
  const [noTokenOpen, setNoTokenOpen] = useState(false)

  function selectedFirstRecipe() {
    server.get(`recipes?supermarket=${supermarket?.key}`).then(initialize)
  }

  function initialize(result) {
    const data = result.data
    const recipes = data.recipes
    setRecipes(recipes)
    if (recipes.length > 0) {
      const recipe = recipes[0]
      setSelectedRecipe(recipe)
      sync()
    }
    setSelectedOrder()
    setSelectedCategory()
    setOrders(data.orders)
    setCategories(data.categories)
  }

  function createOrder(recipes) {
    const items = recipes.map((r) =>
      r.parsedIngredients.filter((i) => i.product)
    )
    return []
      .concat(...items)
      .map(({ product: { id }, quantity }) => ({ id, quantity }))
      .filter((item) => item.id)
  }

  useEffect(selectedFirstRecipe, [])
  useEffect(selectedFirstRecipe, [supermarket])
  useEffect(selectRecipe, [selectedRecipe])

  function selectRecipe() {
    if (!selectedRecipe) return
    setRecipeTitle(selectedRecipe.name)
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

    if (isOk && event.nativeEvent.key !== 'Escape') {
      try {
        const order = createOrder(selectedRecipes)
        if (supermarket === 'ah') {
          document.cookie = `order=${JSON.stringify(order)}`
        }
        const { data: newOrder } =
          (await server.post(`orders?supermarket=${supermarket.key}`, {
            recipes: selectedRecipes
          })) || {}
        if (newOrder) setOrders((orders) => [...orders, newOrder])
      } catch (err) {
        console.log(err)
        alert(err.response.data)
      }
    }
  }

  function selectOrder(event) {
    setSelectedCategory()
    setSelectedOrder(event.target.value)
  }

  function selectCategory(event) {
    setSelectedOrder()
    setSelectedCategory(event.target.value)
  }

  async function sync() {
    const res = await server.get(`recipes/sync?supermarket=${supermarket.key}`)
    const recipes = res.data
    if (recipes && recipes !== '') {
      setRecipes(recipes)
    }
  }

  function showOrderDialog() {
    if (supermarket.key === 'ah' && !getCookie('HAS_SHOPPING_EXTENSION'))
      setNoTokenOpen(true)
    else if (selectedRecipes.length === 0) {
      alert('Please select recipes before ordering')
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

  const sortedOrders =
    orders?.sort((a, b) => b.date.localeCompare(a.date)) || []

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
            value={selectedOrder || ''}
            style={{ marginLeft: 5 }}
          >
            <MenuItem key="Orders" value="">
              <em>None</em>
            </MenuItem>
            {sortedOrders.map((order) => (
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
            value={selectedCategory || ''}
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
      {selectedRecipe ? <Recipe key={selectedRecipe.uid} /> : null}
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

RecipeCollection.propTypes = {
  setRecipeTitle: PropTypes.func.isRequired
}
