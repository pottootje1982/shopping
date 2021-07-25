const path = require('path')

it.skip('transforms orders', () => {
  const orders = require('../../../../test.json')
  console.log(orders)
  const updated = orders.map(({ recipes, ...order }) => ({
    ...order,
    recipes: recipes.map(({ mappings, uid }) => ({
      uid,
      parsedIngredients: Object.entries(mappings).map(
        ([ingredient, product]) => ({
          ingredient,
          product
        })
      )
    }))
  }))

  require('fs').writeFileSync(
    path.join(__dirname, './db.api-test2.json'),
    JSON.stringify(updated)
  )
})
