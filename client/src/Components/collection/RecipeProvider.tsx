import React from 'react'
import { useState, createContext, useEffect } from 'react'

export interface Ingredient {
  full: string
  ingredient: string
  quantity: string
  unit: string
  product: Product
}

export interface Price {
  now: string
  unitSize: string
}

export interface Product {
  id: string
  title: string
  ignore: boolean
  notAvailable: boolean
  price?: Price
  image?: string
  link?: string
}

export interface Recipe {
  uid: string
  id?: string
  name: string
  category?: string
  ingredients: string
  directions?: string
  source_url?: string
  parsedIngredients?: Ingredient[]
  created?: string
  categoryNames?: string[]
}

export interface Order {
  _id: string
  title: string
  recipes: Recipe[]
  ingredients: Ingredient[]
  date: string
}

export interface Category {
  id: string
  uid: string
  name: string
}

export interface Supermarket {
  key: string
  name: string
}

type RecipeContextType = {
  recipes: Recipe[]
  setRecipes: (value: Recipe[]) => void
  selectedRecipes: Recipe[]
  setSelectedRecipes: (value: Recipe[]) => void
  selectedRecipe?: Recipe
  setSelectedRecipe: React.Dispatch<React.SetStateAction<Recipe | undefined>>
  selectedOrder?: Order
  setSelectedOrder: (value?: Order) => void
  selectedCategory?: Category
  setSelectedCategory: (value?: Category) => void
  supermarket?: Supermarket
  setSupermarket: (value: Supermarket) => void
  supermarkets: Supermarket[]
}

const RecipeContext = createContext({} as RecipeContextType)

export default RecipeContext

export const supermarkets = [
  { key: 'ah', name: 'AH' },
  { key: 'picnic', name: 'Picnic' }
]

export function RecipeProvider(props: any) {
  const supermarketKey = localStorage.getItem('supermarket')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>(() => [])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe>()
  const [selectedOrder, setSelectedOrder] = useState<Order>()
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [supermarket, setSupermarket] = useState<Supermarket>(
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
