const getAllHydratedRecipes = require('./paprika.js')

describe('Index', () => {
  it.skip('Download recipes', async () => {
    const recipes = await getAllHydratedRecipes()
    console.log(recipes)
  })
})
