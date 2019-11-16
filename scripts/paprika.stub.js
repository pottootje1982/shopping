class PaprikaApiStub {
  recipes() {
    return this.recipeStore.map(r => ({ uid: r.uid, hash: r.hash }))
  }

  recipe(uid) {
    return this.recipeStore.find(r => r.uid === uid)
  }

  upsertRecipe(recipe) {
    const found = this.recipeStore.find(r => r.uid === recipe.uid)
    if (found) {
      this.recipeStore.splice(this.recipeStore.indexOf(found), 1, recipe)
    } else {
      this.recipeStore.push(recipe)
    }
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
        hash: "different hash",
        description: "",
        source_url: "",
        difficulty: "",
        on_grocery_list: null,
        in_trash: false,
        directions: "",
        categories: ["cef31e04-4245-4483-9e83-34c26ebf267a"],
        photo_url: null,
        cook_time: "",
        name: "Zalm met prei 2",
        created: "2019-08-29 11:30:47", // newer timestamp than the one in db.test.json
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
        hash: "different hash 2",
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
      },
      {
        rating: 0,
        photo_hash:
          "e063c51a55584123e4f39a506f5970ce6ad3237cd97755f2d3dbb99807ba6046",
        on_favorites: false,
        photo: "0f512f99-54ed-43c1-9157-e1affaddd085.jpg",
        uid: "a4623ba1-8bf2-439d-b8bb-4c95c4aa8b18",
        scale: null,
        ingredients:
          "1 tbsp vegetable oil\n1 large onion, chopped\n1 garlic clove, chopped\n1-2 tbsp madras curry paste (we used Patak's)\n400g can tomatoes\n200ml vegetable stock\nsustainable white fish fillets, skinned and cut into big chunks\nrice or naan bread",
        is_pinned: null,
        source: "Bbcgoodfood.com",
        total_time: null,
        hash:
          "ae2808c0fa46a7ac90ca3ba41b55e0822e838ffca4cfe62ae1aa5a595fb4222c",
        description: null,
        source_url:
          "http://www.bbcgoodfood.com/recipes/4666/superquick-fish-curry",
        difficulty: "Easy",
        on_grocery_list: null,
        in_trash: null,
        directions:
          "1. Heat the oil in a deep pan and gently fry the onion and garlic for about 5 mins until soft. Add the curry paste and stir-fry for 1-2 mins, then tip in the tomatoes and stock.\n\n2. Bring to a simmer, then add the fish. Gently cook for 4-5 mins until the fish flakes easily. Serve immediately with rice or naan",
        categories: ["b7ac6a4e-d119-4580-9a3e-7a3571d5beff"],
        photo_url:
          "http://uploads.paprikaapp.com.s3.amazonaws.com/150068/0f512f99-54ed-43c1-9157-e1affaddd085.jpg?Signature=GOHIU4TwDyEVEOTsiJTMq1fmaJA%3D&Expires=1569527943&AWSAccessKeyId=AKIAJA4A42FBJBMX5ARA",
        cook_time: "10 min",
        name: "Super-quick fish curry 2",
        created: "2017-07-24 22:55:30", // newer timestamp but same hash won't update local version
        notes: "",
        photo_large: null,
        image_url:
          "http://www.bbcgoodfood.com/sites/bbcgoodfood.com/files/recipe_images/recipe-image-legacy-id--513547_11.jpg",
        prep_time: "5 min",
        servings: "4",
        nutritional_info:
          "kcalories 191\nprotein 30g\ncarbs 9g\nfat 5g\nsaturates 1g\nfibre 2g\nsugar 6g\nsalt 0.54g"
      },
      {
        rating: 0,
        photo_hash:
          "6e3cc47fe2ef99fa92aeec16fbabc1c8f7fa9b7998ab029769fd43fedfb4da3e",
        on_favorites: false,
        photo: "441ea8d4-3651-4f98-8b9b-7fa31bee30d8.jpg",
        uid: "23eb8422-d621-4253-a2be-5849ef8ac0a7",
        scale: null,
        ingredients:
          "Ingrediënten\n2 eieren\n200 g bloem (+ extra voor bestuiven)\n1 mespunt zout\n120 g suiker\n1 tl bakpoeder\n1 citroen (schoongeboend)\n100 g amandelen\n2 el halfvolle melk\nZet deze ingrediënten op mijn lijst\nKeukenspullen\nbakpapier",
        is_pinned: null,
        source: "Ah.nl",
        total_time: null,
        hash:
          "29c2840bcdb320395347378f7932394dfb4b41343cbffcb1d17ae16586174512",
        description: null,
        source_url: "https://www.ah.nl/allerhande/recept/R-R742100/cantuccini",
        difficulty: "Easy",
        on_grocery_list: null,
        in_trash: null,
        directions:
          "Verwarm de oven voor op 180 °C. Splits 1 ei en houd de eidooier apart. Doe het eiwit in een kom en klop los met het andere ei. Zeef de bloem erboven. Meng het zout, de suiker en het bakpoeder erdoor. Rasp de gele schil van de citroen erboven. Voeg de amandelen toe aan het mengsel. Kneed tot een soepel deeg.\n\nBestuif het werkblad en je handen licht met bloem. Vorm van het deeg 2 lange staven van ca. 4 cm breed. Leg deze op een met bakpapier beklede bakplaat met voldoende tussenruimte (ze worden breder tijdens het bakken). Klop de eidooier los met de melk. Bestrijk het deeg ermee. Bak in de oven in ca. 20 min. goudgeel. Neem uit de oven en snijd de nog warme koek in schuine plakjes van 1 ½ cm dik. Leg de koekjes op hun kant en bak ze nog ca. 8 min. Tot ze goudbruin en wat donkerder langs de randen zijn. Laat afkoelen.\n\nBewaartip: In een luchtdichte trommel kun je de cantuccini 2 weken bewaren.\n\nprint",
        categories: [],
        photo_url:
          "http://uploads.paprikaapp.com.s3.amazonaws.com/150068/441ea8d4-3651-4f98-8b9b-7fa31bee30d8.jpg?Signature=8F3alE3CsqzwQp0N1KlfuEv7pMw%3D&Expires=1569527944&AWSAccessKeyId=AKIAJA4A42FBJBMX5ARA",
        cook_time: "10 min",
        name: "Cantuccini",
        created: "2017-12-23 09:07:38",
        notes: "",
        photo_large: null,
        image_url:
          "https://static.ah.nl/static/recepten/img_073452_890x594_JPG.jpg",
        prep_time: "",
        servings: "",
        nutritional_info:
          "Voedingswaarden\n(per stuk)\nenergie 95 kcal\neiwit 3 g\nkoolhydraten 13 g\nvet 3 g\nwaarvan verzadigd 0 g\nnatrium 50 mg\nvezels 1 g"
      }
    ]
  }
}

module.exports = PaprikaApiStub
