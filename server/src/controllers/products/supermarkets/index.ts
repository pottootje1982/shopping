import { IngredientProductDb } from '../../../db/table/ingredient-product';
import { AhApi } from './ah';
import { create as createPicnic } from './picnic';
import { UserDb } from '../../../db/table/user';

const nameToSupermarket = {
  ah: (ingToProduct: IngredientProductDb) => new AhApi(ingToProduct),
  picnic: createPicnic,
};

export default function createSupermarket(
  name: string,
  ingToProduct: IngredientProductDb,
  userDb: UserDb,
  user: string,
) {
  const create = nameToSupermarket[name];
  return create(ingToProduct, userDb, user);
}
