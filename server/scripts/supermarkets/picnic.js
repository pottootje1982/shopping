const axios = require('axios')

const PicnicClient = require('picnic-api')
const { ImageSizes } = PicnicClient

class PicnicApi {
  constructor(ingToProduct, authKey) {
    this.ingToProduct = ingToProduct
    this.client = new PicnicClient({ authKey })
  }

  login(user, pass) {
    return this.client.login(user, pass)
  }

  async search(query, full) {
    const products = await this.client.search(query)

    return products
      .map(({ items }) => items)
      .flat(1)
      .map(({ id, name, price, image_id, unit_quantity }) => ({
        id,
        title: name,
        price: { now: price / 100.0, unitSize: unit_quantity },
        images: [
          {
            url: this.getImageUri(image_id, ImageSizes.SMALL)
          }
        ]
      }))
      .filter(({ title }) => title)
  }

  getImageUri(imageId, size) {
    let alternateRoute = this.client.url.split('/api/')[0]
    return `${alternateRoute}/static/images/${imageId}/${size}.png`
  }

  getProduct(id) {
    return axios
      .get(`https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`)
      .then(({ data }) => {
        return data.card.products.find((p) => p.id === id)
      })
  }

  async order(recipes) {
    const items = recipes
      .map(({ parsedIngredients }) => parsedIngredients)
      .flat(1)
      .map(({ product: { id }, quantity }) => ({ id, quantity }))
    for (const { id, quantity } of items) {
      await this.client.addProductToShoppingCart(id, quantity)
    }
    console.log(items)
  }
}

PicnicApi.create = async (ingToProduct, userDb, mail) => {
  const { picnicUser, picnicPass } = await userDb.getUser(mail)
  const api = new PicnicApi(ingToProduct)
  await api.login(picnicUser, picnicPass)
  return api
}

module.exports = PicnicApi
