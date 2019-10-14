import React from 'react'
import server from './server'
import { Grid, Paper, List, ListItem, ListItemText } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import Recipe from './Recipe'
import ProductSearch from './ProductSearch'

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { recipes: [], ingredients: [], products: [] }
    this.handleClick = this.handleClick.bind(this)
    this.addToShoppingList = this.addToShoppingList.bind(this)
    this.search = this.search.bind(this)
  }

  async componentDidMount() {
    var resp = await server.get('recipes')
    const recipes = resp.data
    this.setState({ recipes })
    if (recipes.length > 0) {
      await this.handleClick(undefined, recipes[0].uid)
    }
    const ingredients = this.state.ingredients
    if (ingredients.length > 0) {
      this.search(ingredients[0].ingredient)
    }
  }

  handleClick(_button, recipeId) {
    const selectedRecipe = this.state.recipes.find(r => r.uid === recipeId)
    const ingredients = selectedRecipe.ingredients
    const recipeName = selectedRecipe.name
    this.setState({ ingredients, recipeName, recipeId })
  }

  async addToShoppingList() {
    const ingredients = this.state.ingredients

    await server.post('add-to-shoppinglist', {
      name: this.state.recipeName,
      ingredients: ingredients.map(name => ({ name }))
    })
  }

  async search(ingredient) {
    const searchResponse = await server.get(`search?query=${ingredient}`)
    const recipeId = this.state.recipeId
    let mappings
    if (recipeId) {
      const mappingsResponse = await server.get(`mappings?uid=${recipeId}`)
      mappings = mappingsResponse.data
    }
    this.setState({
      products: searchResponse.data,
      selectedIngredient: ingredient,
      mappings
    })
  }

  render() {
    let selectedIngredient = this.state.selectedIngredient
    selectedIngredient = selectedIngredient && selectedIngredient.toLowerCase()
    return (
      <div>
        {this.state.recipes === undefined ? (
          <div>Loading</div>
        ) : (
          <Grid container spacing={1} style={{ padding: 10 }}>
            <Grid item xs={3}>
              <Paper style={{ backgroundColor: blue[50] }}>
                <List dense={true}>
                  {this.state.recipes.map((item, index) => (
                    <ListItem button key={index} divider={true}>
                      <ListItemText
                        primary={item.name}
                        onClick={e => this.handleClick(e, item.uid)}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Recipe
              ingredients={this.state.ingredients}
              handleSearch={this.search}
            />
            <ProductSearch
              products={this.state.products}
              selectedIngredient={selectedIngredient}
              mappings={this.state.mappings || {}}
            />
          </Grid>
        )}
      </div>
    )
  }
}
