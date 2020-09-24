const axios = require("axios")

class AhApi {
  constructor(username, password, ingToProduct) {
    this.body = {
      username,
      password,
      recaptchaToken: "captchaToken", // captcha token value doesn't mather if
      // is ah_token_presumed correct
      // (ah_token_presumed in a year)
    }
    this.ingToProduct = ingToProduct
  }

  login(ah_token_presumed) {
    return axios.post(
      "https://www.ah.nl/mijn/api/login",
      this.body,
      this.cookies({ ah_token_presumed })
    )
  }

  async search(query, full) {
    const { data } = await axios.get(
      `https://www.ah.nl/zoeken/api/products/search?query=${query}`
    )
    const cards = data.cards
    let products = cards.map((card) => card.products[0])
    if (!full) {
      return products
    }
    const mapping = await this.ingToProduct.getMapping(full)
    if (mapping && !mapping.product.ignore && !mapping.product.notAvailable) {
      const id = mapping.product.id
      let selectedProduct = products.find((p) => p.id === id)
      const withoutSelected = products.filter((p) => p.id !== id)
      if (!selectedProduct) {
        selectedProduct = await this.getProduct(id)
      }
      products = selectedProduct
        ? [selectedProduct, ...withoutSelected]
        : products
    }
    return products
  }

  getProduct(id) {
    return axios
      .get(`https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`)
      .then(({ data }) => {
        return data.card.products.find((p) => p.id === id)
      })
  }

  cookies(cookies) {
    const Cookie = Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join(";")
    return { headers: { Cookie } }
  }

  async addToShoppingList(items, ah_token) {
    let resp
    try {
      resp = await axios.post(
        "https://www.ah.nl/common/api/basket/v2/add",
        items,
        this.cookies({ ah_token })
      )
    } catch (err) {
      return { success: false, error: err.message || err }
    }
    if (resp.failed && resp.failed.length > 0) {
      const failedInfos = resp.failed.map((fail) => this.getProduct(fail.id))
      return Promise.all(failedInfos).then((infos) => ({
        success: true,
        failed: infos.map((info) => info.title).join(", "),
      }))
    }
    return { success: true }
  }

  addRecipeToShoppingList(recipeId, name, ingredients, ah_token) {
    return axios.post(
      "https://www.ah.nl/common/api/basket/v2/add",
      {
        recipeId,
        name,
        ingredients,
      },
      this.cookies({ ah_token })
    )
  }
}

module.exports = AhApi
