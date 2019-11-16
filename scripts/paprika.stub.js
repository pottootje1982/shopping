class PaprikaApiStub {
  recipes() {
    return this.recipeStore.map(r => ({ uid: r.uid, hash: r.hash }))
  }

  recipe(uid) {
    return this.recipeStore.find(r => r.uid === uid)
  }

  upsertRecipe(recipe) {
    this.recipeStore.push(recipe)
  }

  constructor() {
    this.recipeStore = [
      {
        rating: 0,
        photo_hash: null,
        on_favorites: false,
        photo: null,
        uid: "3fe04f98-8d73-4e9d-a7da-f4c1241aa3c4",
        scale: null,
        ingredients:
          "Prei\nDille\nBlik tomaten\nZalm\nAardappels\nWijn\nHoning\nkoriander poeder",
        is_pinned: false,
        source: "",
        total_time: "",
        hash:
          "DA475055E02DCFCBA26744E139067B6B8178D93FDE143B755FA0A8B7571610A9",
        description: "",
        source_url: "",
        difficulty: "",
        on_grocery_list: null,
        in_trash: false,
        directions: "",
        categories: ["cef31e04-4245-4483-9e83-34c26ebf267a"],
        photo_url: null,
        cook_time: "",
        name: "Zalm met prei",
        created: "2015-08-29 11:30:47",
        notes: "",
        photo_large: null,
        image_url: null,
        prep_time: "",
        servings: "",
        nutritional_info: ""
      },
      {
        rating: 0,
        photo_hash:
          "347410a4aef70bd061e6cf88c7225f8d0247e5630e1b6a9ad272a777d3ecfb3b",
        on_favorites: false,
        photo: "14354fd0-991f-406d-a32f-c36d9a995c0f.jpg",
        uid: "94ca1528-93ae-4b26-9576-a2dc1ada36c3",
        scale: null,
        ingredients:
          "2 garlic cloves, crushed\n6 tbsp olive oil\n2 x 400g cans chopped tomatoes\n2 tbsp tomato purée\n4 aubergines, cut into long, 5mm thick slices\n85g parmesan (or vegetarian alternative), freshly grated\n20g pack basil, leaves torn\n1 egg, beaten\nLasagna\nRicotta",
        is_pinned: null,
        source: "Bbcgoodfood.com",
        total_time: null,
        hash:
          "41400a3b48471daad789d0d44efc33bfbd1c730e0ad371cf0c4346bf2604999b",
        description: null,
        source_url:
          "http://www.bbcgoodfood.com/recipes/10033/aubergine-tomato-and-parmesan-bake-melanzane-alla-",
        difficulty: "Easy",
        on_grocery_list: null,
        in_trash: null,
        directions:
          "1. Heat oven to 200C/fan 180C/gas 6. In a shallow pan, mix together the garlic and 4 tbsp of the olive oil. Cook over a high heat for 3 mins, tip in the tomatoes, then simmer for 8 mins, stirring every now and then. Stir in the tomato purée.\n\n2. Meanwhile, heat a griddle pan until very hot. Brush a few of the aubergines with a little oil, then add to the pan. Cook over a high heat until well browned and cooked through, about 5-7 mins. Turn them halfway through cooking. Lift onto kitchen paper and do the next batch.\n\n3. When all the aubergines are cooked, lay a few of them in the bottom of an ovenproof dish, then spoon over some sauce. Sprinkle with Parmesan and basil leaves. Add seasoning, then repeat this process with the remaining ingredients. Finally, pour the egg over the top, sprinkle over a little more Parmesan, then bake for 20 mins or until the topping is golden.",
        categories: [
          "eb2b8649-1477-4f62-9c7b-239864246748",
          "f172bbb8-2b65-485d-bb57-3575b7c686bb"
        ],
        photo_url:
          "http://uploads.paprikaapp.com.s3.amazonaws.com/150068/14354fd0-991f-406d-a32f-c36d9a995c0f.jpg?Signature=tX%2FJz4Dyt%2FlUJn4ZdwH%2B%2BT4ewyU%3D&Expires=1569527941&AWSAccessKeyId=AKIAJA4A42FBJBMX5ARA",
        cook_time: "50 min",
        name: "Aubergine, tomato & Parmesan bake (Melanzane alla Parmigiana)",
        created: "2015-08-29 11:37:51",
        notes: "",
        photo_large: null,
        image_url:
          "http://www.bbcgoodfood.com/sites/bbcgoodfood.com/files/styles/bbcgf_recipe/public/recipe_images/recipe-image-legacy-id--327515_12.jpg?itok=ZqsycSvB",
        prep_time: "10 min",
        servings: "6",
        nutritional_info:
          "kcalories 225\nprotein 10g\ncarbs 8g\nfat 17g\nsaturates 5g\nfibre 5g\nsugar 7g\nsalt 0.52g"
      }
    ]
  }
}

module.exports = PaprikaApiStub
