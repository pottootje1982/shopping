describe('storeRecipe()', () => {
  let orderDb, recipeDb

  beforeAll(async () => {
    ;({ orderDb, recipeDb } = global)
  })

  it('get orders', async () => {
    const orders = await orderDb.get()
    expect(orders.length).toEqual(0)
  })

  it('get hydrated', async () => {
    const recipes = await recipeDb.getRecipes(undefined, 'ah')
    let order = [
      {
        uid: '3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4',
        parsedIngredients: [
          {
            ingredient: 'prei',
            product: {
              id: 171425,
              quantity: 1
            }
          },
          {
            ingredient: 'aardappels',
            product: {
              quantity: 10
            }
          }
        ]
      }
    ]
    const user = 'henry jones'
    await orderDb.storeOrder(order, 'ah', user)
    const orders = await orderDb.getHydrated(user, recipes)
    expect(orders.length).toBe(1)
    order = orders[0]
    expect(order.date).toBeDefined()
    expect(order.recipes.length).toBe(1)
    const recipe = order.recipes[0]

    expect(recipe.name).toEqual('Zalm met prei')
    expect(recipe.parsedIngredients.length).toBe(8)
    expect(recipe.parsedIngredients).toMatchSnapshot()

    await orderDb.remove({ date: order.date })
  })

  it('store order', async () => {
    let order = [
      {
        uid: '5134b9ac-32fd-4e5c-a6da-681d33cd007f',
        parsedIngredients: [
          {
            ingredient: 'slagroom',
            product: {
              id: 191621,
              quantity: 1
            }
          },
          {
            ingredient: 'dille',
            product: {
              id: 238966,
              quantity: 1
            }
          },
          {
            ingredient: 'witte wijn',
            product: {
              id: 183474,
              quantity: 1
            }
          },
          {
            ingredient: 'boter',
            product: {
              id: 58082,
              quantity: 1
            }
          },
          {
            ingredient: 'sjalotjes',
            product: {
              id: 160653,
              quantity: 2
            }
          },
          {
            ingredient: 'boontjes',
            product: {
              id: 4102,
              quantity: 2
            }
          },
          {
            ingredient: 'witvis',
            product: { notAvailable: true, ignore: false, quantity: 1 }
          },
          {
            ingredient: 'aardappels',
            product: {
              id: 111388,
              quantity: 1
            }
          }
        ]
      }
    ]
    await orderDb.storeOrder(order)
    const orders = await orderDb.get()
    expect(orders.length).toEqual(1)
    order = orders[0]
    expect(order.recipes.length).toEqual(1)
    const recipe = order.recipes[0]
    expect(recipe.parsedIngredients).toMatchSnapshot()

    await orderDb.remove({ uid: order.uid })
  })
})
