import React, {
  Fragment,
  useEffect,
  useState,
  useRef,
  useContext,
  useCallback
} from 'react'
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
import { Edit, Translate, ShoppingCart } from '@material-ui/icons'
import ProductSearch from '../shopping-results'
import EditAddRecipe from './edit-add-recipe'
import { blue, green, grey } from '@material-ui/core/colors'
import { Fab } from '../styled'
import RecipeContext, {
  Ingredient,
  Product,
  Recipe
} from '../collection/RecipeProvider'
import ServerContext from '../../server-context'

export default function RecipeComponent() {
  const { server } = useContext(ServerContext)
  const [products, setProducts] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient>()
  const [editOrAddRecipe, setEditOrAddRecipe] = useState<boolean>()
  const listRef = useRef<HTMLUListElement>(null)

  const { selectedRecipe, setSelectedRecipe, selectedOrder, supermarket } =
    useContext(RecipeContext)

  const { uid: recipeId, parsedIngredients: ingredients = [] } =
    selectedRecipe || {}

  const ordered = selectedOrder?.recipes?.find((r) => r.uid === recipeId)
  const { parsedIngredients: orderedIngs = [] } = ordered || {}

  const addRecipe = !recipeId

  const removeMouseWheel = useCallback(() => {
    if (listRef.current) {
      listRef.current.removeEventListener('mousewheel', listWheel)
    }
  }, [])

  const addMouseWheel = useCallback(() => {
    if (listRef.current) {
      listRef.current.addEventListener('mousewheel', listWheel, {
        passive: false
      })
    }
    return removeMouseWheel
  }, [removeMouseWheel])

  useEffect(addMouseWheel, [removeMouseWheel, addMouseWheel])

  useEffect(() => {
    setEditOrAddRecipe(addRecipe)
    if (ingredients.length > 0 && !selectedIngredient) {
      setSelectedIngredient(ingredients[0])
    }
  }, [selectedRecipe, ingredients, addRecipe, selectedIngredient])

  useEffect(() => {
    if (!selectedIngredient || ingredients?.indexOf(selectedIngredient) >= 0)
      return
    const index = ingredients.findIndex(
      (i) => i.ingredient === selectedIngredient?.ingredient
    )
    ingredients.splice(index, 1, selectedIngredient)
    setSelectedRecipe((r?: Recipe) =>
      r ? { ...r, parsedIngredients: ingredients } : undefined
    )
  }, [selectedIngredient, ingredients, setSelectedRecipe])

  const search = useCallback(
    async (ing?: Ingredient, customSearch?: string) => {
      const query = customSearch || ing?.ingredient
      const searchResponse = await server().get('products', {
        params: {
          query: query,
          full: selectedIngredient?.ingredient,
          supermarket: supermarket?.key
        }
      })
      const products = searchResponse.data
      setProducts(products)
    },
    [server, supermarket, selectedIngredient]
  )

  async function translate(uid?: string) {
    if (!uid) return
    const res = await server().post('recipes/translate', { recipeId: uid })
    if (!selectedIngredient) return
    const ingredientIndex = ingredients.indexOf(selectedIngredient)
    const recipe = res.data.recipe
    setSelectedRecipe(recipe)
    setSelectedIngredient(recipe.parsedIngredients[ingredientIndex])
  }

  function editRecipeClick() {
    setEditOrAddRecipe(true)
  }

  function onAdjustQuantity(
    ingredient: Ingredient,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (ingredient.product && selectedRecipe) {
      const target = event.currentTarget
      const value = parseInt(target.value)
      ingredient.quantity = value.toString()
      setSelectedRecipe({ ...selectedRecipe })
    }
  }

  function onAdjustQuantityWheel(
    ingredient: Ingredient,
    event: React.WheelEvent<HTMLDivElement>
  ) {
    if (ingredient.product && selectedRecipe) {
      const target = event.currentTarget as HTMLInputElement
      let value = parseInt(target.value)
      if (event.deltaY < 0) {
        value = value + 1
      } else {
        value = Math.max(value - 1, 0)
      }
      target.value = value.toString()
      ingredient.quantity = value.toString()
      setSelectedRecipe({ ...selectedRecipe })
    }
  }

  function order(item: Product) {
    document.cookie = `order=${JSON.stringify([{ ...item, quantity: 1 }])}`
  }

  function listWheel(e: Event) {
    const { clientX, clientY } = e as WheelEvent
    const focusedElement = document.elementFromPoint(clientX, clientY)
    if (focusedElement?.nodeName === 'INPUT') {
      e.preventDefault()
    }
  }

  return (
    <Fragment>
      <Grid container item xs={2} spacing={1}>
        <Fab onClick={() => translate(recipeId)}>
          <Translate />
        </Fab>
        <Fab onClick={editRecipeClick}>
          <Edit />
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
                    ingredient: name,
                    full,
                    quantity,
                    product: { title, ignore, notAvailable } = {},
                    product
                  },
                  i
                ) => {
                  const orderedQuantity = orderedIngs[i]?.quantity
                  const ingredient = ingredients[i]
                  return (
                    <ListItem
                      divider={true}
                      button
                      selected={name === selectedIngredient?.ingredient}
                      key={i}
                      onClick={() => setSelectedIngredient(ingredient)}
                      style={{
                        backgroundColor:
                          orderedQuantity !== undefined &&
                          orderedQuantity !== quantity
                            ? blue[200]
                            : undefined
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
                        defaultValue={
                          orderedQuantity !== undefined
                            ? orderedQuantity
                            : quantity
                        }
                        inputProps={{
                          min: 0,
                          max: 99,
                          step: 1
                        }}
                        style={{ width: 40, height: 40 }}
                        onChange={(e) => onAdjustQuantity(ingredient, e)}
                        onWheel={(e) => onAdjustQuantityWheel(ingredient, e)}
                      />
                      <IconButton
                        onClick={() => order(product)}
                        style={{
                          marginRight: -20,
                          marginTop: -20,
                          marginBottom: -20,
                          transform: 'scale(.7)'
                        }}
                      >
                        <ShoppingCart />
                      </IconButton>
                    </ListItem>
                  )
                }
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {editOrAddRecipe && selectedRecipe ? (
        <EditAddRecipe
          key={selectedRecipe.name}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
          setEditOrAddRecipe={setEditOrAddRecipe}
        />
      ) : selectedIngredient ? (
        <ProductSearch
          key={selectedIngredient.ingredient}
          setSelectedIngredient={setSelectedIngredient}
          products={products}
          selectedIngredient={selectedIngredient}
          searchProducts={search}
        />
      ) : null}
    </Fragment>
  )
}
