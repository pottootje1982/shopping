import React from 'react'
import axios from 'axios'
import { Grid, Paper, List, ListItem, ListItemText } from '@material-ui/core'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { recipes: [], ingredients: [] }
    this.handleClick = this.handleClick.bind(this)
    this.addToShoppingList = this.addToShoppingList.bind(this)
  }

  async componentDidMount() {
    var resp = await axios.get('recipes')
    this.setState({ recipes: resp.data })
  }

  handleClick(_button, recipeId) {
    const selectedRecipe = this.state.recipes.find(r => r.uid === recipeId)
    const ingredients = selectedRecipe.ingredients.split('\n')
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

  render() {
    return (
      <div>
        {this.state.recipes === undefined ? (
          <div>Loading</div>
        ) : (
          <Grid container spacing={5} style={{ padding: 10 }}>
            <Grid item xs={6}>
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
            </Grid>
            <Grid item xs={6}>
              <Paper>
                <List>
                  {this.state.ingredients.map((item, i) => (
                    <ListItem key={i}>
                      <ListItemText key={i}>{item}</ListItemText>
                    </ListItem>
                  ))}
                  <ListItem button onClick={this.addToShoppingList}>
                    Add to AH shopping
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </div>
    )
  }
}
