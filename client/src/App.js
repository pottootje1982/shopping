import React, { useState } from "react"
import "./App.css"
import RecipeList from "./Components/RecipeList"
import { Grid, Typography } from "@material-ui/core"

function App() {
  const [recipeTitle, setRecipeTitle] = useState()

  return (
    <div className="App">
      <div className="App-header">
        <Typography variant="h3" style={{ paddingTop: 20 }}>
          Lazy chef
        </Typography>
        <Grid container spacing={1} style={{ padding: 10 }}>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>
            <Typography variant="h6">{recipeTitle}</Typography>
          </Grid>
        </Grid>
      </div>

      <RecipeList setRecipeTitle={setRecipeTitle}></RecipeList>
    </div>
  )
}

export default App
