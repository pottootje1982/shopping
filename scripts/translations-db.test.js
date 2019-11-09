var { TranslationsDb } = require('./translations-db')

describe('storeTranslations()', () => {
  const db = new TranslationsDb()
  db.storeTranslations(
    [
      'vegetable oil',
      'large onion',
      'garlic clove',
      'madras curry paste',
      'can tomatoes',
      'vegetable stock',
      'sustainable white fish fillets',
      'rice or naan bread',
      'leek',
    ],
    [
      'plantaardige olie',
      'grote ui',
      'teentje knoflook',
      'Madras curry pasta',
      'kunnen tomaten',
      'groentebouillon',
      'duurzame witte visfilets',
      'rijst of naanbrood',
      'leek', // for some reason it cannot translate leek whereas the web ui can do this
    ]
  )

  it('retrieves stored translations', () => {
    expect(db.getTranslation('vegetable oil')).toBe('plantaardige olie')
    let { success, translations, untranslated } = db.getTranslations([
      'vegetable oil',
      'large onion',
      'garlic clove',
      'leek',
    ])
    expect(success).toBe(true)
    expect(translations).toEqual([
      'plantaardige olie',
      'grote ui',
      'teentje knoflook',
      'leek',
    ])
  })

  it('returns untranslated', () => {
    ;({ success, translations, untranslated } = db.getTranslations([
      'unexisting',
      'large onion',
      'garlic clove',
    ]))
    expect(success).toBe(false)
    expect(translations).toEqual([undefined, 'grote ui', 'teentje knoflook'])
    expect(untranslated).toEqual(['unexisting'])
  })
})
