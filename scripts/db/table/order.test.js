const createDb = require("../tables")

describe("storeRecipe()", () => {
  let orderDb

  beforeAll(async () => {
    ;({ orderDb } = await createDb("./memory-db", "./data/db.test.json"))
  })

  it("get orders", async () => {
    const orders = await orderDb.get()
    expect(orders.length).toEqual(0)
  })

  it("store order", async () => {
    const recipes = [
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
    await orderDb.storeRecipes(recipes)
    const orders = await orderDb.get()
    expect(orders.length).toEqual(1)
    const order = orders[0]
    expect(order.recipes.length).toEqual(1)
    const recipe = order.recipes[0]
    expect(Object.keys(recipe.products)).toEqual([
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
