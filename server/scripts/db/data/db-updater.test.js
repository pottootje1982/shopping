const path = require('path')

it.skip('transforms orders', () => {
  const orders = require('./orders.json')
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

it.skip('add supermarket to mappings', () => {
  const mappings = require('./mapping.json')
  const updated = mappings.map(
    ({
      product: { id, title, supermarket, ignore, notAvailable },
      ...mapping
    }) => ({
      ...mapping,
      supermarket: 'ah',
      product: { id, title, ignore, notAvailable }
    })
  )

  require('fs').writeFileSync(
    path.join(__dirname, './mapping-updated.json'),
    JSON.stringify(updated)
  )
})

it.skip('add users to recipes', () => {
  const recipes = require('./recipes.json')
  const updated = recipes.map(({ ...recipe }) => ({
    ...recipe,
    user: 'wouterpot2@gmail.com'
  }))

  require('fs').writeFileSync(
    path.join(__dirname, './recipes-updated.json'),
    JSON.stringify(updated)
  )
})

it.skip('add users to orders', () => {
  const orders = require('./orders.json')
  const updated = orders.map(({ ...order }) => ({
    ...order,
    user: 'wouterpot2@gmail.com'
  }))

  require('fs').writeFileSync(
    path.join(__dirname, './orders-updated.json'),
    JSON.stringify(updated)
  )
})
