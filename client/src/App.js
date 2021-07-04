import React, { useState, useEffect } from "react"
import "./App.css"
import RecipeCollection from "./Components/collection"
import { Grid, Typography } from "@material-ui/core"
import { ReactComponent as Hat } from "./hat.svg"
import blue from "@material-ui/core/colors/blue"
import { useCookies } from "react-cookie"
import { RecipeProvider } from "./Components/collection/RecipeProvider"

export default function App() {
  const [recipeTitle, setRecipeTitle] = useState()
  const [, , removeCookie] = useCookies(["HAS_SHOPPING_EXTENSION"])

  useEffect(() => removeCookie("HAS_SHOPPING_EXTENSION"), [removeCookie])

  return (
    <div className="App">
      <div className="App-header">
        <div style={{ display: "table", clear: "both" }}></div>
        <Grid container alignItems="center" spacing={1}>
          <Grid item container xs={3}>
            <Grid item>
              <Typography variant="h4" style={{ padding: 15, color: blue[50] }}>
                Lazy chef
              </Typography>
            </Grid>
            <Grid item>
              <Hat style={{ width: 60, height: 60 }}></Hat>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" style={{ color: blue[50] }}>
              {recipeTitle}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>

      <RecipeProvider>
        <RecipeCollection setRecipeTitle={setRecipeTitle}></RecipeCollection>
      </RecipeProvider>
    </div>
  )
}
