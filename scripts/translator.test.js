const { Translator } = require("./translator")
var { TranslationsDb } = require("./translations-db")

describe("translates", () => {
  const db = new TranslationsDb("data/db.test.json")
  const translator = new Translator(db, 1)

  it("retrieves from cache first", async () => {
    const dutch = await translator.translate([
      "vegetable oil",
      "large onion",
      "garlic",
      "madras curry paste"
    ])
    expect(dutch).toEqual([
      "plantaardige olie",
      "grote ui",
      "knoflook",
      "Madras curry pasta"
    ])
  })

  it("tries to invoke translation service", async () => {
    expect(translator.translate(["unexisting"])).rejects.toEqual(
      new TypeError("this.service.translate is not a function")
    )
  })

  class TranslatorServiceStub {
    constructor(translator) {
      this.translator = translator
    }

    translate(items) {
      return [this.translator(items)]
    }
  }

  it("translates with translator service", async () => {
    const translator = new Translator(
      db,
      new TranslatorServiceStub(orig => ["baby nieuwe aardappelen"])
    )
    expect(await translator.translate(["baby new potatoes"])).toEqual([
      "baby nieuwe aardappelen"
    ])
  })

  it("does not translate already translated strings", async () => {
    const translationsDb = new TranslationsDb()
    translationsDb.storeTranslations(
      ["baby new potatoes"],
      ["baby nieuwe aardappelen"]
    )
    let items
    const translator = new Translator(
      translationsDb,
      new TranslatorServiceStub(orig => {
        items = orig
        return orig
      })
    )
    expect(
      await translator.translate(["baby nieuwe aardappelen", "medium eggs"])
    ).toEqual(["baby nieuwe aardappelen", "medium eggs"])
    expect(items).toEqual(["medium eggs"])
  })
})
