import React, { useState } from "react"
import "./App.css"
import RecipeList from "./Components/RecipeList"
import { Button, Grid, Typography } from "@material-ui/core"
import server from "./Components/server"

function App() {
  let selectedRecipes
  const [recipeTitle, setRecipeTitle] = useState()

  function order() {
    server.post("products/order", { recipes: Object.keys(selectedRecipes) })
  }

  function setSelectedRecipes(selRecipes) {
    selectedRecipes = selRecipes
  }

  return (
    <div className="App">
      <div className="App-header">
        <Typography variant="h3" style={{ paddingTop: 30 }}>
          Shopper
        </Typography>
        <Grid container spacing={1} style={{ padding: 10 }}>
          <Grid item xs={3}>
            <div style={{ textAlign: "left" }}>
              <Button
                variant="contained"
                color="secondary"
                onClick={order}
                style={{
                  margin: 5,
                  textTransform: "none"
                }}
              >
                Order
              </Button>
            </div>
          </Grid>
          <Grid item xs={3}>
            <Typography variant="h6">{recipeTitle}</Typography>
          </Grid>
        </Grid>
      </div>

      <RecipeList
        setSelectedRecipes={setSelectedRecipes}
        setRecipeTitle={setRecipeTitle}
      ></RecipeList>
    </div>
  )
}

export default App
