# Features

- add translations for quantities: 4
- allow for pre-order mobile (when actually ordering on desktop make sure there won't be double orders)
- name orders (and add category column)

# Improvements

- after selecting order, make sure to show ordered quantities
- Clicking add to cart button in ingredients list shouldn't look at quantity
- adjust quantity buttons bigger
- add AH-items together from different recipes on order (by making sortable table)
- Make both general product - shopping item that applies to all recipes, or recipe specific mapping. To distinguish between recipe specific mappings & general mappings, we can just identify if a mapping exists for a certain ingredient, if and only if so, we should prompt the user: 'Do you want to use these product throughout all recipes?' 'Yes/No'?
- Store default recipe quantities (if recipe is unselected, modify default quantities, otherwise keep it local and don't store in database)
- Deselect category or order when starting to search for recipes
- Create custom +/- control for Recipe (modifying quantities)

# Bugs

- Don't translate from any language: for instance 'mirin' is now translated as 'dood', because it comes from 'Kurdish'

# Nice to have

- Get access to s3 images of recipes
