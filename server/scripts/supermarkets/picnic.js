const PicnicClient = require('picnic-api')
const { ImageSizes } = PicnicClient
const Supermarket = require('./supermarket')
const { uniqBy } = require('ramda')

class PicnicApi extends Supermarket {
  constructor(ingToProduct, authKey) {
    super(ingToProduct, 'picnic')
    this.client = new PicnicClient({ authKey })
  }

  login(user, pass) {
    return this.client.login(user, pass)
  }

  async search(query, full) {
    const products = await this.client.search(query).then((products) =>
      products
        .map(({ items }) => items)
        .flat(1)
        .map((p) => this.convertProduct(p))
        .filter(({ title }) => title)
    )

    const result = await this.getSelected(full, products)
    return uniqBy((item) => item.id, result)
  }

  convertProduct({ id, name, price, image_id, unit_quantity, product_id }) {
    return {
      id: parseInt(id || product_id),
      title: name,
      price: { now: price / 100.0, unitSize: unit_quantity },
      images: [
        {
          url: this.getImageUri(image_id, ImageSizes.SMALL)
        }
      ]
    }
  }

  async getProduct(id) {
    const { products } =
      (await this.client.getProduct(id).catch(console.log)) || {}
    if (!products || products.length === 0) return
    return this.convertProduct(products[0])
  }

  getImageUri(imageId, size) {
    let alternateRoute = this.client.url.split('/api/')[0]
    return `${alternateRoute}/static/images/${imageId}/${size}.png`
  }

  async order(recipes) {
    const items = recipes
      .map(({ parsedIngredients }) => parsedIngredients)
      .flat(1)
      .map(({ product, ...rest }) => ({ ...product, ...rest }))
    const result = []
    for (const { id, quantity } of items.filter(
      ({ id, notAvailable, ignore, quantity }) =>
        id && !notAvailable && !ignore && quantity > 0
    )) {
      try {
        await this.client.addProductToShoppingCart(id, quantity)
        result.push({ id, quantity, status: 'OK' })
      } catch (err) {
        result.push({ id, quantity, status: err.message })
      }
    }
    return result
  }
}

PicnicApi.create = async (ingToProduct, userDb, user) => {
  const { picnicUser, picnicPass } = (await userDb.getUser(user)) || {}
  const api = new PicnicApi(ingToProduct)
  if (picnicUser && picnicPass) {
    await api.login(picnicUser, picnicPass)
  }
  return api
}

module.exports = PicnicApi
