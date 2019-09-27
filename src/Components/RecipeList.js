import React from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Link from '@material-ui/core/Link'

axios.defaults.baseURL = 'http://localhost:4000'
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest'

export default class RecipeList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { recipes: [], ingredients: [] }
    this.handleClick = this.handleClick.bind(this)
  }

  async componentDidMount() {
    var resp = await axios.get('recipes')
    this.setState({ recipes: resp.data })
    console.log(this.state)
  }

  handleClick(_button, recipeId) {
    const selectedRecipe = this.state.recipes.find(r => r.uid === recipeId)
    const ingredients = selectedRecipe.ingredients.split('\n')
    this.setState({ ingredients })
  }

  render() {
    return (
      <div>
        {this.state.recipes === undefined ? (
          <div>Loading</div>
        ) : (
          <Grid container spacing={5} style={{ padding: 10 }}>
            <Grid item xs={6}>
              <Grid
                container
                spacing={1}
                direction="column"
                alignItems="flex-start"
              >
                {this.state.recipes.map(item => (
                  <Grid item key={item.uid}>
                    <div key={item.uid}>
                      <Button
                        key={item.uid}
                        variant="outlined"
                        color="primary"
                        onClick={e => this.handleClick(e, item.uid)}
                      >
                        {item.name}
                      </Button>
                      <br />
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Paper>
                <Grid container direction="column" alignItems="flex-start">
                  {this.state.ingredients.map((item, i) => (
                    <div key={i}>
                      <Link key={i}>{item}</Link>
                      <br />
                    </div>
                  ))}
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}
      </div>
    )
  }
}
