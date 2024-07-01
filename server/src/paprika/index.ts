import { PaprikaApi } from 'paprika-api';

import fs from 'fs';
import zlib from 'zlib';
import { RecipeDb } from '../db/table/recipe';
import { Inject, Injectable } from '@nestjs/common';
import { Paprika as PaprikaStub } from './paprika.stub';
import { Readable } from 'stream';
import request from 'request-promise';

function createZip(recipe, fn) {
  return new Promise((resolve, reject) => {
    const s = new Readable();
    s.push(recipe);
    s.push(null);

    const writeStream = fs.createWriteStream(fn);
    const zip = zlib.createGzip();
    s.pipe(zip)
      .pipe(writeStream)
      .on('finish', (value, err) => {
        if (err) return reject(err);
        else resolve(value);
      });
  });
}

function compare(cat1, cat2) {
  const name1 = cat1.name.toLowerCase();
  const name2 = cat2.name.toLowerCase();
  if (name1 < name2) {
    return -1;
  } else if (name1 > name2) {
    return 1;
  } else {
    return 0;
  }
}

@Injectable()
export class Paprika {
  constructor(
    private recipeDb: RecipeDb,
    @Inject() private paprikaApi: PaprikaApi,
    @Inject('PAPRIKA_USER') private user: string,
    @Inject('PAPRIKA_PASS') private pass: string,
  ) {}

  getRecipe(uid) {
    return this.paprikaApi.recipe(uid);
  }

  async getRecipes() {
    const recipesRaw = await this.paprikaApi.recipes();
    const recipes = [];
    for (let i = 0; i < recipesRaw.length; i++) {
      const recipe = await this.getRecipe(recipesRaw[i].uid);
      recipes.push(recipe);
    }
    return recipes;
  }

  categories() {
    return this.paprikaApi.categories().then((categories) => {
      return categories.sort(compare);
    });
  }

  updateRecipe(recipe) {
    console.log('Updating Paprika recipe:', recipe.name);
    return this.upsertRecipe(recipe);
  }

  deleteRecipe(recipe) {
    recipe.in_trash = true;
    return this.upsertRecipe(recipe);
  }

  async synchronize(localRecipes) {
    const remoteRecipes = await this.paprikaApi.recipes();
    const upsertToRemote = localRecipes.filter((local) => {
      const remote = remoteRecipes.find((remote) => remote.uid === local.uid);
      return !remote || remote.hash !== local.hash;
    });
    for (const local of upsertToRemote) {
      const recipe = remoteRecipes.find((r) => r.uid === local.uid);
      const fullRecipe = recipe && (await this.paprikaApi.recipe(recipe.uid));
      if (
        !fullRecipe ||
        (fullRecipe.hash !== local.hash && local.created > fullRecipe.created)
      ) {
        console.log(`Updating Paprika recipe '${local.name}'`);
        await this.upsertRecipe(local);
      } else if (
        fullRecipe &&
        fullRecipe.hash !== local.hash &&
        fullRecipe.created > local.created
      ) {
        console.log(`Updating local recipe '${local.name}'`);
        await this.recipeDb.editRecipe(fullRecipe);
      }
    }
    const insertToLocal = remoteRecipes.filter((recipe) => {
      const local = localRecipes.find((remote) => remote.uid === recipe.uid);
      return !local;
    });
    for (const recipe of insertToLocal) {
      const fullRecipe = await this.paprikaApi.recipe(recipe.uid);
      if ('in_trash' in fullRecipe && !fullRecipe.in_trash) {
        console.log(
          `Get new version of recipe '${fullRecipe.name}' from Paprika to local`,
        );
        this.recipeDb.addRecipe(fullRecipe);
      }
    }
    return insertToLocal.length > 0;
  }

  async create(recipeDb, userDb, user) {
    if (!user) return new PaprikaStub(recipeDb);
    const { paprikaUser, paprikaPass } = await userDb.getUser(user);
    if (user) {
      const api = new PaprikaApi(paprikaUser, paprikaPass);
      return new Paprika(recipeDb, api, paprikaUser, paprikaPass);
    } else return new PaprikaStub(recipeDb);
  }

  async upsertRecipe(recipe) {
    delete recipe.parsedIngredients;
    delete recipe.categoryNames;
    await createZip(JSON.stringify(recipe), './file.gz');
    const res = await request.post(
      `https://www.paprikaapp.com/api/v1/sync/recipe/${recipe.uid}/`,
      {
        auth: {
          user: this.user,
          pass: this.pass,
        },
        formData: {
          data: await fs.createReadStream('./file.gz'),
        },
      },
    );
    console.log(res);
    return res;
  }

  async downloadRecipe(url) {
    const contents = await request.get(url);
    await createZip(contents, './recipe.gz');
    let res = await request.post('https://www.paprikaapp.com/api/v1/recipe/', {
      auth: {
        user: this.user,
        pass: this.pass,
      },
      formData: {
        url,
        html: await fs.createReadStream('./recipe.gz'),
      },
    });
    res = JSON.parse(res);
    return res.result;
  }
}

export const create = async (recipeDb, userDb, user) => {
  if (!user || process.env.USE_PAPRIKA_STUB === 'true')
    return new PaprikaStub(recipeDb);
  const { paprikaUser, paprikaPass } = await userDb.getUser(user.email);
  if (user) {
    const paprikaApi = new PaprikaApi(paprikaUser, paprikaPass);
    return new Paprika(recipeDb, paprikaApi, paprikaUser, paprikaPass);
  } else return new PaprikaStub(recipeDb);
};
