import React from "react"
import "./App.css"
import RecipeList from "./Components/RecipeList"
import { Button } from "@material-ui/core"
import server from "./Components/server"

function App() {
  let selectedRecipes

  function order() {
    server.post("products/order", { recipes: Object.keys(selectedRecipes) })
  }

  function setSelectedRecipes(selRecipes) {
    selectedRecipes = selRecipes
  }

  return (
    <div className="App">
      <div className="App-header">
        <header>
          <p>Shopper</p>
        </header>
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
      </div>

      <RecipeList setSelectedRecipes={setSelectedRecipes}></RecipeList>
    </div>
  )
}

export default App
