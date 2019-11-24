const Paprika = require("./paprika.js")
const PaprikaApiStub = require("./paprika.stub")
const recipeDb = require("./recipe-db.stub")("./data/small-db.test.json")

describe("Index", () => {
  const apiStub = new PaprikaApiStub()
  const paprika = new Paprika(apiStub, recipeDb)

  it("Download recipes", async () => {
    const recipes = await paprika.getRecipes()
    expect(recipes.length).toBe(4)
    expect(recipes[0].name).toEqual("Zalm met prei 2")
    expect(recipes[1].name).toEqual(
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana)"
    )
  })

  it("Synchronizes recipes - 1 new from Paprika, 1 new to Paprika", async () => {
    const localRecipes = recipeDb.getRecipes()
    const newRecipes = await paprika.synchronize(localRecipes)
    const recipes = await paprika.getRecipes()
    expect(recipes.length).toBe(5)
    expect(newRecipes.length).toBe(5)
    expect(newRecipes[0].name).toEqual("Zalm met prei 2")
    expect(newRecipes[0].created).toEqual("2019-08-29 11:30:47")
    expect(recipes[1].name).toEqual(
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana) 2"
    )
    expect(recipes[1].created).toEqual("2016-08-29 11:37:51")

    expect(recipes[4].name).toEqual("Pastinaak wortelstamppot met worst")
    expect(recipes[4].created).toEqual("2015-08-01 08:55:22")

    // Fourth recipe should remain untouched, because hashes are the same
    expect(newRecipes[3].name).toEqual("Super-quick fish curry")
    expect(newRecipes[3].created).toEqual("2015-07-24 22:55:30")
    expect(recipes[2].name).toEqual("Super-quick fish curry 2")
    expect(recipes[2].created).toEqual("2017-07-24 22:55:30")

    expect(newRecipes[4].name).toEqual("Cantuccini")
    expect(newRecipes[4].created).toEqual("2017-12-23 09:07:38")
  })

  it("Edits recipe", async () => {
    const uid = "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4"
    let recipe = apiStub.recipe(uid)
    expect(recipe.name).toBe("Zalm met prei 2")
    recipe.name = "Zalm met prei 3"
    await paprika.updateRecipe(recipe)
    recipe = apiStub.recipe(uid)
    expect(recipe.name).toBe("Zalm met prei 3")
    expect(recipe.ingredients).toEqual(
      "Prei\nDille\nBlik tomaten\nZalm\nAardappels\nWijn\nHoning\nkoriander poeder"
    )
  })

  it("Adds recipe", async () => {
    const uid = "e42df73f-3588-47ed-9f3a-41c364ededef"
    const newRecipe = {
      photo: "ce2f1e34-239d-424b-94fd-98e0bf59c085.jpg",
      uid,
      name: "Trout traybake with minty hollandaise"
    }
    await paprika.updateRecipe(newRecipe)
    const recipe = apiStub.recipe(uid)
    expect(recipe).toEqual({
      photo: "ce2f1e34-239d-424b-94fd-98e0bf59c085.jpg",
      uid,
      name: "Trout traybake with minty hollandaise"
    })
  })

  it.skip("Saves recipes to paprika", async () => {
    const paprika = new Paprika()
    const recipe = require("./data/db.test.json").recipes[0]
    recipe.name = "Zalm met prei 9"
    await paprika.upsertRecipe(recipe)
  })

  it.skip("Downloads recipe from url with paprika", async () => {
    jest.setTimeout(15000)
    const paprika = new Paprika()
    const recipe = await paprika.downloadRecipe(
      "https://www.bbcgoodfood.com/recipes/10033/aubergine-tomato-and-parmesan-bake-melanzane-alla-"
    )
    expect(recipe.name).toBe(
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana)"
    )
  })
})
