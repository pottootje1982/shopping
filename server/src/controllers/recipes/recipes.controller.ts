import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RecipeDb } from '../../db/table/recipe';
import { Paprika } from '../../paprika';
import R from 'ramda';
import { OrderDb } from '../../db/table/order';
import { UserDb } from '../../db/table/user';
import { create as createPaprika } from '../../paprika';
import Translator from '../../translator/translator';
import { GetUser } from '../get-user';

@Injectable()
@Controller('recipes')
export class RecipesController {
  constructor(
    private paprika: Paprika,
    private orderDb: OrderDb,
    private recipesDb: RecipeDb,
    private userDb: UserDb,
    private translator: Translator,
  ) {}

  @Get()
  async getRecipes(@Query() supermarket, @GetUser() user: any) {
    const categories = await this.paprika.categories();
    const recipes = await this.recipesDb.getRecipes(
      categories,
      supermarket,
      user,
    );
    const orders = await this.orderDb.getHydrated(user, recipes);
    const uniqRecipes = R.uniqBy((r) => r.uid, recipes);
    return { recipes: uniqRecipes, orders, categories };
  }

  @Post()
  async addRecipe(
    @Body() recipe: any,
    @Query('supermarket') supermarket: string,
    @GetUser() user: any,
  ) {
    const newRecipe = { ...defaultRecipe, ...recipe };
    await this.recipesDb.addRecipe(newRecipe);
    const paprika = await createPaprika(this.recipesDb, this.userDb, user);
    await paprika.updateRecipe(newRecipe);
    return await this.recipesDb.getRecipe(newRecipe.uid, supermarket);
  }

  @Put()
  async editRecipe(
    @Body() recipe: any,
    @Query('supermarket') supermarket: string,
    @GetUser() user: any,
  ) {
    recipe = await this.recipesDb.editRecipe(recipe);
    if (!recipe) throw new NotFoundException('Recipe not found');
    const paprika = await createPaprika(this.recipesDb, this.userDb, user);
    await paprika.updateRecipe(recipe);
    return recipe
      ? await this.recipesDb.getRecipe(recipe.uid, supermarket)
      : { statusCode: 404 };
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteRecipes(@Body() recipes: any[], @GetUser() user: any) {
    const paprika = await createPaprika(this.recipesDb, this.userDb, user);
    const successes = await Promise.all(
      recipes.map(async (recipe) => {
        const success = await paprika.deleteRecipe(recipe);
        const { uid } = recipe;
        const { deletedCount } = await this.recipesDb.removeRecipe(uid);
        return deletedCount === 1 && success;
      }),
    );

    const ok = successes.every((s) => s);
    if (ok) {
      return { statusCode: 204 };
    } else {
      throw new InternalServerErrorException('Failed to delete recipes');
    }
  }

  @Get('sync')
  async syncRecipes(
    @Query('supermarket') supermarket: string,
    @GetUser() user: any,
  ) {
    const paprika = await createPaprika(this.recipesDb, this.userDb, user);
    await paprika.synchronize(await this.recipesDb.all());
    const categories = await paprika.categories();
    const recipes = await this.recipesDb.getRecipes(
      categories,
      supermarket,
      user,
    );
    const uniqRecipes = R.uniqBy((r) => r.uid, recipes);
    return uniqRecipes;
  }

  @Post('download')
  @HttpCode(HttpStatus.OK)
  async downloadRecipe(
    @Body() body: { url: string },
    @Query('supermarket') supermarket: string,
    @GetUser() user: any,
  ) {
    const { url } = body;
    const paprika = await createPaprika(this.recipesDb, this.userDb, user);
    const recipe = await paprika.downloadRecipe(url);
    if (recipe) {
      await this.recipesDb.translateRecipes([recipe], supermarket);
      recipe.source_url = url;
    }
    return recipe;
  }

  @Post('translate')
  @HttpCode(HttpStatus.OK)
  async translateRecipe(
    @Body() body: { recipeId: string },
    @Query('supermarket') supermarket: string,
  ) {
    const { recipeId } = body;
    const recipe = await this.recipesDb.getRecipe(recipeId, supermarket);
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${recipeId} not found`);
    } else {
      try {
        await this.translator.translate(
          recipe.parsedIngredients.map((i) => i.ingredient),
        );
        const recipes = await this.recipesDb.translateRecipes(
          [recipe],
          supermarket,
        );
        return { recipe: recipes[0] };
      } catch (err) {
        throw new InternalServerErrorException('Failed to translate recipe');
      }
    }
  }
}

const defaultRecipe = {
  photo: null,
  image_url: null,
  photo_hash: null,
  source: null,
  nutritional_info: '',
  scale: null,
  deleted: false,
  categories: [],
  servings: '',
  rating: 0,
  difficulty: null,
  notes: '',
  on_favorites: false,
  cook_time: '',
  prep_time: '',
};
