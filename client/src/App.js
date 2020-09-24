import React, { useState } from "react"
import "./App.css"
import RecipeCollection from "./Components/collection"
import { Grid, Typography } from "@material-ui/core"
import { ReactComponent as Hat } from "./hat.svg"
import blue from "@material-ui/core/colors/blue"

function App() {
  const [recipeTitle, setRecipeTitle] = useState()

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ display: "table", clear: "both" }}></div>
        <Grid container justify="center" spacing={3}>
          <Grid item>
            <Typography
              variant="h3"
              style={{ paddingTop: 20, color: blue[50] }}
            >
              Lazy chef
            </Typography>
          </Grid>
          <Grid item>
            <Hat style={{ width: 80, height: 80 }}></Hat>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>
            <Typography variant="h6" style={{ color: blue[50] }}>
              {recipeTitle}
            </Typography>
          </Grid>
        </Grid>
      </div>

      <RecipeCollection setRecipeTitle={setRecipeTitle}></RecipeCollection>
    </div>
  )
}

export default App
