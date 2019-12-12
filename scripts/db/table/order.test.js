const createDb = require("../tables")

describe("storeRecipe()", () => {
  let orderDb

  beforeEach(async () => {
    ;({ orderDb, recipeDb } = await createDb(
      "./memory-db",
      "./data/db.test.json"
    ))
  })

  it("get orders", async () => {
    const orders = await orderDb.get()
    expect(orders.length).toEqual(0)
  })

  it("get hydrated", async () => {
    const recipes = await recipeDb.getRecipes()
    let order = [
      {
        uid: "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4",
        mappings: {
          prei: {
            id: 171425,
            quantity: 1
          }
        }
      }
    ]
    orderDb.storeOrder(order)
    const orders = await orderDb.getHydrated(recipes)
    expect(orders.length).toBe(1)
    order = orders[0]
    expect(order.date).toBeDefined()
    expect(order.recipes.length).toBe(1)
    const recipe = order.recipes[0]

    expect(recipe.name).toEqual("Zalm met prei")
    expect(recipe.ingredients.length).toBe(8)
    expect(recipe.mappings.prei.id).toBe(171425)

    // Removing shouldn't be necessary since we want to start with empty db before each test
    orderDb.remove({ date: order.date })
  })

  it("store order", async () => {
    let order = [
      {
        uid: "5134b9ac-32fd-4e5c-a6da-681d33cd007f",
        mappings: {
          slagroom: {
            id: 191621,
            quantity: 1
          },
          dille: {
            id: 238966,
            quantity: 1
          },
          "witte wijn": {
            id: 183474,
            quantity: 1
          },
          boter: {
            id: 58082,
            quantity: 1
          },
          sjalotjes: {
            id: 160653,
            quantity: 1
          },
          boontjes: {
            id: 4102,
            quantity: 1
          },
          witvis: { notAvailable: true, ignore: false, quantity: 1 },
          aardappels: {
            id: 111388,
            quantity: 1
          }
        }
      }
    ]
    await orderDb.storeOrder(order)
    const orders = await orderDb.get()
    expect(orders.length).toEqual(1)
    order = orders[0]
    expect(order.recipes.length).toEqual(1)
    const recipe = order.recipes[0]
    expect(Object.keys(recipe.mappings)).toEqual([
      "slagroom",
      "dille",
      "witte wijn",
      "boter",
      "sjalotjes",
      "boontjes",
      "witvis",
      "aardappels"
    ])
  })
})
