import React, { useState, useEffect } from 'react'
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

export default function Recipe(props) {
  const ingredients = props.ingredients
  
  function addToShoppingList() {}

  return (
    <Grid item xs={3}>
      <div style={{
                  alignItems:'left',
                  justifyContent: 'left'
                }}>
        <Grid item>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List dense>
              {(ingredients || []).map((item, i) => (
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
        <Button color="secondary" 
                variant="contained"
                style={{
                  margin: 2,
                  textTransform: 'none'
                }}
                onClick={e=>props.translate(props.selectedRecipe)}>Translate</Button>
      </div>
    </Grid>
  )
}
