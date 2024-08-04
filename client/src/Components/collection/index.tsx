import React, { useState, useEffect, useContext, useCallback } from 'react'
import {
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@material-ui/core'
import { ShoppingCart, Delete } from '@material-ui/icons'

import RecipeComponent from '../recipe'
import OrderDialog from './OrderDialog'
import RecipeTable from './recipe-table'
import { Fab } from '../styled'
import NoTokenDialog from './no-token-dialog'
import RecipeContext, { Recipe, Order, Category } from './RecipeProvider'
import * as R from 'ramda'
import ServerContext from '../../server-context'
import { getCookie } from '../../cookie'

interface RecipeCollectionProps {
  setRecipeTitle: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface SupermarketResponse {
  recipes: Recipe[]
  orders: Order[]
  categories: Category[]
}

export default function RecipeCollection({
  setRecipeTitle
}: RecipeCollectionProps) {
  const { server } = useContext(ServerContext)
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
  const [orders, setOrders] = useState<Order[]>()
  const [categories, setCategories] = useState<Category[]>()
  const [open, setOpen] = useState(false)
  const [noTokenOpen, setNoTokenOpen] = useState(false)
  const [clearSelection, setClearSelection] = useState({})

  const sync = useCallback(async () => {
    try {
      const res = await server().get(
        `recipes/sync?supermarket=${supermarket?.key}`
      )
      const recipes = res.data
      if (recipes && recipes !== '') {
        setRecipes(recipes)
      }
    } catch (error) {
      console.warn('Syncing recipes failed, are you signed in?')
    }
  }, [server, setRecipes, supermarket])

  const initialize = useCallback(
    ({ recipes, orders, categories }: SupermarketResponse) => {
      setRecipes(recipes)
      if (recipes.length > 0) {
        const recipe = recipes[0]
        setSelectedRecipe(recipe)
        sync()
      }
      setSelectedOrder(undefined)
      setSelectedCategory(undefined)
      setOrders(orders)
      setCategories(categories)
    },
    [
      setRecipes,
      setSelectedRecipe,
      setSelectedOrder,
      setSelectedCategory,
      setOrders,
      setCategories,
      sync
    ]
  )

  const selectedFirstRecipe = useCallback(() => {
    server()
      .get(`recipes?supermarket=${supermarket?.key}`)
      .then(({ data }: { data: SupermarketResponse }) => initialize(data))
  }, [initialize, server, supermarket])

  function createOrder(recipes: Recipe[]) {
    const items = recipes.map((r) =>
      (r.parsedIngredients ?? []).filter((i) => i.product)
    )
    return R.flatten(items)
      .map(({ product: { id }, quantity }) => ({ id, quantity }))
      .filter((item) => item.id)
  }

  useEffect(selectedFirstRecipe, [selectedFirstRecipe])
  useEffect(selectedFirstRecipe, [supermarket, selectedFirstRecipe])
  useEffect(selectRecipe, [
    selectedRecipe,
    recipes,
    setRecipes,
    selectedRecipes,
    setRecipeTitle
  ])

  function selectRecipe() {
    if (!selectedRecipe) return
    setRecipeTitle(selectedRecipe.name)
    if (!recipes.includes(selectedRecipe)) {
      const index = recipes.findIndex((r) => r.uid === selectedRecipe.uid)
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

  async function closeOrderDialog(e: object, isOk: boolean) {
    const event = e as React.KeyboardEvent<Element>
    setOpen(false)

    if (isOk && event.nativeEvent.key !== 'Escape') {
      try {
        const order = createOrder(selectedRecipes)
        if (supermarket?.key === 'ah') {
          document.cookie = `order=${JSON.stringify(order)}`
        }
        const { data: newOrder } =
          (await server().post(`orders?supermarket=${supermarket?.key}`, {
            recipes: selectedRecipes
          })) || {}
        if (newOrder) {
          setOrders((orders) => [...(orders ?? []), newOrder])
          setClearSelection({})
        }
      } catch (e: unknown) {
        const err = e as { response: { data: string } }
        alert(err.response.data)
      }
    }
  }

  function selectOrder(
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) {
    setSelectedCategory()
    const order = orders?.find((o) => o.date === event.target.value)
    setSelectedOrder(order)
  }

  function selectCategory(
    event: React.ChangeEvent<{ name?: string | undefined; value: unknown }>
  ) {
    setSelectedOrder()
    const category = categories?.find((c) => c.name === event.target.value)
    setSelectedCategory(category)
  }

  function showOrderDialog() {
    if (supermarket?.key === 'ah' && !getCookie('HAS_SHOPPING_EXTENSION'))
      setNoTokenOpen(true)
    else if (selectedRecipes.length === 0) {
      alert('Please select recipes before ordering')
    } else setOpen(true)
  }

  function deleteOrder() {
    if (recipes.length > 0 && selectedOrder && orders) {
      server().delete(`orders/${selectedOrder._id}`)
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
            value={selectedOrder?.title ?? ''}
            style={{ marginLeft: 5 }}
          >
            <MenuItem key="Orders" value="">
              <em>None</em>
            </MenuItem>
            {sortedOrders.map((order) => (
              <MenuItem key={order.date} value={order.title}>
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
              <MenuItem key={category.name} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid item xs={12}>
          <RecipeTable clearSelection={clearSelection} />
        </Grid>
      </Grid>
      {selectedRecipe ? <RecipeComponent key={selectedRecipe.uid} /> : null}
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
