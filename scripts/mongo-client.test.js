const createDb = require("./mongo-client")

describe.skip("recipes()", () => {
  let db

  beforeAll(async () => {
    db = await createDb()
  })

  it("find recipe", async done => {
    let recipe = await db
      .get("recipes")
      .find({ name: "Zalm met prei" })
      .value()

    done()
  })

  afterAll(done => {
    db.close()
  })
})
