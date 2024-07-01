import getDateStr from '../../../../client/src/Components/date';
import { Inject, Injectable } from '@nestjs/common';
import Table from './table';
import { Db, ObjectId } from 'mongodb';

@Injectable()
export class OrderDb extends Table {
  constructor(@Inject() db: Db) {
    super(db, 'orders');
  }

  storeOrder(recipes, supermarket, user) {
    const date = getDateStr();
    recipes = recipes.map(({ uid, parsedIngredients }) => ({
      uid,
      parsedIngredients,
    }));
    const order = { date, recipes, supermarket, user };
    return this.table()
      .insertOne(order)
      .then(() => order);
  }

  getOrders(user) {
    return this.table().find({ user }).toArray();
  }

  getOrder(user, uid) {
    return this.table().findOne({ user, uid });
  }

  deleteOrder(user, id) {
    return this.table().deleteOne({
      user,
      _id: ObjectId.createFromHexString(id),
    });
  }

  async getHydrated(user, recipes) {
    const getProduct = ({ parsedIngredients }, ing) => {
      const found = parsedIngredients.find(
        (i) => i.ingredient.toLowerCase() === ing.ingredient.toLowerCase(),
      );
      return {
        ...ing.product,
        ...found?.product,
      };
    };

    const orders = await this.getOrders(user);
    for (const order of orders) {
      for (const orderedRecipe of order.recipes) {
        const recipe = recipes.find((r) => r.uid === orderedRecipe.uid);
        orderedRecipe.parsedIngredients = recipe?.parsedIngredients.map(
          (ing) => ({
            ...ing,
            product: getProduct(orderedRecipe, ing),
          }),
        );
        orderedRecipe.name = recipe?.name;
      }
    }
    return orders;
  }
}
