import { Injectable } from '@nestjs/common';
import { v2 } from '@google-cloud/translate';
import { TranslationsDb } from '../db/table/translations';

@Injectable()
export default class Translator {
  constructor(
    private cache: TranslationsDb,
    private service: v2.Translate = undefined,
  ) {}

  async translate(itemsToTranslate, target = 'nl') {
    let { success, translations, untranslated } =
      await this.cache.getTranslations(itemsToTranslate);

    target = target || 'nl';

    if (!success && this.service) {
      [translations] = await this.service.translate(untranslated, target);
      await this.cache.storeTranslations(untranslated, translations);
    }

    ({ success, translations, untranslated } = await this.cache.getTranslations(
      itemsToTranslate,
    ));

    return translations;
  }
}

module.exports = Translator;
