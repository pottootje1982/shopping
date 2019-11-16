const Paprika = require("./paprika.js")
const PaprikaApiStub = require("./paprika.stub")
const recipeDb = require("./recipe-db.stub")

describe("Index", () => {
  const paprika = new Paprika(new PaprikaApiStub())
  const recipes = recipeDb.getRecipes().slice(0, 3)

  it("Download recipes", async () => {
    const recipes = await paprika.getAllHydratedRecipes()
    expect(recipes.length).toBe(2)
    expect(recipes[0].name).toEqual("Zalm met prei")
    expect(recipes[1].name).toEqual(
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana)"
    )
  })

  it("Synchronizes recipes", async () => {
    await paprika.synchronize(recipes)
    expect(paprika.paprikaApi.recipes().length).toBe(3)
  })
})
