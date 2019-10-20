const IngredientProductDb = require('./ingredient-product-db')
const recipeDb = require('./recipe-db.stub')

describe('storeMapping()', () => {
  const db = new IngredientProductDb()

  it('retrieves stored translations', () => {
    db.storeMapping('Prei', 1273124)
    expect(db.getMapping('pRei').product).toBe(1273124)
  })

  it('updates stored translations', () => {
    db.storeMapping('prei', 1273124)
    expect(db.getMapping('prei').product).toBe(1273124)

    db.storeMapping('prei', 4)
    expect(db.getMapping('prei').product).toBe(4)
  })

  it('retrieves stored translations for recipe', () => {
    const recipe = recipeDb.getRecipe('3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4')
    db.storeMapping('Prei', 1273124)
    db.storeMapping('zalm', 1)
    db.storeMapping('dille', 2)
    db.storeMapping('aardappels', 3)

    const mappings = db.getMappings(recipe)
    expect(mappings).toEqual({
      "aardappels": {
        "id": 3,
        "quantity": 1,
      },
      "dille": {
        "id": 2,
        "quantity": 1,
      },
      "prei": {
        "id": 1273124,
        "quantity": 1,
      },
      "zalm": {
        "id": 1,
        "quantity": 1,
      }
    })
  })

  it('picks order', () => {
    db.storeMapping('aubergines', 1)
    db.storeMapping('lasagna', 2)
    db.storeMapping('ricotta', 3)
    db.storeMapping('egg', 4)

    const recipe = recipeDb.getRecipe('94ca1528-93ae-4b26-9576-a2dc1ada36c3')
    const order = db.pickOrder(recipe)
    expect(order).toEqual({
      items: [{
          "id": 1,
          "quantity": 1,
        },
        {
          "id": 4,
          "quantity": 1,
        },
        {
          "id": 2,
          "quantity": 1,
        },
        {
          "id": 3,
          "quantity": 1,
        }
      ]
    })
  })
})