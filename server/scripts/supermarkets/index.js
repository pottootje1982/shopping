function createSupermarket(name, ingToProduct)
{
  const supermarket = require(`./${name}`)
  return new supermarket(ingToProduct)
}

module.exports = createSupermarket