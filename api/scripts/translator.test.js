const Translator = require('./translator')
var TranslationDb = require('./translations-db')

describe('translates', () => {
  const db = new TranslationDb('data/db.test.json')
  const translator = new Translator(db, 1)

  it('retrieves from cache first', async () => {
    const dutch = await translator.translate(
      ['vegetable oil', 'large onion', 'garlic', 'madras curry paste'],
      'nl'
    )
    expect(dutch).toEqual([
      'plantaardige olie',
      'grote ui',
      'knoflook',
      'Madras curry pasta'
    ])
  })

  it('tries to invoke translation service', async () => {
    expect(translator.translate(['unexisting'], 'nl')).rejects.toEqual(
      new TypeError('this.service.translate is not a function')
    )
  })
})
