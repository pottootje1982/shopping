const AhApi = require("./ah-api")
const { ahUser, ahPass } = require("../config")

describe("AhApi", () => {
  const ahApi = new AhApi(ahUser, ahPass)

  it.skip("Signs in", async () => {
    await ahApi.login()
    await ahApi.mijnLijst()
  })

  it.skip("Retrieves list", async () => {
    const list = await ahApi.getList()
    console.log(list)
  })

  it.skip("It adds item to shopping list", async () => {
    await ahApi.addToShoppingList("bier")
  })

  it.skip("It adds recipe to shopping list", async () => {
    const ingredients = [
      "2 garlic cloves, crushed",
      "6 tbsp olive oil",
      "2 x 400g cans chopped tomatoes",
      "2 tbsp tomato purée",
      "4 aubergines, cut into long, 5mm thick slices",
      "85g parmesan (or vegetarian alternative)",
      "freshly grated",
      "20g pack basil, leaves torn",
      "1 egg, beaten",
      "Lasagna",
      "Ricotta"
    ]
    const list = await ahApi.addRecipeToShoppingList(
      undefined,
      "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana)",
      ingredients.map(i => ({
        name: i
      }))
    )
    console.log("New shopping list", list)
  })
})
