const { Translator } = require('./translator')
var { TranslationsDb } = require('./translations-db')

describe('translates', () => {
  const db = new TranslationsDb('data/db.test.json')
  const translator = new Translator(db)

  it('retrieves from cache first', async () => {
    const dutch = await translator.translate([
      'vegetable oil',
      'large onion',
      'garlic',
      'madras curry paste'
    ])
    expect(dutch).toEqual([
      'plantaardige olie',
      'grote ui',
      'knoflook',
      'Madras curry pasta'
    ])
  })

  it('tries to invoke translation service', async () => {
    expect(translator.translate(['unexisting'])).rejects.toEqual(
      new TypeError('this.service.translate is not a function')
    )
  })
})
