# Features

- add translations for quantities: 4
- allow for pre-order mobile (when actually ordering on desktop make sure there won't be double orders)
- users
- multiple supermarkets

# Improvements

- after selecting order, make sure to show ordered quantities
- favourite recipes

- add AH-items together from different recipes on order (by making sortable table)
- Make both general product - shopping item that applies to all recipes, or recipe specific mapping. To distinguish between recipe specific mappings & general mappings, we can just identify if a mapping exists for a certain ingredient, if and only if so, we should prompt the user: 'Do you want to use these product throughout all recipes?' 'Yes/No'?
- Store default recipe quantities (if recipe is unselected, modify default quantities, otherwise keep it local and don't store in database)
- Create custom +/- control for Recipe (modifying quantities). +/- needs to be bigger

# Bugs

- Don't translate from any language: for instance 'mirin' is now translated as 'dood', because it comes from 'Kurdish'
- Fix translations
- Fix downloads

# Nice to have

- Get access to s3 images of recipes
