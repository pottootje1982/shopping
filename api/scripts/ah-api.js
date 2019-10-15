var request = require('request-promise')
request = request.defaults({ jar: true })
var FileCookieStore = require('tough-cookie-filestore')

class AhApi {
  constructor(username, password) {
    this.body = { username, password }
    this.jar = request.jar(new FileCookieStore('cookie.json'))
  }

  async login() {
    return await request.post(
      'https://www.ah.nl/mijn/api/login',
      this.options(this.body)
    )
  }

  async mijnLijst() {
    return await request.get('https://www.ah.nl/mijnlijst', this.options())
  }

  async getList() {
    const resp = await request.get(
      'https://www.ah.nl/service/rest/shoppinglists/0',
      this.options()
    )
    return resp
  }

  async addToShoppingList(item) {
    const resp = await request.post(
      'https://www.ah.nl/service/rest/shoppinglists/0/items',
      this.options({
        quantity: 1,
        type: 'UNSPECIFIED',
        label: 'PROCESSING_UNSPECIFIED',
        item: { description: item }
      })
    )
    return resp
  }

  async addRecipeToShoppingList(recipeId, name, ingredients) {
    return await request.post(
      'https://www.ah.nl/service/obtainment/rest/shoppinglist/ingredients',
      this.options({ recipeId, name, ingredients })
    )
  }

  options(body) {
    return { jar: this.jar, body, json: true }
  }
}

module.exports = AhApi
