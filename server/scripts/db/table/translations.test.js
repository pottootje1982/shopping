const createDb = require("../tables")

describe("storeTranslations()", () => {
  let translationsDb

  beforeEach(async () => {
    ;({ translationsDb } = await createDb("./memory-db", "data/db.test.json"))
    translationsDb.storeTranslations(
      [
        "vegetable oil",
        "large onion",
        "garlic clove",
        "madras curry paste",
        "can tomatoes",
        "vegetable stock",
        "sustainable white fish fillets",
        "rice or naan bread",
        "leek",
      ],
      [
        "plantaardige olie",
        "grote ui",
        "teentje knoflook",
        "Madras curry pasta",
        "kunnen tomaten",
        "groentebouillon",
        "duurzame witte visfilets",
        "rijst of naanbrood",
        "leek", // for some reason it cannot translate leek whereas the web ui can do this
      ]
    )
  })

  it("retrieves stored translations", async () => {
    expect(await translationsDb.getTranslation("vegetable oil")).toBe(
      "plantaardige olie"
    )
    let { success, translations, untranslated } =
      await translationsDb.getTranslations([
        "Vegetable oil",
        "large onion",
        "garlic clove",
        "leek",
      ])
    expect(success).toBeTruthy()
    expect(translations).toEqual([
      "plantaardige olie",
      "grote ui",
      "teentje knoflook",
      "prei",
    ])
  })

  it("returns untranslated", async () => {
    ;({ success, translations, untranslated } =
      await translationsDb.getTranslations([
        "unexisting",
        "large onion",
        "garlic clove",
      ]))
    expect(success).toBe(false)
    expect(translations).toEqual([undefined, "grote ui", "teentje knoflook"])
    expect(untranslated).toEqual(["unexisting"])
  })
})
