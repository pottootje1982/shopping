# Features

- add translations for quantities: 4
- allow for pre-order mobile (when actually ordering on desktop make sure there won't be double orders)
- name orders

* Table

  - Replace delete button with onRowDelete (from material-table): 2

# Improvements

- Clicking add to cart button in ingredients list shouldn't look at quantity
- adjust quantity buttons bigger
- add AH-items together from different recipes on order (by making sortable table)
- By default, recipe amount shouldn't translate directly to shopping cart amount (think of 4 potatoes that will translate to 4 sacks of potatoes). Only use quantities from recipes if it concerns involves packaging (can/pack/bush)
- Make both general product - shopping item that applies to all recipes, or recipe specific mapping. To distinguish between recipe specific mappings & general mappings, we can just identify if a mapping exists for a certain ingredient, if and only if so, we should prompt the user: 'Do you want to use these product throughout all recipes?' 'Yes/No'?
- Store default recipe quantities (if recipe is unselected, modify default quantities, otherwise keep it local and don't store in database)
- Deselect category or order if when starting to search for recipes
- Create custom +/- control for Recipe (modifying quantities)

# Bugs

- after selecting order, it's impossible to edit recipe (even if selecting 'no order' in combo)
- Prevent 4 tomaten to order 4 packages of tomatoes
- Ingredienten: '200g gehalveerde, gewelde pruimen zonder pit': 1
- kies eerst een order, daarna categorieen: dan komen order recepten bij de categorieen in
- Don't translate from any language: for instance 'mirin' is now translated as 'dood', because it comes from 'Kurdish'
