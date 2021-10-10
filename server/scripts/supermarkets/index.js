function createSupermarket(name, ingToProduct, userDb, mail) {
  const { create } = require(`./${name}`)
  return create(ingToProduct, userDb, mail)
}

module.exports = createSupermarket
