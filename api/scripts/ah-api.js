var request = require("request-promise")
request = request.defaults({
  jar: true
})
var FileCookieStore = require("tough-cookie-filestore")
const path = require("path")

class AhApi {
  constructor(username, password) {
    this.body = {
      username,
      password
    }
    const file = path.resolve(__dirname, "cookie.json")
    this.jar = request.jar(new FileCookieStore(file))
  }

  async login() {
    return await request.post(
      "https://www.ah.nl/mijn/api/login",
      this.options(this.body)
    )
  }

  async mijnLijst() {
    return await request.get("https://www.ah.nl/mijnlijst", this.options())
  }

  async getList() {
    const resp = await request.get(
      "https://www.ah.nl/service/rest/shoppinglists/0",
      this.options()
    )
    return resp
  }

  async getProduct(id) {
    console.log(`https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`)
    const resp = await request.get(
      `https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`
    )
    const parsed = JSON.parse(resp)
    return parsed.card.products.find(p => p.id === id)
  }

  async addToShoppingList(items) {
    const resp = await request.post(
      "https://www.ah.nl/common/api/basket/v2/add",
      this.options(items)
    )
    return resp
  }

  async addRecipeToShoppingList(recipeId, name, ingredients) {
    return await request.post(
      "https://www.ah.nl/common/api/basket/v2/add",
      this.options({
        recipeId,
        name,
        ingredients
      })
    )
  }

  options(body) {
    return {
      jar: this.jar,
      body,
      json: true
    }
  }
}

module.exports = AhApi
