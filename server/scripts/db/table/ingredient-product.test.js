const createDb = require('../tables')
const { AH_USER, AH_PASS } = require('../../../config')

describe('storeMapping()', () => {
  let ingToProduct, recipeDb

  beforeEach(async () => {
    ;({ recipeDb, ingToProduct } = await createDb(
      './memory-db',
      './data/db.test.json'
    ))
  })

  it('retrieves stored translations', async () => {
    ingToProduct.storeMapping('Prei', { id: 1273124, title: 'prei' })
    const mapping = await ingToProduct.getMapping('pRei')
    expect(mapping.product).toEqual({
      id: 1273124,
      title: 'prei'
    })
  })

  it('updates stored translations', async () => {
    ingToProduct.storeMapping('prei', { id: 1273124, title: 'prei' })
    const mapping = ingToProduct.getMapping('prei')
    expect(mapping.product).toEqual({
      id: 1273124,
      title: 'prei'
    })

    ingToProduct.storeMapping('prei', { id: 4, title: 'AH prei' })
    expect(ingToProduct.getMapping('prei').product).toEqual({
      id: 4,
      title: 'AH prei'
    })
  })

  it('retrieves stored translations for recipe', async () => {
    const recipe = await recipeDb.getRecipe(
      '3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4'
    )
    ingToProduct.storeMapping('Prei', { id: 1273124 })
    ingToProduct.storeMapping('zalm', { id: 1 })
    ingToProduct.storeMapping('dille', { id: 2 })
    ingToProduct.storeMapping('aardappels', { id: 3 })

    const recipes = await ingToProduct.getMappings(recipe)
    expect(recipes).toMatchSnapshot()
  })
})
