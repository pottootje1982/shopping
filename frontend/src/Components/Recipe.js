import React from "react"
import {
  Button,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core"
import blue from "@material-ui/core/colors/blue"
import server from "./server"

export default function Recipe(props) {
  const ingredients = props.ingredients
  const recipes = props.recipes
  const setIngredients = props.setIngredients

  async function translate(uid) {
    const recipe = recipes.find(r => r.uid === uid)
    const res = await server.post("recipes/translate", { recipeId: uid })
    setIngredients(res.data.ingredients)
    recipe.ingredients = ingredients
  }

  return (
    <Grid item xs={3}>
      <div
        style={{
          alignItems: "left",
          justifyContent: "left"
        }}
      >
        <Grid item>
          <Paper style={{ backgroundColor: blue[50] }}>
            <List dense>
              {(ingredients || []).map((item, i) => (
                <ListItem
                  divider={true}
                  button
                  key={i}
                  onClick={e => props.search(item)}
                >
                  <ListItemText key={i}>{item.full}</ListItemText>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        <Button
          color="secondary"
          variant="contained"
          style={{
            margin: 5,
            textTransform: "none"
          }}
          onClick={e => translate(props.recipeId)}
        >
          Translate
        </Button>
      </div>
    </Grid>
  )
}
