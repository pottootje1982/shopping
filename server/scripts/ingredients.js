const ingredientsRemoval = [
  /ingrediënt/i,
  /ingredient/i,
  /person/i,
  /^for the /i,
  /^to serve/i,
  /^voor de/i
]
const wholeIngredients = [
  /aubergine/i,
  /courgette/i,
  /bloemkool/i,
  /chocola/i,
  /brood/i
]

function filter(replacements, str) {
  for (const [find, rep] of replacements) {
    str = str.replace(find, rep)
  }
  return str.trim()
}

class Ingredients extends Array {
  getProducts() {
    return this.map((i) => i.ingredient)
  }

  translate(products) {
    return this.map((ing, i) => ing.setIngredient(products[i]))
  }

  static create(ingredients) {
    const list = (ingredients ? ingredients.split('\n') : [])
      .map((line) => line.trim())
      .filter((line) => line)
      .filter((line) => ingredientsRemoval.every((r) => !r.exec(line)))
    const ingredientsList = list.map((i) => new Ingredient(i))
    return new Ingredients(...ingredientsList)
  }

  toString() {
    return this.map((ing) => ing.toString()).join('\n\n')
  }
}

const unitsWithNumber = [/.*ounce/]

const quantMultExp = /([\d-¼½–.,/ ]*)\s*x?\s*/i
const quantExp = /([\d-¼½–.,/]*)\s*/i
const quantExpNoSpace = new RegExp(quantMultExp.source.replace(' ', ''), 'i')
const ingrExp = /([^,]*)/.source

const containers = [
  /cans?/,
  /jars?/,
  /tins?/,
  /tinned/,
  /packs?/,
  /pots?/, // otherwise it matches with potatoes
  /bag/,

  /blik/,
  /pak/,
  /beker/
]
const containerParsers = containers.map(
  (unit) =>
    new RegExp(`${quantExp.source}(.*${unit.source})\\s+${ingrExp}`, 'i')
)
const multiplicationParsers = containers.map(
  (unit) =>
    new RegExp(
      `${/([\d-¼½–.,/ ]*)\s*x\s*/i.source}(.*\\b${unit.source})\\s+${ingrExp}`,
      'i'
    )
)

const measurements = [
  '.*tbsp',
  'tbs',
  'tsp',
  'ts',
  'g',
  '\\d+g',
  'gr',
  'kg',
  'gram',
  'ml',
  'cl',
  'dl',
  'lt?',
  'cm',
  'el',
  'el.',
  'tl',
  'tl.',
  'ons'
]

const adjectives = [
  /crushed/,
  /boneless/,
  /skinless/,
  /young/,
  /slim/,
  /thick[ly]+/,
  /sliced/,

  /gewelde?/,
  /gehalveerde?/,
  /gepelde?/,
  /gesneden/
].map((adj) => new RegExp(`${adj.source},?`, 'i'))

const unitWords = [
  /skinless/,

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
  /cloves?/,
  /nest/,
  /strip/,
  /rasher/,
  /sprig/,
  /jar/,
  /slices?/,

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
  /vel/
].map((u) => new RegExp(`\\b${u.source}[^\\s]*`, 'i'))

const unitWordParsers = unitWords.map(
  (u) => new RegExp(`^${quantExp.source}(.*${u.source})\\s*${ingrExp}$`, 'i')
)

const units = [
  ...measurements.map(
    (unit) =>
      new RegExp(`^${quantMultExp.source}\\s*(${unit})\\s+${ingrExp}`, 'i')
  ),
  ...unitsWithNumber.map(
    (unit) =>
      new RegExp(
        `${quantExpNoSpace.source}\\s*(${unit.source})\\s*${ingrExp}`,
        'i'
      )
  )
]

const ingLineReplacements = [
  [/(.+)(\(.*\))$/i, '$1'], // removal of parentheses
  [/([^\d]),.*$/i, '$1'] // removal of comma
]

const ingReplacements = [
  [/(.+)(\(.*\))$/i, '$1'], // removal of parentheses
  [/(\(.*\)\s+)(.+)$/i, '$2'] // removal of parentheses
]

class Ingredient {
  constructor(ingredientLine) {
    if (ingredientLine) {
      let quant, unit, ingr

      ingredientLine = ingredientLine.trim()
      this.full = ingredientLine
      ingredientLine = this.filterIngLine(ingredientLine)
      const parsed = this.parse(ingredientLine)
      if (parsed) {
        ;[quant, unit, ingr] = parsed
      } else {
        ;[, quant, ingr] = new RegExp(
          `${quantMultExp.source}${ingrExp}`,
          'i'
        ).exec(ingredientLine)
      }

      this.ingredient = this.filterIng(ingr)
      quant = quant && quant.trim()
      quant = quant === '' ? undefined : quant
      this.quantity = !isNaN(quant) ? parseFloat(quant) : quant
      this.unit = unit && unit.trim()
      this.all = [this.quantity, this.unit, this.ingredient]
    }
  }

  match(matches, str) {
    const parsed = matches.map((u) => u.exec(str))
    return (parsed.find((u) => u != null) || []).slice(1)
  }

  parse(rawIng) {
    let [quant, unit, ingredient] = this.match(multiplicationParsers, rawIng)
    if (!ingredient) {
      ;[quant, unit, ingredient] = this.match(containerParsers, rawIng)
      if (ingredient) {
        const [match] = measurements.find((m) => unit.match(`\\b${m}`)) || []
        if (match) {
          unit = `${quant.trim()} ${unit.trim()}`
          quant = undefined
        }
      }
    }
    if (!ingredient) {
      ;[quant, unit, ingredient] = this.match(unitWordParsers, rawIng)
      if (!ingredient && unit) {
        // ingredient - unit can be reversed like 'garlic cloves'
        const match = unitWords.map((u) => unit.match(u)).find((u) => u)
        unit = match ? match[0] : unit
        ingredient = match ? match.input.replace(unit, '') : undefined
      }
    }
    if (!ingredient) [quant, unit, ingredient] = this.match(units, rawIng)
    if (ingredient) {
      ingredient = ingredient.trim()
      ingredient = ingredient === '' ? undefined : ingredient
      return [quant, unit, ingredient]
    }
  }

  filterIngLine(line) {
    adjectives.forEach((adj) => (line = line.replace(adj, '')))
    return filter(ingLineReplacements, line)
  }

  filterIng(ingr) {
    return filter(ingReplacements, ingr).trim()
  }

  setIngredient(ingredient) {
    ingredient = ingredient || this.ingredient
    return {
      ...this,
      ingredient,
      full: [this.quantity, this.unit, ingredient].filter((s) => s).join(' ')
    }
  }

  quantityToOrder() {
    const { ingredient, unit } = this
    const isPacked = containers.some((c) => unit && unit.match(c))
    let quantity = this.unit && !isPacked ? 1 : parseInt(this.quantity)
    const isUnpacked = wholeIngredients.every((i) => !ingredient.match(i))
    quantity =
      quantity === undefined ||
      isNaN(quantity) ||
      (isUnpacked && !isPacked && quantity !== 0)
        ? 1
        : quantity

    return quantity
  }

  toString() {
    const all = this.all
    return `${all.toString()},`
  }

  static createFromObject(obj) {
    const res = new Ingredient()
    return Object.assign(res, obj)
  }
}

module.exports = { Ingredients, Ingredient }
