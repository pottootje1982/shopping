var request = require("request-promise")
request = request.defaults({
  jar: true
})

class AhApi {
  constructor(username, password, ingToProduct) {
    this.body = {
      username,
      password
    }
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

  mijnLijst() {
    return request.get("https://www.ah.nl/mijnlijst", this.options())
  }

  getList() {
    return request.get(
      "https://www.ah.nl/service/rest/shoppinglists/0",
      this.options()
    )
  }

  getProduct(id) {
    return request
      .get(`https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`)
      .then(resp => {
        const parsed = JSON.parse(resp)
        return parsed.card.products.find(p => p.id === id)
      })
  }

  async addToShoppingList(items) {
    const options = this.options(items)
    console.log(options)
    const resp = await request
      .post("https://www.ah.nl/common/api/basket/v2/add", options)
      .catch(err => {
        const error = JSON.parse(err.message.match(/\d+ - (.*)/)[1])
        throw error.message
      })

    if (resp.failed.length > 0) {
      const failedInfos = resp.failed.map(fail => this.getProduct(fail.id))
      return Promise.all(failedInfos).then(infos =>
        infos.map(info => info.title).join(", ")
      )
    }
    return []
  }

  addRecipeToShoppingList(recipeId, name, ingredients) {
    return request.post(
      "https://www.ah.nl/common/api/basket/v2/add",
      this.options({
        recipeId,
        name,
        ingredients
      })
    )
  }

  setCookie(cookie) {
    this.cookie = cookie
  }

  options(body) {
    return {
      jar: this.jar,
      body,
      json: true,
      headers: {
        Cookie: this.cookie
      }
    }
  }
}

module.exports = AhApi
