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

    await ingToProduct.getMappings(recipe)
    const mappings = recipe.mappings
    expect(mappings).toEqual({
      Prei: { id: 1273124, quantity: 1 },
      Dille: { id: 2, quantity: 1 },
      Honing: {
        quantity: 1
      },
      Wijn: {
        quantity: 1
      },
      Zalm: { id: 1, quantity: 1 },
      'koriander poeder': {
        quantity: 1
      },
      tomaten: {
        quantity: 1
      },
      Aardappels: { id: 3, quantity: 1 }
    })
  })

  it('picks order', async () => {
    ingToProduct.storeMapping('aubergines', { id: 1 })
    ingToProduct.storeMapping('Lasagne', { id: 2 })
    ingToProduct.storeMapping('ricotta', { id: 3 })
    ingToProduct.storeMapping('egg', { id: 4 })
    ingToProduct.storeMapping('egg', { id: 5 })
    ingToProduct.storeMapping('pastinaak', { id: 6 })

    const recipe = await recipeDb.getRecipe(
      '94ca1528-93ae-4b26-9576-a2dc1ada36c3'
    )
    const recipe2 = await recipeDb.getRecipe(
      '2ce31202-4560-4273-bdfa-06c20ae46084'
    )

    const order = await ingToProduct.pickOrder(recipe, recipe2)
    expect(order).toEqual({
      items: [
        {
          id: 1,
          quantity: 4
        },
        {
          id: 5,
          quantity: 1
        },
        {
          id: 2,
          quantity: 1
        },
        {
          id: 3,
          quantity: 1
        },
        {
          id: 6,
          quantity: 1
        }
      ]
    })
    const mappings = await ingToProduct.getAllMappings()
    expect(mappings.filter((map) => map.ingredient === 'egg').length).toBe(1)
  })

  it('does not order ignored items', async () => {
    ingToProduct.storeMapping('pastinaak', { id: 3 })
    ingToProduct.storeMapping('wortel', { id: 2 })
    ingToProduct.storeMapping('kruimige aardappels', { ignore: true })
    ingToProduct.storeMapping('zout en peper', { id: 1, ignore: true })

    const recipe = await recipeDb.getRecipe(
      '2ce31202-4560-4273-bdfa-06c20ae46084'
    )
    let order = await ingToProduct.pickOrder(recipe)
    expect(order).toEqual({
      items: [
        {
          id: 3,
          quantity: 1
        },
        {
          id: 2,
          quantity: 1
        }
      ]
    })
    ingToProduct.storeMapping('kruimige aardappels', {})
    ingToProduct.storeMapping('zout en peper', { id: 1, ignore: false })
    await ingToProduct.getMappings(recipe)
    order = await ingToProduct.pickOrder(recipe)
    expect(order).toEqual({
      items: [
        {
          id: 3,
          quantity: 1
        },
        {
          id: 2,
          quantity: 1
        },
        {
          id: 1,
          quantity: 1
        }
      ]
    })
  })

  it.skip('hydrates ingredient product maps', async () => {
    const AhApi = require('../../ah-api')
    const ahApi = new AhApi(AH_USER, AH_PASS)
    const mappings = await ingToProduct.getAllMappings()
    for (const mapping of mappings) {
      if (typeof mapping.product === 'number') {
        const { id, title, price } = await ahApi.getProduct(mapping.product)
        if (id) {
          ingToProduct.storeMapping(mapping.ingredient, { id, title, price })
        }
      }
    }
  })
})
