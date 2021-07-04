const createDb = require('../tables')

describe('storeRecipe()', () => {
  let recipeDb

  beforeAll(async () => {
    ;({ recipeDb } = await createDb('./memory-db', './data/db.test.json'))
  })

  it('get recipes', async () => {
    const recipes = await recipeDb.getRecipes()
    expect(recipes.length).toEqual(12)
  })

  it('mappings are set', async () => {
    const recipes = await recipeDb.getRecipes()
    const recipe = recipes[3]
    expect(recipe.uid).toBe('a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18')
    // Not for all translated ingredients there are mappings
    // defined (only for tomaten)
    expect(Object.keys(recipe.mappings).length).toBe(8)
    expect(recipe.parsedIngredients.length).toBe(8)
  })

  it('get recipe', async () => {
    const uid = 'a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18'
    const recipe = await recipeDb.getRecipe(uid)
    expect(recipe.uid).toBe(uid)
    const dutchIngredients = recipe.parsedIngredients.map((i) => i.ingredient)

    expect(dutchIngredients).toEqual([
      'plantaardige olie',
      'grote ui',
      'knoflook',
      'Madras curry pasta',
      'tomaten',
      'groentebouillon',
      'duurzame witte visfilets',
      'rijst of naanbrood'
    ])
    expect(recipe.parsedIngredients[0].full).toBe('1 tbsp plantaardige olie')
  })

  it('edits recipe', async () => {
    const uid = 'a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18'
    const recipe = await recipeDb.getRecipeRaw(uid)

    await recipeDb.editRecipe({
      uid: 'a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18',
      name: 'Super-quick fish curry 2'
    })
    const newRecipe = await recipeDb.getRecipeRaw(uid)

    expect(newRecipe.name).toBe('Super-quick fish curry 2')
    // Undefined properties should remain untouched
    expect(newRecipe.photo).toBe('0f512f99-54ed-43c1-9157-e1affaddd085.jpg')
    expect(recipe.hash).not.toEqual(newRecipe.hash)
  })
})
