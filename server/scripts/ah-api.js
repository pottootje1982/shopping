const axios = require('axios')

class AhApi {
  constructor (ingToProduct) {
    this.ingToProduct = ingToProduct
  }

  async search (query, full) {
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
        try {
          selectedProduct = await this.getProduct(id)
        } catch (err) {
          console.log(err)
        }
      }
      products = selectedProduct
        ? [selectedProduct, ...withoutSelected]
        : products
    }
    return products
  }

  getProduct (id) {
    return axios
      .get(`https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`)
      .then(({ data }) => {
        return data.card.products.find((p) => p.id === id)
      })
  }
}

module.exports = AhApi
