function createSupermarket(name, ingToProduct, userDb, user) {
  const { create } = require(`./${name}`)
  return create(ingToProduct, userDb, user)
}

module.exports = createSupermarket
