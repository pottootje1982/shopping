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

  it("Saves recipes to paprika", async () => {
    const paprika = new Paprika()
    const recipe = require("./data/db.test.json").recipes[0]
    recipe.name = "Zalm met prei 4"
    await paprika.paprikaApi.upsertRecipe(recipe)
  })

  it("Creates gzip archive", async () => {
    const fs = require("fs")
    var output = fs.createWriteStream("test.gz")
    var zlib = require("zlib")
    var compress = zlib.createGzip()
    /* The following line will pipe everything written into compress to the file stream */
    compress.pipe(output)
    /* Since we're piped through the file stream, the following line will do: 
   'Hello World!'->gzip compression->file which is the desired effect */
    compress.write("Hello, World!")
    compress.end()
  })
})
