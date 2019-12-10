const createRecipeDb = require("../tables")

describe.skip("recipes()", () => {
  let recipeDb

  beforeEach(async () => {
    ;({ recipeDb } = await createRecipeDb("../mongo-client"))
  })

  afterEach(() => {
    recipeDb.close()
  })

  it("1. get all recipes", async () => {
    const recipes = await recipeDb.getRecipes()
    expect(recipes.length).toBe(188)
  })

  it("2. find 1 recipe", async done => {
    const recipe = await recipeDb.getRecipeRaw(
      "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4"
    )
    expect(recipe.name).toBe("Zalm met prei")
    done()
  })

  it("3. edit recipe", async () => {
    let recipe = await recipeDb.getRecipeRaw(
      "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4"
    )
    recipe.name = "Zalm met prei2"
    await recipeDb.editRecipe(recipe)
    recipe = await recipeDb.getRecipeRaw("3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4")
    expect(recipe.name).toBe("Zalm met prei2")
    recipe.name = "Zalm met prei"
    await recipeDb.editRecipe(recipe)
  })

  it("4. delete recipe", async () => {
    const uid = "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c5"
    let recipe = { uid, name: "test" }
    await recipeDb.removeRecipe(recipe)
  })

  it("5. add/delete recipe", async () => {
    const uid = "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c5"
    let recipe = { uid, name: "test" }
    await recipeDb.addRecipe(recipe)
    recipe = await db.getRecipeRaw(uid)
    expect(recipe.name).toBe("test")
    const recipes = await db.getRecipes()
    expect(recipes.length).toBe(189)
    await db.removeRecipe(recipe)
    recipe = await db.getRecipeRaw(uid)
    expect(recipe).toBeNull()
  })
})
