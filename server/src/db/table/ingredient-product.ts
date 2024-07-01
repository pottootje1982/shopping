import { Inject, Injectable } from '@nestjs/common';
import { Ingredient } from '../../ingredients';
import Table from './table';
import { Db } from 'mongodb';

@Injectable()
export class IngredientProductDb extends Table {
  constructor(@Inject() db: Db) {
    super(db, 'ing-to-product');
  }

  storeMapping(ingredient, { id, title, ignore, notAvailable }, supermarket) {
    ingredient = ingredient.toLowerCase();
    return this.table().findOneAndReplace(
      {
        ingredient,
        supermarket,
      },
      {
        ingredient,
        supermarket,
        product: { id, title, ignore, notAvailable },
      },
      { upsert: true },
    );
  }

  storeMappings(mappings) {
    return this.table().insertOne(mappings);
  }

  getMapping(ingredient, supermarket) {
    ingredient = ingredient.toLowerCase();
    return this.table().findOne({
      ingredient,
      supermarket,
    });
  }

  async getMappings(recipes, supermarket) {
    const mappings = await this.all();
    return recipes.map(({ parsedIngredients, ...r }) => {
      parsedIngredients = parsedIngredients.map((i) => {
        const mapping = mappings.find(
          (m) =>
            m.ingredient === i.ingredient.toLowerCase() &&
            m.supermarket === supermarket,
        );
        const ing = Ingredient.createFromObject(i);
        const quantity = ing.quantityToOrder();
        let product = mapping?.product;
        return { ...i, quantity, product };
      });
      return { ...r, parsedIngredients };
    });
  }
}
