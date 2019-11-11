import React, { useState } from "react"
import "./App.css"
import RecipeList from "./Components/RecipeList"
import { Button, Grid, Typography } from "@material-ui/core"
import server from "./Components/server"

function App() {
  const [selectedRecipes] = useState(() => [])
  const [recipeTitle, setRecipeTitle] = useState()

  function order() {
    server.post("products/order", { recipes: selectedRecipes })
  }

  return (
    <div className="App">
      <div className="App-header">
        <Typography variant="h3" style={{ paddingTop: 20 }}>
          Lazy chef
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
        selectedRecipes={selectedRecipes}
        setRecipeTitle={setRecipeTitle}
      ></RecipeList>
    </div>
  )
}

export default App
