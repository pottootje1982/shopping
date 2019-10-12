import React from 'react'
import { Grid, Paper, List, ListItem, ListItemText } from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'

export default class Recipe extends React.Component {
  render() {
    return (
      <Grid item xs={3}>
        <Paper style={{ backgroundColor: blue[50] }}>
          <List dense>
            {this.props.ingredients.map((item, i) => (
              <ListItem
                button
                key={i}
                onClick={e => this.props.handleSearch(item.ingredient)}
              >
                <ListItemText key={i}>{item.full}</ListItemText>
              </ListItem>
            ))}
            <br />
            <br />
            <ListItem button onClick={this.addToShoppingList}>
              Add to AH shopping
            </ListItem>
          </List>
        </Paper>
      </Grid>
    )
  }
}
