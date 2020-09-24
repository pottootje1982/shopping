import React, { Fragment, useEffect, useState, useRef } from "react"
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  IconButton,
} from "@material-ui/core"
import EditIcon from "@material-ui/icons/Edit"
import TranslateIcon from "@material-ui/icons/Translate"
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart"
import ProductSearch from "./ProductSearch"
import EditAddRecipe from "./EditAddRecipe"
import blue from "@material-ui/core/colors/blue"
import green from "@material-ui/core/colors/green"
import grey from "@material-ui/core/colors/grey"
import server from "./server"
import { Fab } from "./Styled"

export default function Recipe({ selectedRecipe, setSelectedRecipe }) {
  const [products, setProducts] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState()
  const [editOrAddRecipe, setEditOrAddRecipe] = useState()
  const addRecipe = selectedRecipe.uid === undefined
  const listRef = useRef(null)

  const recipeId = selectedRecipe.uid
  const mappings = selectedRecipe.mappings
  const ingredients = selectedRecipe.parsedIngredients

  const productInfo = ingredients.map(
    (i) => (mappings && mappings[i.ingredient]) || {}
  )

  useEffect(addMouseWheel, [])

  function addMouseWheel() {
    listRef.current.addEventListener("mousewheel", listWheel, {
      passive: false,
    })
    return removeMouseWheel
  }

  function removeMouseWheel() {
    listRef.current.removeEventListener("mousewheel", listWheel, {
      passive: false,
    })
  }

  useEffect(() => {
    setEditOrAddRecipe(addRecipe)
    if (ingredients.length > 0 && !selectedIngredient) {
      setSelectedIngredient(ingredients[0])
    }
  }, [selectedRecipe, ingredients, addRecipe, selectedIngredient])

  async function search(item, customSearch) {
    const query = customSearch ? customSearch : item.ingredient
    const searchResponse = await server.get(
      `products?query=${query}&full=${selectedIngredient.ingredient}`
    )
    let products = searchResponse.data
    setProducts(products)
  }

  async function translate(uid) {
    const res = await server.post("recipes/translate", { recipeId: uid })
    const ingredientIndex = ingredients.indexOf(selectedIngredient)
    const recipe = res.data.recipe
    setSelectedRecipe(recipe)
    setSelectedIngredient(recipe.parsedIngredients[ingredientIndex])
  }

  function editRecipeClick() {
    setEditOrAddRecipe(true)
  }

  function onAdjustQuantity(productInfo, event) {
    const target = event.target
    const value = parseInt(target.value)
    productInfo.quantity = value
    setSelectedRecipe({ ...selectedRecipe })
  }

  function onAdjustQuantityWheel(productInfo, event) {
    const target = event.target
    let value = parseInt(target.value)
    if (event.deltaY < 0) {
      value = value + 1
    } else {
      value = Math.max(value - 1, 0)
    }
    target.value = value
    productInfo.quantity = value
    setSelectedRecipe({ ...selectedRecipe })
  }

  function order(item) {
    server.post("orders/product", { items: [item] })
  }

  function listWheel(e) {
    const { clientX, clientY } = e
    const focusedElement = document.elementFromPoint(clientX, clientY)
    if (focusedElement.nodeName === "INPUT") {
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
        <Grid item xs={12} style={{ minHeight: "75vh" }}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List
              ref={listRef}
              dense
              style={{ maxHeight: "75vh", overflow: "auto" }}
            >
              {(ingredients || []).map((item, i) => (
                <ListItem
                  divider={true}
                  button
                  selected={item === selectedIngredient}
                  key={i}
                  onClick={(e) => setSelectedIngredient(item)}
                >
                  <ListItemText
                    key={i}
                    primary={
                      <Typography
                        style={{
                          color:
                            productInfo[i].ignore || productInfo[i].notAvailable
                              ? grey[500]
                              : undefined,
                        }}
                      >
                        {item.full}
                      </Typography>
                    }
                    secondary={
                      !productInfo[i].ignore && !productInfo[i].notAvailable ? (
                        <Typography
                          variant="subtitle2"
                          style={{ color: green[500], fontSize: 9 }}
                        >
                          {productInfo[i].title}
                        </Typography>
                      ) : null
                    }
                  ></ListItemText>
                  <TextField
                    type="number"
                    defaultValue={productInfo[i].quantity}
                    inputProps={{
                      min: 0,
                      max: 99,
                      step: 1,
                    }}
                    style={{ width: 40, height: 40 }}
                    onChange={(e) => onAdjustQuantity(productInfo[i], e)}
                    onWheel={(e) => onAdjustQuantityWheel(productInfo[i], e)}
                  />
                  <IconButton
                    onClick={(e) => order(productInfo[i])}
                    style={{
                      marginRight: -20,
                      marginTop: -20,
                      marginBottom: -20,
                      transform: "scale(.7)",
                    }}
                  >
                    <ShoppingCartIcon />
                  </IconButton>
                </ListItem>
              ))}
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
          products={products}
          selectedIngredient={selectedIngredient}
          searchProducts={search}
          selectedRecipe={selectedRecipe}
          setSelectedRecipe={setSelectedRecipe}
        />
      ) : null}
    </Fragment>
  )
}
