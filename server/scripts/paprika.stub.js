class Paprika {
  constructor(db) {
    this.recipeDb = db
  }

  async getRecipe(uid) {
    return this.paprikaApi.recipe(uid)
  }

  async getRecipes() {
    return true
  }

  async categories() {
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

  async updateRecipe() {
    return true
  }

  async deleteRecipe() {
    return true
  }

  async downloadRecipe() {
    return {
      _id: '60fd46b3be4079d135edc694',
      uid: '00fb7960-bdd1-4796-b13f-a7dbff348e4f',
      name: 'Spinach, Sweet Potato & Lentil Dhal'
    }
  }

  async synchronize() {
    return true
  }
}

Paprika.create = async (recipeDb) => {
  return new Paprika(recipeDb)
}

module.exports = Paprika
