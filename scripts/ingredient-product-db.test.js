const { IngredientProductDb } = require('./ingredient-product-db')
const recipeDb = require('./recipe-db.stub')
const { ahUser, ahPass } = require('../config')

describe('storeMapping()', () => {
  const db = new IngredientProductDb()

  it('retrieves stored translations', () => {
    db.storeMapping('Prei', { id: 1273124, title: 'prei' })
    expect(db.getMapping('pRei').product).toEqual({
      id: 1273124,
      title: 'prei',
    })
  })

  it('updates stored translations', () => {
    db.storeMapping('prei', { id: 1273124, title: 'prei' })
    expect(db.getMapping('prei').product).toEqual({
      id: 1273124,
      title: 'prei',
    })

    db.storeMapping('prei', { id: 4, title: 'AH prei' })
    expect(db.getMapping('prei').product).toEqual({ id: 4, title: 'AH prei' })
  })

  it('retrieves stored translations for recipe', () => {
    const recipe = recipeDb.getRecipe('3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4')
    db.storeMapping('Prei', { id: 1273124 })
    db.storeMapping('zalm', { id: 1 })
    db.storeMapping('dille', { id: 2 })
    db.storeMapping('aardappels', { id: 3 })

    const mappings = db.getMappings(recipe)
    expect(mappings).toEqual({
      prei: { id: 1273124, quantity: 1 },
      dille: { id: 2, quantity: 1 },
      zalm: { id: 1, quantity: 1 },
      aardappels: { id: 3, quantity: 1 },
    })
  })

  it('picks order', () => {
    db.storeMapping('aubergines', { id: 1 })
    db.storeMapping('lasagna', { id: 2 })
    db.storeMapping('ricotta', { id: 3 })
    db.storeMapping('egg', { id: 4 })
    db.storeMapping('egg', { id: 5 })

    const recipe = recipeDb.getRecipe('94ca1528-93ae-4b26-9576-a2dc1ada36c3')
    const order = db.pickOrder(recipe)
    expect(order).toEqual({
      items: [
        {
          id: 1,
          quantity: 1,
        },
        {
          id: 5,
          quantity: 1,
        },
        {
          id: 2,
          quantity: 1,
        },
        {
          id: 3,
          quantity: 1,
        },
      ],
    })
    expect(
      db.getAllMappings().filter(map => map.ingredient === 'egg').length
    ).toBe(1)
  })

  it.skip('hydrates ingredient product maps', async () => {
    const AhApi = require('./ah-api')
    const ahApi = new AhApi(ahUser, ahPass)
    const db = new IngredientProductDb('data/ing-to-product.json')
    const mappings = db.getAllMappings()
    for (const mapping of mappings) {
      if (typeof mapping.product === 'number') {
        const { id, title, price } = await ahApi.getProduct(mapping.product)
        if (id) {
          db.storeMapping(mapping.ingredient, { id, title, price })
        }
      }
    }
  })
})