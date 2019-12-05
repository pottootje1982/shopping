var request = require("request-promise")
request = request.defaults({
  jar: true
})
var FileCookieStore = require("tough-cookie-filestore")
const path = require("path")

class AhApi {
  constructor(username, password, ingToProduct) {
    this.body = {
      username,
      password
    }
    const file = path.resolve(__dirname, "cookie.json")
    this.jar = request.jar(new FileCookieStore(file))
    this.ingToProduct = ingToProduct
  }

  login() {
    return request.post(
      "https://www.ah.nl/mijn/api/login",
      this.options(this.body)
    )
  }

  async search(query, full) {
    const response = await request.get(
      `https://www.ah.nl/zoeken/api/products/search?query=${query}`
    )
    const cards = JSON.parse(response).cards
    let products = cards.map(card => card.products[0])
    if (!full) {
      return products
    }
    const mapping = await this.ingToProduct.getMapping(full)
    if (mapping && !mapping.product.ignore && !mapping.product.notAvailable) {
      const id = mapping.product.id
      let selectedProduct = products.find(p => p.id === id)
      const withoutSelected = products.filter(p => p.id !== id)
      if (!selectedProduct) {
        selectedProduct = await this.getProduct(id)
      }
      products = selectedProduct
        ? [selectedProduct, ...withoutSelected]
        : products
    }
    return products
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
    console.log(`Items not ordered: ${resp.failed}`)
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
