import React, { useState, createContext } from 'react'
import PropTypes from 'prop-types'

const RecipeContext = createContext()

export default RecipeContext

export function RecipeProvider(props) {
  const [recipes, setRecipes] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState(() => [])
  const [selectedRecipe, setSelectedRecipe] = useState()
  const [selectedOrder, setSelectedOrder] = useState()
  const [selectedCategory, setSelectedCategory] = useState()

  const values = {
    recipes,
    setRecipes,
    selectedRecipes,
    setSelectedRecipes,
    selectedRecipe,
    setSelectedRecipe,
    selectedOrder,
    setSelectedOrder,
    selectedCategory,
    setSelectedCategory
  }

  return (
    <RecipeContext.Provider value={values}>
      {props.children}
    </RecipeContext.Provider>
  )
}

RecipeProvider.propTypes = {
  children: PropTypes.object.isRequired
}
