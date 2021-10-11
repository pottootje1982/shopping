class Supermarket {
  constructor(ingToProduct, name) {
    this.ingToProduct = ingToProduct
    this.name = name
  }

  async getSelected(full, products) {
    if (!full) {
      return products
    }

    const mapping = await this.ingToProduct.getMapping(full, this.name)
    if (mapping && !mapping.product.ignore && !mapping.product.notAvailable) {
      const id = mapping.product.id
      let selectedProduct = products.find((p) => p.id === id)
      const withoutSelected = products.filter((p) => p.id !== id)
      if (!selectedProduct) {
        selectedProduct = await this.getProduct(id).catch(console.log)
        return [selectedProduct, ...withoutSelected]
      }
    }
    return products
  }
}

module.exports = Supermarket
