const { Ingredient, Ingredients } = require("./ingredients")
const recipeDb = require("./recipe-db.stub")()

describe("Ingredient", () => {
  const recipes = recipeDb.getRecipes()

  it("divides into quantity, unit & ingredient", () => {
    const i = new Ingredient("1 tbsp sugar")
    expect(i.quantity).toBe(1)
    expect(i.unit).toBe("tbsp")
    expect(i.ingredient).toBe("sugar")
  })

  it("matches", () => {
    equals("2 eetl. suiker", [2, "eetl.", "suiker"])
    equals("2 eetlepel suiker", [2, "eetlepel", "suiker"])
    equals("2 eetlepels suiker", [2, "eetlepels", "suiker"])

    equals("2 small knobs of butter", [2, "small knobs", "of butter"])
    equals("3 ons knakworst", [3, "ons", "knakworst"])
  })

  it("divides into quantity, unit & ingredient", () => {
    equals("1 tbs sugar", [1, "tbs", "sugar"])
  })

  it("no unit or quantity", () => {
    equals("lasagne", [undefined, undefined, "lasagne"])
  })

  it("contains no unit", () => {
    equals("2 garlic cloves", [2, "cloves", "garlic"])
  })

  it("contains multiplication", () => {
    equals("2 x 400g cans chopped tomatoes", [
      2,
      "400g cans",
      "chopped tomatoes"
    ])
  })

  it("contains comma", () => {
    equals("2 courgettes, sliced thickly (about 300g)", [
      2,
      undefined,
      "courgettes"
    ])
    equals("4 aubergines, cut into long, 5mm thick slices", [
      4,
      undefined,
      "aubergines"
    ])
  })

  it("contains dash in quantity", () => {
    equals("1-2 tsp sugar", ["1-2", "tsp", "sugar"])
  })

  it("contains ½ in quantity", () => {
    equals("1½ tbsp curry leaves", ["1½", "tbsp", "curry leaves"])
  })

  it("contains ½ in multiplication", () => {
    equals("½ x 200g pack raw cooking chorizo", [
      "½",
      "200g pack",
      "raw cooking chorizo"
    ])
  })

  it("removes parentheses", () => {
    expect(
      Ingredient.prototype.filterIng(
        `1-2 tbsp madras curry paste (we used Patak's)`
      )
    ).toBe("1-2 tbsp madras curry paste")
    expect(
      Ingredient.prototype.filterIngLine("25 g basilicum (ca. 15 takjes)")
    ).toBe("25 g basilicum")
    expect(
      Ingredient.prototype.filterIng("2 blikken (à 400 ml) tomaatstukjes;")
    ).toBe("2 blikken tomaatstukjes;")
    expect(Ingredient.prototype.filterIng("1 liter (runder)bouillon")).toBe(
      "1 liter (runder)bouillon"
    )
  })

  it("removes commas", () => {
    expect(Ingredient.prototype.filterIng("25 g basilicum, groen")).toBe(
      "25 g basilicum"
    )
  })

  function equals(line, expected) {
    const i = new Ingredient(line)
    expect(i.all).toEqual(expected)
  }

  it("validations from recipes from db.test.json", () => {
    equals("1/2 tl Baking soda", ["1/2", "tl", "Baking soda"])
    equals("1¼kg beef mince", ["1¼", "kg", "beef mince"])
    equals("2 x 400g tins tomatoes or peeled cherry tomatoes", [
      2,
      "400g tins",
      "tomatoes or peeled cherry tomatoes"
    ])
    equals("3 stengels citroengras", [3, "stengels", "citroengras"])
    equals("3 tenen knoflook", [3, "tenen", "knoflook"])
    equals("3 teentjes knoflook", [3, "teentjes", "knoflook"])
    equals("4 eetlepels Thaise vissaus", [4, "eetlepels", "Thaise vissaus"])
    equals("1 eetlepel suiker", [1, "eetlepel", "suiker"])
    equals("handje korianderblad", [undefined, "handje", "korianderblad"])
    equals("1 blik tomaatblokjes", [1, "blik", "tomaatblokjes"])
    equals("1 theelepel gemalen piment", [1, "theelepel", "gemalen piment"])
    equals("3 eetlepels rode-wijnazijn", [3, "eetlepels", "rode-wijnazijn"])
    equals("1 fles witte wijn", [1, "fles", "witte wijn"])
    equals("1 bosje korianderblad grof gesneden", [
      1,
      "bosje",
      "korianderblad grof gesneden"
    ])
    equals("4 el. olijfolie", [4, "el.", "olijfolie"])
    equals("150 gr zwarte olijven zonder pit", [
      150,
      "gr",
      "zwarte olijven zonder pit"
    ])
    equals("4 eetl. olijfolie van goede kwaliteit", [
      4,
      "eetl.",
      "olijfolie van goede kwaliteit"
    ])
    equals("10 blaadjes verse basilicum", [10, "blaadjes", "verse basilicum"])
    equals("150 ml pot natural low-fat yogurt", [
      150,
      "ml pot",
      "natural low-fat yogurt"
    ])
    equals("handful Thai basil leaves or coriander leaves", [
      undefined,
      "handful",
      "Thai basil leaves or coriander leaves"
    ])
    equals("1½ l boiling vegetable stock", [
      "1½",
      "l",
      "boiling vegetable stock"
    ])
    equals("170 g pack smoked salmon", [170, "g pack", "smoked salmon"])
    equals("1 bosje bladpeterselie", [1, "bosje", "bladpeterselie"])
    equals("handje bloem", [undefined, "handje", "bloem"])
    equals("4 plakken kalfsschenkel à ongeveer 200 gram", [
      4,
      "plakken",
      "kalfsschenkel à ongeveer 200 gram"
    ])
    equals("2 stengels bleekselderij", [2, "stengels", "bleekselderij"])
    equals("1 blik tomaatstukjes", [1, "blik", "tomaatstukjes"])
    equals("pinch of chilli flakes", [undefined, "pinch", "of chilli flakes"])
    equals("1 stukje asem (tamarinde)", [1, "stukje", "asem"])
    equals("3 eetl. olie", [3, "eetl.", "olie"])
    equals("2 theel. sambal oelek", [2, "theel.", "sambal oelek"])
    equals("1 snufje nootmuskaat", [1, "snufje", "nootmuskaat"])
    equals("few thyme sprigs", [undefined, "few", "thyme sprigs"])
    equals("1 takje rozemarijn", [1, "takje", "rozemarijn"])
    equals("1 blaadje laurier;", [1, "blaadje", "laurier;"])
    equals("snufje versgeraspte nootmuskaat", [
      undefined,
      "snufje",
      "versgeraspte nootmuskaat"
    ])
    equals("1l kippen- of groentebouillon", [
      1,
      "l",
      "kippen- of groentebouillon"
    ])
    equals("knob of butter", [undefined, "knob", "of butter"])
    equals("splash of milk", [undefined, "splash", "of milk"])
    equals("4 ons schelpjespasta", [4, "ons", "schelpjespasta"])
    equals("5 cm piece ginger", [5, "cm piece", "ginger"])
    equals("400g bag mixed seafood", [400, "g bag", "mixed seafood"])
    equals("1,5 kilo vastkokende aardappelen", [
      "1,5",
      "kilo",
      "vastkokende aardappelen"
    ])
    equals("1 fles d`Apremont", [1, "fles", "d`Apremont"])
    equals("4 cm geschilde gemberwortel", [4, "cm", "geschilde gemberwortel"])
    equals("300 ml tub half-fat crème fraîche", [
      300,
      "ml",
      "tub half-fat crème fraîche"
    ])
    equals("1/2 cup pure maple syrup", ["1/2", "cup", "pure maple syrup"])
    equals("2 dl vleesjus", [2, "dl", "vleesjus"])
    equals("pinch asafoetida", [undefined, "pinch", "asafoetida"])

    equals("1/2 teaspoon(s) baking soda", ["1/2", "teaspoon(s)", "baking soda"])
    equals("small knob salted butter", [
      undefined,
      "small knob",
      "salted butter"
    ])
    equals("1 groot glas droge witte wijn", [
      1,
      "groot glas",
      "droge witte wijn"
    ])
    equals("small piece fresh ginger", [
      undefined,
      "small piece",
      "fresh ginger"
    ])

    equals("4 slices wholemeal seeded bread", [
      4,
      undefined,
      "slices wholemeal seeded bread"
    ])
    equals("3 cloves garlic", [3, "cloves", "garlic"])
    equals("1 litre lamb or chicken stock", [
      1,
      "litre",
      "lamb or chicken stock"
    ])
    equals("2 nests medium egg noodles", [2, "nests", "medium egg noodles"])
    equals("12 rashers smoked streaky bacon", [
      12,
      "rashers",
      "smoked streaky bacon"
    ])
    equals("3 strips orange zest", [3, "strips", "orange zest"])
    equals("5 vellen filobladerdeeg", [5, "vellen", "filobladerdeeg"])
    equals("2-3 sprigs curley parsley", ["2-3", "sprigs", "curley parsley"])
    equals("1 citroen (schoongeboend)", [1, undefined, "citroen"])
    equals("2 x 460g jars roasted red peppers", [
      2,
      "460g jars",
      "roasted red peppers"
    ])
    equals("2x400 g organic tinned plum tomatoes", [
      2,
      "400 g organic tinned",
      "plum tomatoes"
    ])
    equals("2 x 140g skinless hake fillets", [
      2,
      "140g skinless",
      "hake fillets"
    ])
    equals("1 – 2 sinaasappels, in parten", [
      "1 – 2",
      undefined,
      "sinaasappels"
    ])
    equals("1 ½ tsp ground turmeric", ["1 ½", "tsp", "ground turmeric"])
    equals("4 1/2 dl visbouillon", ["4 1/2", "dl", "visbouillon"])
    equals("250g pack shiitake or chestnut mushrooms, thickly sliced", [
      250,
      "g pack",
      "shiitake or chestnut mushrooms"
    ])
    equals("500g gepelde, gehalveerde sjalotjes", [
      500,
      "g gepelde, gehalveerde",
      "sjalotjes"
    ])
    equals("2 boneless, skinless chicken breasts", [
      2,
      "boneless, skinless",
      "chicken breasts"
    ])
    equals("2 blikken (à 400 ml) tomaatstukjes", [
      2,
      "blikken",
      "tomaatstukjes"
    ])
    equals("1 liter (runder)bouillon;", [1, "liter", "(runder)bouillon;"])
    equals("1 bunch Tuscan kale", [1, "bunch", "Tuscan kale"])
    equals("250 gram pastinaak", [250, "gram", "pastinaak"])
    equals("8 baby new potatoes", [8, undefined, "baby new potatoes"])
    equals("400g can cannellini beans, drained", [
      400,
      "g can",
      "cannellini beans"
    ])
    equals("2 5-ounce skin-on firm white fish fillets (such as branzino)", [
      2,
      "5-ounce",
      "skin-on firm white fish fillets"
    ])
  })

  it("filters ingredients list", () => {
    const ingredients = Ingredients.create(
      "Ingredient\n4 personen\n2 theelepel suiker"
    )
    expect(ingredients.length).toBe(1)
    expect(ingredients[0].all).toEqual([2, "theelepel", "suiker"])
  })

  it("all ingredients from Paprika can be parsed", () => {
    const parsedIngredients = recipes
      .slice(0, 12)
      .map(recipe => recipe.ingredients)

    // const fs = require('fs')
    // fs.writeFile('Output.json', JSON.stringify(parsedIngredients))

    equalsAll(parsedIngredients, [
      [
        [undefined, undefined, "Prei"],
        [undefined, undefined, "Dille"],
        [undefined, "Blik", "tomaten"],
        [undefined, undefined, "Zalm"],
        [undefined, undefined, "Aardappels"],
        [undefined, undefined, "Wijn"],
        [undefined, undefined, "Honing"],
        [undefined, undefined, "koriander poeder"]
      ],
      [
        [2, "cloves", "garlic"],
        [6, "tbsp", "olive oil"],
        [2, "400g cans", "chopped tomatoes"],
        [2, "tbsp", "tomato purée"],
        [4, undefined, "aubergines"],
        [85, "g", "parmesan"],
        [20, "g pack", "basil"],
        [1, undefined, "egg"],
        [undefined, undefined, "Lasagna"],
        [undefined, undefined, "Ricotta"]
      ],

      [
        [250, "gram", "pastinaak"],
        [200, "gram", "wortel"],
        [4, undefined, "kruimige aardappels"],
        [2, undefined, "braadworsten"],
        [undefined, undefined, "melk"],
        [25, "gram", "boter"],
        [undefined, undefined, "zout en peper"]
      ],

      [
        [1, "tbsp", "vegetable oil"],
        [1, undefined, "large onion"],
        [1, "clove", "garlic"],
        ["1-2", "tbsp", "madras curry paste"],
        [400, "g can", "tomatoes"],
        [200, "ml", "vegetable stock"],
        [undefined, undefined, "sustainable white fish fillets"],
        [undefined, undefined, "rice or naan bread"]
      ],

      [
        [2, undefined, "eieren"],
        [200, "g", "bloem"],
        [1, undefined, "mespunt zout"],
        [120, "g", "suiker"],
        [1, "tl", "bakpoeder"],
        [1, undefined, "citroen"],
        [100, "g", "amandelen"],
        [2, "el", "halfvolle melk"],
        [undefined, undefined, "Keukenspullen"],
        [undefined, undefined, "bakpapier"]
      ],

      [
        [300, "g", "baby new potato"],
        [undefined, undefined, "New potatoes"],
        [2, undefined, "trout fillets"],
        [undefined, undefined, "vegetable oil"],
        [200, "g pack", "green vegetable medley"],
        [200, "ml", "tub hollandaise sauce"],
        [undefined, "small bunch", "mint"]
      ],

      [
        [undefined, undefined, "For the egg curry"],
        [4, "tbsp", "vegetable oil"],
        ["1½", "tsp", "mustard seeds"],
        ["1½", "tbsp", "curry leaves"],
        [2, undefined, "large red onions"],
        [50, "g", "ginger"],
        [1, "tsp", "turmeric"],
        ["½", "tsp", "chilli powder"],
        [2, "400g cans", "chopped tomatoes"],
        ["1-2", "tsp", "sugar"],
        [8, undefined, "eggs"],
        [undefined, "small bunch", "coriander"],
        [undefined, undefined, "For the rice and lentils"],
        [250, "g", "basmati rice"],
        [140, "g", "split red lentils"],
        [4, "tbsp", "vegetable oil"],
        [2, undefined, "onions"],
        [50, "g", "ginger"],
        [3, undefined, "whole green chillies"],
        [2, undefined, "bay leaves"],
        [undefined, undefined, "mango chutney"]
      ],

      [
        [500, "g slim young", "leeks"],
        [300, "g", "broccoli"],
        [3, undefined, "celery sticks"],
        ["1½", "kg", "floury potatoes"],
        [85, "g", "butter"],
        [170, "g pot", "0% fat Greek yogurt"],
        [850, "ml", "semi-skimmed milk"],
        [75, "g", "plain flour"],
        [2, "tsp", "English mustard"],
        [1, "tsp", "wholegrain mustard"],
        [300, "g pack", "mature cheddar"],
        [undefined, "handful", "frozen peas"]
      ],

      [
        [undefined, undefined, "mild olive oil"],
        ["½", "200g pack", "raw cooking chorizo"],
        [1, undefined, "onion"],
        [260, "g bag", "spinach"],
        [2, "140g skinless", "hake fillets"],
        ["½", "tsp", "sweet smoked paprika"],
        [1, undefined, "red chilli"],
        [400, "g can", "cannellini beans"],
        [undefined, undefined, "juice ½ lemon"],
        [1, "tbsp", "extra virgin olive oil"],
        [undefined, undefined, "Quick garlic mayonnaise"]
      ],

      [
        [undefined, "thumb-sized piece", "ginger"],
        [1, "clove", "garlic"],
        [6, "tbsp", "light soy sauce"],
        [4, "tbsp", "rice wine vinegar"],
        [4, undefined, "salmon fillets"],
        [200, "g", "soba noodles"],
        [350, "g", "frozen soya beans"],
        [2, "175g packs", "baby corn and mange tout mix"]
      ],

      [
        [1, "tbsp", "olive oil"],
        [2, "rashers", "smoked streaky bacon"],
        [1, undefined, "onion"],
        [1, undefined, "celery"],
        [1, undefined, "medium carrot"],
        [undefined, undefined, "Carrot"],
        [2, "cloves", "garlic"],
        [500, "g", "beef mince"],
        [1, "tbsp", "tomato purée"],
        [2, "400g cans", "chopped tomatoes"],
        [1, "tbsp", "clear honey"],
        [500, "g pack", "fresh egg lasagne sheets"],
        [400, "ml", "crème fraîche"],
        [125, "g", "ball mozzarella"],
        [50, "g", "freshly grated Parmesan"],
        [undefined, "large handful", "basil leaves"]
      ],

      [
        [30, "g", "pijnboompitten"],
        [200, "g", "vastkokende aardappels"],
        [400, "g", "tagliatelle of een andere pastasoort"],
        [100, "g", "sperziebonen"],
        [20, "g", "versgeraspte Parmezaanse kaas"],
        [8, "blaadjes", "basilicum"],
        [undefined, undefined, "Voor de pesto:"],
        [1, "teentje", "knoflook"],
        [25, "g", "pijnboompitten"],
        [25, "g", "basilicum"],
        [20, "g", "versgeraspte Parmezaanse kaas"],
        [100, "ml", "extra vierge olijfolie"]
      ]
    ])
  })
})

function equalsIngredients(ingredients, expIngredients) {
  ingredients.forEach((ingr, i) => {
    expect(ingr.all).toEqual(expIngredients[i])
  })
}

function equalsAll(all, expAll) {
  all.forEach((item, i) => {
    equalsIngredients(item, expAll[i])
  })
}
