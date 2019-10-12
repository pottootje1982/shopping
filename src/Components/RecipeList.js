import React from 'react'
import axios from 'axios'
import { Grid, Paper, List, ListItem, ListItemText } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'
import Recipe from './Recipe'
import ProductSearch from './ProductSearch'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { recipes: [], ingredients: [], products: [] }
    this.handleClick = this.handleClick.bind(this)
    this.addToShoppingList = this.addToShoppingList.bind(this)
    this.search = this.search.bind(this)
  }

  async componentDidMount() {
    var resp = await axios.get('recipes')
    const recipes = resp.data
    this.setState({ recipes })
    if (recipes.length > 0) {
      this.handleClick(undefined, recipes[0].uid)
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
    console.log(recipeName)
    this.setState({ ingredients, recipeName })
  }

  async addToShoppingList() {
    const ingredients = this.state.ingredients

    await axios.post('add-to-shoppinglist', {
      name: this.state.recipeName,
      ingredients: ingredients.map(name => ({ name }))
    })
  }

  async search(product) {
    var resp = await axios.get(`search?query=${product}`)
    console.log(resp)
    this.setState({ products: resp.data, selectedProduct: product })
  }

  render() {
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
                    <ListItem button key={index}>
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
              selectedProduct={this.state.selectedProduct}
            />
          </Grid>
        )}
      </div>
    )
  }
}
