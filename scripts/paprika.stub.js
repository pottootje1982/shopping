class Paprika {
  constructor(_paprikaApi, db) {
    this.recipeDb = db || recipeDb
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
        order_flag: 30,
        uid: "ca2fe4b6-276f-4145-b767-8f2f963aa347",
        parent_uid: null,
        name: "deserts",
      },
      {
        order_flag: 31,
        uid: "955BEEAF-4018-4E7F-963B-A5423378DFB3",
        parent_uid: null,
        name: "Nieuw1",
      },
      {
        order_flag: 32,
        uid: "684B1B19-9580-4699-9F5A-C0625D48EE07",
        parent_uid: null,
        name: "Nieuw2",
      },
      {
        order_flag: 33,
        uid: "EFC76BB4-11DC-41FA-80EC-E50C964014B4",
        parent_uid: null,
        name: "Nieuw3",
      },
      {
        order_flag: 25,
        uid: "f0542f5f-f229-4676-beaf-661ad51d8e04",
        parent_uid: null,
        name: "veg 01",
      },
      {
        order_flag: 25,
        uid: "46ae00bb-ae88-4c3e-b4b4-9920454f6c61",
        parent_uid: null,
        name: "veg 02",
      },
      {
        order_flag: 25,
        uid: "03064af3-f575-4553-83ad-e13b124cb229",
        parent_uid: null,
        name: "veg 03",
      },
      {
        order_flag: 27,
        uid: "56C2F897-9B64-445E-8308-5434659E23BF-3968-00000749013C2A2F",
        parent_uid: null,
        name: "veg 04",
      },
      {
        order_flag: 28,
        uid: "5bd9646b-dffd-4f44-bb0f-468d4454fda5",
        parent_uid: null,
        name: "veg 05",
      },
      {
        order_flag: 30,
        uid: "bdd9284e-6313-49b0-89b9-56ace728cc04",
        parent_uid: null,
        name: "veg 06",
      },
      {
        order_flag: 30,
        uid: "8a00147f-4836-4030-9f4a-3e0e61abc8c6",
        parent_uid: null,
        name: "veg 07",
      },
      {
        order_flag: 26,
        uid: "525b5f11-7683-41d2-bb6c-1061b193555b",
        parent_uid: null,
        name: "Vis 01",
      },
      {
        order_flag: 29,
        uid: "744b165a-cbff-4c1a-8148-0c5a31ba8bd5",
        parent_uid: null,
        name: "Vis 02",
      },
      {
        order_flag: 0,
        uid: "f172bbb8-2b65-485d-bb57-3575b7c686bb",
        parent_uid: null,
        name: "week 01",
      },
      {
        order_flag: 1,
        uid: "2b047c3c-cffa-4e10-8654-06bd327d2901",
        parent_uid: null,
        name: "week 02",
      },
      {
        order_flag: 2,
        uid: "830ee6d1-21b3-4946-baaf-57efd9954b3d",
        parent_uid: null,
        name: "week 03",
      },
      {
        order_flag: 3,
        uid: "b7ac6a4e-d119-4580-9a3e-7a3571d5beff",
        parent_uid: null,
        name: "week 04",
      },
      {
        order_flag: 4,
        uid: "727f38bc-fe37-4de8-9395-a9c5b416134b",
        parent_uid: null,
        name: "week 05",
      },
      {
        order_flag: 5,
        uid: "f485969b-471c-4fa3-92ba-fde0d64a3125",
        parent_uid: null,
        name: "week 06",
      },
      {
        order_flag: 6,
        uid: "c85a7d57-e1f3-4719-8e84-98cf27b14488",
        parent_uid: null,
        name: "week 07",
      },
      {
        order_flag: 7,
        uid: "78fd31cf-6102-45ef-93a5-761c79e212b9",
        parent_uid: null,
        name: "week 08",
      },
      {
        order_flag: 8,
        uid: "068d4a7e-c5be-40a1-8f09-a6d9f15156d3",
        parent_uid: null,
        name: "week 09",
      },
      {
        order_flag: 9,
        uid: "e3161503-25e2-4b35-9f32-3910b4163893",
        parent_uid: null,
        name: "week 10",
      },
      {
        order_flag: 10,
        uid: "ae9f66ed-2f7e-4b0e-9b83-e0b3f14af4ad",
        parent_uid: null,
        name: "week 11",
      },
      {
        order_flag: 11,
        uid: "0e61237d-0882-412b-9e30-1dd39055a30c",
        parent_uid: null,
        name: "week 12",
      },
      {
        order_flag: 12,
        uid: "5f4e91a6-c660-4758-ba01-45c0e832fcca",
        parent_uid: null,
        name: "week 13",
      },
      {
        order_flag: 13,
        uid: "ef19a204-fc36-4acf-af82-75ad4627cc48",
        parent_uid: null,
        name: "week 14",
      },
      {
        order_flag: 14,
        uid: "c8cde7c9-6377-4484-8c56-3361ef8889d5",
        parent_uid: null,
        name: "week 15",
      },
      {
        order_flag: 15,
        uid: "de967981-f833-4786-8d76-5cba062a5618",
        parent_uid: null,
        name: "week 16",
      },
      {
        order_flag: 16,
        uid: "eadef28b-bb18-45ae-abd2-d7ea45f984b4",
        parent_uid: null,
        name: "week 17",
      },
      {
        order_flag: 17,
        uid: "5c6b86d0-a7b8-4798-b1fa-50753dc79672",
        parent_uid: null,
        name: "week 18",
      },
      {
        order_flag: 18,
        uid: "1d9ec102-f163-4149-9822-d461f001c1f3",
        parent_uid: null,
        name: "week 19",
      },
      {
        order_flag: 19,
        uid: "eb2b8649-1477-4f62-9c7b-239864246748",
        parent_uid: null,
        name: "week 20",
      },
      {
        order_flag: 20,
        uid: "cef31e04-4245-4483-9e83-34c26ebf267a",
        parent_uid: null,
        name: "week 21",
      },
      {
        order_flag: 21,
        uid: "01c36ce7-a475-4e8a-9393-99692ae958da",
        parent_uid: null,
        name: "week 22",
      },
      {
        order_flag: 22,
        uid: "0335bc77-1572-44a0-97e0-fb621507bf8a",
        parent_uid: null,
        name: "week 23",
      },
      {
        order_flag: 23,
        uid: "4bcd6554-fe30-4a82-87f6-f1002ff8d5e9",
        parent_uid: null,
        name: "week 24",
      },
      {
        order_flag: 24,
        uid: "537ee6e1-2827-436a-9912-c263b6b20530",
        parent_uid: null,
        name: "week 25",
      },
      {
        order_flag: 25,
        uid: "7a4d23a8-1d9c-44c3-8b16-0c5ae105b7f0",
        parent_uid: null,
        name: "week 26",
      },
      {
        order_flag: 30,
        uid: "5b53c886-24ff-41f8-a392-e96092ca9a16",
        parent_uid: null,
        name: "week 27",
      },
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
    return this.recipeDb.getRecipes()
  }
}

module.exports = Paprika
