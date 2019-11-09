const ingredientsRemoval = [/ingrediënt/i, /ingredient/i, /person/i]

function filter(replacements, str) {
  for (const [find, rep] of replacements) {
    str = str.replace(find, rep)
  }
  return str.trim()
}

class Ingredients extends Array {
  getProducts() {
    return this.map(i => i.ingredient)
  }

  setProducts(products) {
    for (const [i, product] of products.entries()) {
      this[i].setIngredient(product)
    }
  }

  static create(ingredients) {
    const list = ingredients
      .split('\n')
      .filter(line => line.trim() != '')
      .filter(line => ingredientsRemoval.every(r => !r.exec(line)))
    const ingredientsList = list.map(i => new Ingredient(i))
    return new Ingredients(...ingredientsList)
  }

  toString() {
    return this.map(ing => ing.toString()).join('\n\n')
  }
}

const containers = [
  /\s+cans?/, // otherwise it matches with Tuscan
  /tins?/,
  /tinned/,
  /packs?/,
  /pots?/, // otherwise it matches with potatoes
  /bag/,
]

const measurements = [
  'tbsp',
  'tbs',
  'tsp',
  'ts',
  'g',
  'gr',
  'kg',
  'gram',
  'ml',
  'cl',
  'dl',
  'l',
  'cm',
  'el',
  'el.',
  'tl',
  'tl.',
  'ons',
]

let units = [
  // adjectives
  //boneless/,
  /skinless/,
  /gehalveerde/,
  /young/,
  /slim/,

  // EN
  /bunch/,
  /teaspoon/,
  /tablespoon/,
  /liter/,
  /litre/,
  /cup/,
  /handful/,
  /pinch/,
  /few/,
  /knob/,
  /splash/,
  /piece/,
  /clove/,
  /nest/,
  /strip/,
  /rasher/,
  /sprig/,
  /jar/,
  /slice/, // we don't want it to match with sliced

  // NL
  /kilo/,
  /eetl/,
  /theel/,
  /tenen/,
  /teen/,
  /stengel/,
  /handje/,
  /blik/,
  /fles/,
  /bosje/,
  /blaadje/,
  /plak/,
  /glas/,
  /stukje/,
  /snufje/,
  /takje/,
  /vel/,
]

const unitsWithNumber = [/.*ounce/]

const quantExp = /([\d-¼½–.,/ ]*)\s*x?\s*/.source
const quantExpNoSpace = quantExp.replace(' ', '')
const ingrExp = /([^,]*)/.source

units = [
  ...containers.map(
    unit => new RegExp(`^(.*)\\s*(${unit.source})\\s+${ingrExp}`, 'i')
  ),
  ...units.map(
    unit => new RegExp(`^(.*)\\s*(${unit.source}[^\\s,]*)${ingrExp}`, 'i')
  ),
  ...measurements.map(
    unit => new RegExp(`^${quantExp}\\s*(${unit})\\s+${ingrExp}`, 'i')
  ),
  ...unitsWithNumber.map(
    unit => new RegExp(`${quantExpNoSpace}\\s*(${unit.source})\\s*${ingrExp}`)
  ),
]

const ingLineReplacements = [
  [/(.+)(\(.*\))$/, '$1'], // removal of parentheses
]

const ingReplacements = [
  [/,.*$/, ''], // removal of comma
  [/(.+)(\(.*\))$/, '$1'], // removal of parentheses
  [/(\(.*\)\s+)(.+)$/, '$2'], // removal of parentheses
]

class Ingredient {
  constructor(ingredientLine) {
    let _all, quant, unit, ingr, not_quant
    {
      this.full = ingredientLine
      ingredientLine = this.filterIngLine(ingredientLine)
      const parsed = this.parse(ingredientLine)
      if (parsed) {
        ;[quant, unit, ingr] = parsed
        const quantRest = new RegExp(`${quantExp}(.*)`, 'g').exec(quant)
        if (quantRest) {
          ;[_all, quant, not_quant] = quantRest
          if (!ingr) {
            ingr = not_quant
          } else {
            unit = `${not_quant}${unit}`
          }
        }
      } else {
        ;[_all, quant, ingr] = new RegExp(`${quantExp}${ingrExp}`, 'g').exec(
          ingredientLine
        )
      }
    }
    this.ingredient = this.filterIng(ingr)
    quant = quant && quant.trim()
    quant = quant === '' ? undefined : quant
    this.quantity = !isNaN(quant) ? parseFloat(quant) : quant
    this.unit = unit && unit.trim()
    this.all = [this.quantity, this.unit, this.ingredient]
  }

  parse(unit) {
    const parsed = units.map(u => u.exec(unit))
    let elems = parsed.find(u => u != null)
    if (!elems) return null
    let ing = elems[3].trim()
    ing = ing === '' ? undefined : ing
    return elems ? [elems[1], elems[2], ing] : null
  }

  filterIngLine(line) {
    return filter(ingLineReplacements, line)
  }

  filterIng(ingr) {
    return filter(ingReplacements, ingr).trim()
  }

  setIngredient(ingredient) {
    if (ingredient) {
      this.ingredient = ingredient
      this.full = [this.quantity, this.unit, this.ingredient]
        .filter(s => s)
        .join(' ')
    }
  }

  toString() {
    const all = this.all
    return `${all.toString()},`
  }
}

module.exports = { Ingredients, Ingredient }
