describe('storeMapping()', () => {
  let ingToProduct, recipeDb

  beforeAll(async () => {
    ;({ recipeDb, ingToProduct, translationsDb } = global)
  })

  it('retrieves stored translations', async () => {
    await ingToProduct.storeMapping(
      'Prei',
      { id: 1273124, title: 'prei' },
      'ah'
    )
    const mapping = await ingToProduct.getMapping('pRei', 'ah')
    expect(mapping.product).toEqual({
      id: 1273124,
      ignore: null,
      notAvailable: null,
      title: 'prei'
    })
  })

  it('updates stored translations', async () => {
    await ingToProduct.storeMapping(
      'prei',
      { id: 1273124, title: 'prei' },
      'ah'
    )
    const mapping = await ingToProduct.getMapping('prei', 'ah')
    expect(mapping.product).toEqual({
      id: 1273124,
      ignore: null,
      notAvailable: null,
      title: 'prei'
    })

    await ingToProduct.storeMapping('prei', { id: 4, title: 'AH prei' }, 'ah')
    const newMapping = await ingToProduct.getMapping('prei', 'ah')
    expect(newMapping.product).toEqual({
      id: 4,
      ignore: null,
      notAvailable: null,
      title: 'AH prei'
    })
  })

  it('retrieves stored translations for recipe', async () => {
    const recipe = await recipeDb.getRecipe(
      '3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4'
    )
    await ingToProduct.storeMapping('Prei', { id: 1273124 }, 'ah')
    await ingToProduct.storeMapping('zalm', { id: 1 }, 'ah')
    await ingToProduct.storeMapping('dille', { id: 2 }, 'ah')
    await ingToProduct.storeMapping('aardappels', { id: 3 }, 'ah')

    const recipes = await ingToProduct.getMappings([recipe], 'ah')
    recipes.forEach((r) => delete r._id)
    expect(recipes).toMatchSnapshot()
  })
})
