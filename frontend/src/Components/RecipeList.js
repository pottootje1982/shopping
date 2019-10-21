import React from "react"
import server from "./server"
import {
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox
} from "@material-ui/core"
import blue from "@material-ui/core/colors/blue"
import Recipe from "./Recipe"
import ProductSearch from "./ProductSearch"

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { recipes: [], products: [], selectedRecipes: {} }
    this.selectRecipe = this.selectRecipe.bind(this)
    props.setSelectedRecipes(this.state.selectedRecipes)
    this.search = this.search.bind(this)
    this.translate = this.translate.bind(this)
  }

  async componentDidMount() {
    var resp = await server.get("recipes")
    const recipes = resp.data
    this.setState({ recipes })
    if (recipes.length > 0) {
      await this.selectRecipe(undefined, recipes[0].uid)
    }
    const ingredients = this.state.ingredients
    if (ingredients.length > 0) {
      this.search(ingredients[0].ingredient)
    }
  }

  selectRecipe(_button, recipeId) {
    const selectedRecipe = this.state.recipes.find(r => r.uid === recipeId)
    const ingredients = selectedRecipe.ingredients
    const recipeName = selectedRecipe.name
    this.setState({ ingredients, recipeName, recipeId, selectedRecipe })
  }

  async search(ingredient, fullSelectedIngredient) {
    this.setState({ selectedIngredient: undefined })
    const searchResponse = await server.get(`products?query=${ingredient}`)
    const recipeId = this.state.recipeId
    let mappings
    if (recipeId) {
      const mappingsResponse = await server.get(
        `products/mappings?uid=${recipeId}`
      )
      mappings = mappingsResponse.data
    }
    fullSelectedIngredient = fullSelectedIngredient || ingredient
    this.setState({
      products: searchResponse.data,
      fullSelectedIngredient,
      selectedIngredient: ingredient,
      mappings
    })
  }

  toggleRecipe(uid) {
    const selectedRecipes = this.state.selectedRecipes
    selectedRecipes[uid] = !selectedRecipes[uid]
    this.setState({ selectedRecipes })
  }

  async translate(uid) {
    const recipes = this.state.recipes
    const recipe = recipes.find(r => r.uid === uid)
    const res = await server.post("recipes/translate", { recipeId: uid })
    const ingredients = res.data.ingredients
    recipe.ingredients = ingredients
    this.setState({ ingredients, recipes })
  }

  render() {
    let selectedIngredient = this.state.selectedIngredient
    const selectedRecipe = this.state.selectedRecipe || {}
    const ingredients = this.state.ingredients
    selectedIngredient = selectedIngredient && selectedIngredient.toLowerCase()
    return this.state.recipes === undefined ? (
      <div>Loading</div>
    ) : (
      <Grid container spacing={1} style={{ padding: 10 }}>
        <Grid item xs={3}>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List dense={true}>
              {this.state.recipes.map((item, index) => (
                <ListItem button key={index} divider={true}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      onChange={e => this.toggleRecipe(item.uid)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    onClick={e => this.selectRecipe(e, item.uid)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        {ingredients ? (
          <Recipe
            translate={this.translate}
            selectedRecipe={selectedRecipe.uid}
            ingredients={this.state.ingredients}
            handleSearch={this.search}
          />
        ) : null}

        {selectedIngredient ? (
          <ProductSearch
            products={this.state.products}
            selectedIngredient={selectedIngredient}
            searchIngredient={this.search}
            fullSelectedIngredient={this.state.fullSelectedIngredient}
            mappings={this.state.mappings || {}}
          />
        ) : null}
      </Grid>
    )
  }
}
