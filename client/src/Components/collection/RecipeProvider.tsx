import { useState, createContext, useEffect } from 'react'
import PropTypes from 'prop-types'

type RecipeContextType = {
  recipes: any[]
  setRecipes: (value: any[]) => void
  selectedRecipes: any[]
  setSelectedRecipes: (value: any[]) => void
  selectedRecipe: any
  setSelectedRecipe: (value: any) => void
  selectedOrder: any
  setSelectedOrder: (value: any) => void
  selectedCategory: any
  setSelectedCategory: (value: any) => void
  supermarket: any
  setSupermarket: (value: any) => void
  supermarkets: any[]
}

const RecipeContext = createContext({} as RecipeContextType)

export default RecipeContext

const supermarkets = [
  { key: 'ah', name: 'AH' },
  { key: 'picnic', name: 'Picnic' }
]

export function RecipeProvider(props: any) {
  const supermarketKey = localStorage.getItem('supermarket')
  const [recipes, setRecipes] = useState([])
  const [selectedRecipes, setSelectedRecipes] = useState(() => [])
  const [selectedRecipe, setSelectedRecipe] = useState()
  const [selectedOrder, setSelectedOrder] = useState()
  const [selectedCategory, setSelectedCategory] = useState()
  const [supermarket, setSupermarket] = useState(
    supermarkets.find((s) => s.key === supermarketKey) || supermarkets[0]
  )

  useEffect(
    () => localStorage.setItem('supermarket', supermarket.key),
    [supermarket]
  )

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
    setSelectedCategory,
    supermarket,
    setSupermarket,
    supermarkets
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
