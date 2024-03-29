const axios = require('axios')
const Supermarket = require('./supermarket')

class AhApi extends Supermarket {
  constructor(ingToProduct) {
    super(ingToProduct, 'ah')
  }

  login() {}

  async search(query, full) {
    const { data } = await axios.get(
      `https://www.ah.nl/zoeken/api/products/search?query=${query}`
    )
    const cards = data.cards
    let products = cards
      .map((card) => card.products[0])
      .map(({ id, title, images, price }) => ({ id, title, images, price }))

    return this.getSelected(full, products)
  }

  getProduct(id) {
    id = parseInt(id)
    const url = `https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`
    return axios
      .get(url)
      .then(({ data }) => {
        return data.card.products.find((p) => p.id === id)
      })
      .catch(() => {
        console.log(`Product with id '${id}' not found in AH`)
      })
  }

  order(recipes) {
    // Products are ordered via chrome extension
  }
}

AhApi.create = async (ingToProduct) => {
  return new AhApi(ingToProduct)
}

module.exports = AhApi
