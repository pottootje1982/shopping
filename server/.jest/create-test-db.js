const createDb = require('../scripts/db/tables')
const {
  recipes,
  translations,
  mappings
} = require('../scripts/db/data/db.unit-test.json')

beforeAll(async () => {
  const { recipeDb, translationsDb, ingToProduct, orderDb } = await createDb(
    './mongo-client'
  )
  await recipeDb.addRecipes(recipes)
  await ingToProduct.storeMappings(mappings)
  await translationsDb.table().push(translations).write()
  global.recipeDb = recipeDb
  global.translationsDb = translationsDb
  global.ingToProduct = ingToProduct
  global.orderDb = orderDb
})

afterAll(async () => {
  await global.recipeDb.table().table.deleteMany()
  await global.ingToProduct.table().table.deleteMany()
  await global.translationsDb.table().table.deleteMany()
  await global.orderDb.table().table.deleteMany()
  await global.recipeDb.close()
  await global.ingToProduct.close()
  await global.translationsDb.close()
  await global.orderDb.close()
})
