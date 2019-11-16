const Paprika = require("./paprika.js")
const PaprikaApiStub = require("./paprika.stub")
const recipeDb = require("./recipe-db.stub")

describe("Index", () => {
  const paprika = new Paprika(new PaprikaApiStub())

  it("Download recipes", async () => {
    const recipes = await paprika.getRecipes()
    expect(recipes.length).toBe(4)
    expect(recipes[0].name).toEqual("Zalm met prei 2")
    expect(recipes[1].name).toEqual(
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana)"
    )
  })

  it("Synchronizes recipes", async () => {
    const localRecipes = recipeDb.getRecipes().slice(0, 4)
    await paprika.synchronize(localRecipes)
    const recipes = await paprika.getRecipes()
    expect(recipes.length).toBe(5)
    expect(localRecipes.length).toBe(5)
    expect(localRecipes[0].name).toEqual("Zalm met prei 2")
    expect(localRecipes[0].created).toEqual("2019-08-29 11:30:47")
    expect(recipes[1].name).toEqual(
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana) 2"
    )
    expect(recipes[1].created).toEqual("2016-08-29 11:37:51")

    expect(recipes[4].name).toEqual("Pastinaak wortelstamppot met worst")
    expect(recipes[4].created).toEqual("2015-08-01 08:55:22")

    // Fourth recipe should remain untouched, because hashes are the same
    expect(localRecipes[3].name).toEqual("Super-quick fish curry")
    expect(localRecipes[3].created).toEqual("2015-07-24 22:55:30")
    expect(recipes[2].name).toEqual("Super-quick fish curry 2")
    expect(recipes[2].created).toEqual("2017-07-24 22:55:30")

    expect(localRecipes[4].name).toEqual("Cantuccini")
    expect(localRecipes[4].created).toEqual("2017-12-23 09:07:38")
  })
})
