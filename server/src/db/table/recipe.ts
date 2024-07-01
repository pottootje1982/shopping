import { Ingredients } from '../../ingredients';
import crypto from 'crypto';
import { v1 as uuidv1 } from 'uuid';
import Table from './table';
import { Inject, Injectable } from '@nestjs/common';
import { IngredientProductDb } from './ingredient-product';
import { TranslationsDb } from './translations';
import { Db } from 'mongodb';

@Injectable()
export class RecipeDb extends Table {
  constructor(
    @Inject() db: Db,
    private translationDb: TranslationsDb,
    private ingToProduct: IngredientProductDb,
  ) {
    super(db, 'recipes');
  }

  storeOrder(recipes) {
    recipes.forEach((recipe) => {
      this.table().insertOne(recipe);
    });
  }

  async translateRecipes(recipes, supermarket) {
    recipes = recipes.map((recipe) => ({
      ...recipe,
      parsedIngredients: Ingredients.create(recipe.ingredients),
    }));
    recipes = await this.translationDb.translateRecipes(recipes);
    return this.ingToProduct.getMappings(recipes, supermarket);
  }

  addCategoryNames(recipes, cats = []) {
    return recipes.map((recipe) => {
      const { categories = [] } = recipe;
      const categoryNames = categories
        .map((uid) =>
          cats.find((c) => c.uid.toLowerCase() === uid.toLowerCase()),
        )
        .filter((c) => c)
        .map((c) => c.name);
      return {
        ...recipe,
        categoryNames: categoryNames || [],
      };
    });
  }

  async getRecipes(categories, supermarket, user) {
    const recipes = await this.table()
      .find({ $or: [{ user }, { user: null }] })
      .toArray();
    const recipesWithCategoryNames = this.addCategoryNames(recipes, categories);
    return this.translateRecipes(recipesWithCategoryNames, supermarket);
  }

  getRecipeRaw(uid) {
    return this.table().findOne({ uid });
  }

  async getRecipe(uid: string, supermarket: string) {
    const recipe = await this.getRecipeRaw(uid);
    if (!recipe) return;
    const translated = await this.translateRecipes([recipe], supermarket);
    return translated[0];
  }

  setHash(recipe) {
    const str = JSON.stringify(recipe);
    recipe.hash = crypto.createHash('sha256').update(str).digest('hex');
  }

  async editRecipe(recipe) {
    const oldRecipe = await this.getRecipeRaw(recipe.uid);
    if (!oldRecipe) return null;
    const newRecipe = { ...oldRecipe, ...recipe };
    delete newRecipe.parsedIngredients;
    delete newRecipe.categoryNames;
    this.setHash(newRecipe);
    await this.table().findOneAndReplace({ uid: recipe.uid }, newRecipe);
    return newRecipe;
  }

  addRecipe(recipe) {
    // delete recipe.parsedIngredients
    recipe.uid = recipe.uid || uuidv1();
    this.setHash(recipe);
    return this.table().insertOne(recipe);
  }

  addRecipes(recipes) {
    return this.table().insertOne(recipes);
  }

  removeRecipe(uid: string) {
    return this.table().deleteOne({ uid });
  }
}
