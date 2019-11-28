const recipeDb = require("./recipe-db.mongo")

describe.skip("recipes()", () => {
  it("find recipe", async () => {
    const db = await recipeDb()
    const recipes = await db.getRecipes()
    expect(recipes.length).toBe(188)
  })

  it("find recipe", async () => {
    const db = await recipeDb()
    const recipe = await db.getRecipeRaw("3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4")
    expect(recipe.name).toBe("Zalm met prei")
  })

  it("edit recipe", async () => {
    const db = await recipeDb()
    let recipe = await db.getRecipeRaw("3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4")
    recipe.name = "Zalm met prei2"
    await db.editRecipe(recipe)
    recipe = await db.getRecipeRaw("3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4")
    expect(recipe.name).toBe("Zalm met prei2")
    recipe.name = "Zalm met prei"
    await db.editRecipe(recipe)
  })
})
