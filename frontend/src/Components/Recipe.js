import React from 'react'
import server from './server'
import {
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core'
import blue from '@material-ui/core/colors/blue'

export default function render(props) {
  function translate() {
    server.post('translate')
  }

  function addToShoppingList() {}

  return (
    <Grid item xs={3}>
      <Paper style={{ backgroundColor: blue[50] }}>
        <Button onClick={{}}></Button>
        <List dense>
          {props.ingredients.map((item, i) => (
            <ListItem
              divider={true}
              button
              key={i}
              onClick={e => props.handleSearch(item.ingredient)}
            >
              <ListItemText key={i}>{item.full}</ListItemText>
            </ListItem>
          ))}
          <br />
          <br />
          <ListItem button onClick={addToShoppingList}>
            Add to AH shopping
          </ListItem>
        </List>
      </Paper>
    </Grid>
  )
}
