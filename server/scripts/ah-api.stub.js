class AhApi {
  constructor (username, password) {
    this.username = username
    this.password = password
  }

  login () {
    if (this.username === 'test_user' && this.password === 'test_pass') {
      return true
    } else return false
  }

  async addToShoppingList () {
    return { success: true }
  }
}

module.exports = AhApi
