import React, { Fragment, useEffect, useState, useRef, useContext } from 'react'
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  IconButton
} from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import TranslateIcon from '@material-ui/icons/Translate'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart'
import ProductSearch from '../shopping-results'
import EditAddRecipe from './edit-add-recipe'
import { blue, green, grey } from '@material-ui/core/colors'
import server from '../server'
import { Fab } from '../styled'
import RecipeContext from '../collection/RecipeProvider'

export default function Recipe() {
  const [products, setProducts] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState()
  const [editOrAddRecipe, setEditOrAddRecipe] = useState()
  const listRef = useRef(null)

  const { selectedRecipe, setSelectedRecipe } = useContext(RecipeContext)

  const { uid: recipeId, parsedIngredients: ingredients } = selectedRecipe

  const addRecipe = !recipeId

  useEffect(addMouseWheel, [])

  function addMouseWheel() {
    if (listRef.current) {
      listRef.current.addEventListener('mousewheel', listWheel, {
        passive: false
      })
    }
    return removeMouseWheel
  }

  function removeMouseWheel() {
    if (listRef.current) {
      listRef.current.removeEventListener('mousewheel', listWheel, {
        passive: false
      })
    }
  }

  useEffect(() => {
    setEditOrAddRecipe(addRecipe)
    if (ingredients.length > 0 && !selectedIngredient) {
      setSelectedIngredient(ingredients[0])
    }
  }, [selectedRecipe, ingredients, addRecipe, selectedIngredient])

  useEffect(() => {
    if (!selectedIngredient || ingredients?.indexOf(selectedIngredient) >= 0)
      return
    const ing = ingredients.find(
      (i) => i.ingredient === selectedIngredient?.ingredient
    )
    const index = ingredients.indexOf(ing)
    ingredients.splice(index, 1, selectedIngredient)
    setSelectedRecipe((r) => ({ ...r, parsedIngredients: ingredients }))
  }, [selectedIngredient])

  async function search(item, customSearch) {
    const query = customSearch || item.ingredient
    const searchResponse = await server.get(
      `products?query=${query}&full=${selectedIngredient.ingredient}`
    )
    const products = searchResponse.data
    setProducts(products)
  }

  async function translate(uid) {
    const res = await server.post('recipes/translate', { recipeId: uid })
    const ingredientIndex = ingredients.indexOf(selectedIngredient)
    const recipe = res.data.recipe
    setSelectedRecipe(recipe)
    setSelectedIngredient(recipe.parsedIngredients[ingredientIndex])
  }

  function editRecipeClick() {
    setEditOrAddRecipe(true)
  }

  function onAdjustQuantity(product, event) {
    const target = event.target
    const value = parseInt(target.value)
    product.quantity = value
    setSelectedRecipe({ ...selectedRecipe })
  }

  function onAdjustQuantityWheel(product, event) {
    const target = event.target
    let value = parseInt(target.value)
    if (event.deltaY < 0) {
      value = value + 1
    } else {
      value = Math.max(value - 1, 0)
    }
    target.value = value
    product.quantity = value
    setSelectedRecipe({ ...selectedRecipe })
  }

  function order(item) {
    document.cookie = `order=${JSON.stringify([{ ...item, quantity: 1 }])}`
  }

  function listWheel(e) {
    const { clientX, clientY } = e
    const focusedElement = document.elementFromPoint(clientX, clientY)
    if (focusedElement.nodeName === 'INPUT') {
      e.preventDefault(true)
    }
  }

  return (
    <Fragment>
      <Grid container item xs={2} spacing={1}>
        <Fab onClick={(e) => translate(recipeId)}>
          <TranslateIcon />
        </Fab>
        <Fab onClick={editRecipeClick}>
          <EditIcon />
        </Fab>
        <Grid item xs={12} style={{ minHeight: '75vh' }}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List
              ref={listRef}
              dense
              style={{ maxHeight: '78vh', overflow: 'auto' }}
            >
              {ingredients.map(
                (
                  {
                    ignore,
                    notAvailable,
                    ingredient,
                    full,
                    quantity,
                    product: { title, quantity: orderedQuantity } = {},
                    product
                  },
                  i
                ) => (
                  <ListItem
                    divider={true}
                    button
                    selected={ingredient === selectedIngredient}
                    key={i}
                    onClick={() => setSelectedIngredient(ingredients[i])}
                    style={{
                      backgroundColor:
                        orderedQuantity &&
                        orderedQuantity !== quantity &&
                        blue[200]
                    }}
                  >
                    <ListItemText
                      key={i}
                      primary={
                        <Typography
                          style={{
                            color:
                              ignore || notAvailable ? grey[500] : undefined
                          }}
                        >
                          {full}
                        </Typography>
                      }
                      secondary={
                        !ignore && !notAvailable ? (
                          <Typography
                            variant="subtitle2"
                            style={{ color: green[500], fontSize: 9 }}
                          >
                            {title}
                          </Typography>
                        ) : null
                      }
                    ></ListItemText>
                    <TextField
                      type="number"
                      defaultValue={orderedQuantity || quantity}
                      inputProps={{
                        min: 0,
                        max: 99,
                        step: 1
                      }}
                      style={{ width: 40, height: 40 }}
                      onChange={(e) => onAdjustQuantity(product, e)}
                      onWheel={(e) => onAdjustQuantityWheel(product, e)}
                    />
                    <IconButton
                      onClick={(e) => order(product)}
                      style={{
                        marginRight: -20,
                        marginTop: -20,
                        marginBottom: -20,
                        transform: 'scale(.7)'
                      }}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                  </ListItem>
                )
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {editOrAddRecipe ? (
        <EditAddRecipe
          key={selectedRecipe.name}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          setEditOrAddRecipe={setEditOrAddRecipe}
        />
      ) : selectedIngredient ? (
        <ProductSearch
          key={selectedIngredient}
          setSelectedIngredient={setSelectedIngredient}
          products={products}
          selectedIngredient={selectedIngredient}
          searchProducts={search}
        />
      ) : null}
    </Fragment>
  )
}
