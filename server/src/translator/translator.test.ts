import { createTestDbs } from '../test/create-test-db';

import Translator from './translator';
jest.mock('@google-cloud/translate');
import { v2 } from '@google-cloud/translate';

describe('translates', () => {
  let translationsDb, translator;

  beforeAll(async () => {
    ({ translationsDb } = await createTestDbs());
    translationsDb.storeTranslations(
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
      ],
    );
    translator = new Translator(translationsDb);
  });

  it('retrieves from cache first', async () => {
    const dutch = await translator.translate([
      'vegetable oil',
      'large onion',
      'garlic',
      'madras curry paste',
    ]);
    expect(dutch).toEqual([
      'plantaardige olie',
      'grote ui',
      'knoflook',
      'Madras curry pasta',
    ]);
  });

  it('tries to invoke translation service', async () => {
    expect(translator.translate(['unexisting'])).rejects.toEqual(
      new TypeError('this.service.translate is not a function'),
    );
  });

  it('translates with translator service', async () => {
    const translate = new v2.Translate();
    jest.spyOn(translate, 'translate').mockImplementation(() => {
      return ['baby nieuwe aardappelen'];
    });

    const translator = new Translator(translationsDb, translate);
    expect(await translator.translate(['baby new potatoes'])).toEqual([
      'baby nieuwe aardappelen',
    ]);
  });

  it('does not translate already translated strings', async () => {
    translationsDb.storeTranslations(
      ['baby new potatoes'],
      ['baby nieuwe aardappelen'],
    );
    let items;
    const translate = new v2.Translate();
    jest.spyOn(translate, 'translate').mockImplementation((orig) => {
      items = orig;
      return orig;
    });
    expect(
      await translator.translate(['baby nieuwe aardappelen', 'medium eggs']),
    ).toEqual(['baby nieuwe aardappelen', 'medium eggs']);
    expect(items).toEqual(['medium eggs']);
  });
});
