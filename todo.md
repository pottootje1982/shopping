# Features

- Table

  - Group recipes in recipe list: 4
  - Replace delete button with onRowDelete (from material-table): 2

* add translations for quantities: 4
* Order only 1 ingredient
* Click on AH product goes to AH page
* Show products that were unordered (mostly due to undefined quantity)

# Bugs

- Ingredienten: '200g gehalveerde, gewelde pruimen zonder pit'
- don't scroll recipe list when adjusting quantity with mouse wheel

# Refactor

- show unparsed ingredients when editing recipe, store parsed ingredients in recipe as recipe.parsedIngredients (then getRecipeRaw is not necessary anymore in editRecipe & deleteRecipe)
