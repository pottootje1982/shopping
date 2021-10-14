const createDb = require('../scripts/db/tables')
const {
  recipes,
  translations,
  mappings
} = require('../scripts/db/data/db.unit-test.json')

let client

beforeAll(async () => {
  const dbs = await createDb()
  const { recipeDb, translationsDb, ingToProduct, orderDb } = dbs
  client = dbs.client
  await recipeDb.table().insertMany(recipes)
  await ingToProduct.table().insertMany(mappings)
  await translationsDb.table().insertMany(translations)
  global.recipeDb = recipeDb
  global.translationsDb = translationsDb
  global.ingToProduct = ingToProduct
  global.orderDb = orderDb
})

afterAll(async () => {
  await global.recipeDb.table().deleteMany()
  await global.ingToProduct.table().deleteMany()
  await global.translationsDb.table().deleteMany()
  await global.orderDb.table().deleteMany()
  await client.close()
})
