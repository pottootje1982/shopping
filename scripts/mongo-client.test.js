const createDb = require("./mongo-client")

describe("recipes()", () => {
  it.skip("gets recipes", async () => {
    const db = await createDb()
    let collection = db.collection("recipes")

    const recipe = await collection.findOne({ name: "Zalm met prei" })

    console.log(recipe)
  })
})
