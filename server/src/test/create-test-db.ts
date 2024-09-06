import { RecipeDb } from '../db/table/recipe';
import { recipes, translations, mappings } from './data/db.unit-test.json';
import { TranslationsDb } from '../db/table/translations';
import { IngredientProductDb } from '../db/table/ingredient-product';
import { OrderDb } from '../db/table/order';
import { createMongoClient } from '../db/mongo-client';

export interface TestDbs {
  recipeDb: RecipeDb;
  translationsDb: TranslationsDb;
  ingToProduct: IngredientProductDb;
  orderDb: OrderDb;
}

export const createTestDbs = async (): Promise<TestDbs> => {
  const client = await createMongoClient(process.env.TEST_DB_URL);
  const dbs = client.db();
  const translationsDb = new TranslationsDb(dbs);
  const ingToProduct = new IngredientProductDb(dbs);
  const recipeDb = new RecipeDb(dbs, translationsDb, ingToProduct);
  const orderDb = new OrderDb(dbs);
  await recipeDb.table().insertMany(recipes);
  await ingToProduct.table().insertMany(mappings);
  await translationsDb.table().insertMany(translations);
  return { recipeDb, translationsDb, ingToProduct, orderDb };
};
