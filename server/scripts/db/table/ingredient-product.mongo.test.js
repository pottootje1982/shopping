const createDb = require('../tables')

describe.skip('storeMapping()', () => {
  let ingToProduct

  beforeEach(async() => {
    ;({ ingToProduct } = await createDb('../mongo-client'))
  })

  it('retrieves stored translations', async() => {
    let mapping = await ingToProduct.getMapping('pRei')
    const product = mapping.product
    expect(product.id).toBe(171425)
    product.id = 171424
    await ingToProduct.storeMapping('Prei', product)
    mapping = await ingToProduct.getMapping('pRei')
    expect(mapping.product.id).toBe(171424)
    product.id = 171425
    await ingToProduct.storeMapping('Prei', product)
  })
})
