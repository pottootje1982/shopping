class Paprika {
  constructor(_paprikaApi, db) {
    this.recipeDb = db
  }

  getRecipe(uid) {
    return this.paprikaApi.recipe(uid)
  }

  getRecipes() {
    return true
  }

  categories() {
    return [
      {
        order_flag: 0,
        uid: 'f172bbb8-2b65-485d-bb57-3575b7c686bb',
        parent_uid: null,
        name: 'week 01'
      },
      {
        order_flag: 1,
        uid: '2b047c3c-cffa-4e10-8654-06bd327d2901',
        parent_uid: null,
        name: 'week 02'
      },
      {
        order_flag: 2,
        uid: '830ee6d1-21b3-4946-baaf-57efd9954b3d',
        parent_uid: null,
        name: 'week 03'
      }
    ]
  }

  updateRecipe() {
    return true
  }

  deleteRecipe() {
    return true
  }

  downloadRecipe() {
    return true
  }

  synchronize() {
    return true
  }
}

module.exports = Paprika
