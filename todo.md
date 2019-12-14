# Features

- add translations for quantities: 4

* Table

  - Replace delete button with onRowDelete (from material-table): 2

# Bugs

- Ingredienten: '200g gehalveerde, gewelde pruimen zonder pit': 1
- don't scroll recipe list when adjusting quantity with mouse wheel: ?

# Refactor

- show unparsed ingredients when editing recipe, store parsed ingredients in recipe as recipe.parsedIngredients (then getRecipeRaw is not necessary anymore in editRecipe & deleteRecipe)
