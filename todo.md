# Features

- distill list of recipes that were ordered (by storing ordered recipes): 8
- Table

  - Group recipes in recipe list: 4
  - Replace delete button with onRowDelete (from material-table): 2

* add translations for quantities: 4
* Order only 1 ingredient
* Click on AH product goes to AH page
* Show products that were unordered (mostly due to undefined quantity)

# Bugs

- after translation, some quantities are still undefined (this is because there is no mapping to set quantity in, also goes for newly added products)
- Ingredienten: '200g gehalveerde, gewelde pruimen zonder pit'

# Refactor

- show unparsed ingredients when editing recipe, store parsed ingredients in recipe as recipe.parsedIngredients
