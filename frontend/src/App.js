import React from 'react'
import './App.css'
import RecipeList from './Components/RecipeList'
import {
  Button,
} from '@material-ui/core'

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <header>
          <p>Shopper</p>
        </header>
        <Button variant='contained' 
                color='secondary' 
                
                style={{
                  margin: 2,
                  textTransform: 'none'
                }} >Order</Button>
      </div>

      <RecipeList></RecipeList>
    </div>
  )
}

export default App
