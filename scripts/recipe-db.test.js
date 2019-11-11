describe("storeRecipe()", () => {
  it("get recipes", () => {
    const db = require("./recipe-db.stub")
    const recipes = db.getRecipes()
    expect(recipes.length).toEqual(12)
  })

  it("mappings are set", () => {
    const db = require("./recipe-db.stub")
    const recipes = db.getRecipes()
    const recipe = recipes[3]
    expect(recipe.uid).toBe("a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18")
    expect(Object.keys(recipe.mappings).length).toBe(8)
    expect(recipe.ingredients.length).toBe(8)
  })

  it("get recipe", () => {
    const db = require("./recipe-db.stub")
    const uid = "a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18"
    const recipe = db.getRecipe(uid)
    expect(recipe.uid).toBe(uid)
    const dutchIngredients = recipe.ingredients.map(i => i.ingredient)

    expect(dutchIngredients).toEqual([
      "plantaardige olie",
      "grote ui",
      "knoflook",
      "Madras curry pasta",
      "tomaten",
      "groentebouillon",
      "duurzame witte visfilets",
      "rijst of naanbrood"
    ])
    expect(recipe.ingredients[0].full).toBe("1 tbsp plantaardige olie")
  })
})
