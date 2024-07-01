import { Injectable } from '@nestjs/common';
import { IngredientProductDb } from '../../../db/table/ingredient-product';

@Injectable()
export default abstract class Supermarket {
  constructor(
    protected ingToProduct: IngredientProductDb,
    private name: string,
  ) {}

  abstract getProduct(id: string): Promise<any>;

  async getSelected(full, products) {
    if (!full) {
      return products;
    }

    const mapping = await this.ingToProduct.getMapping(full, this.name);
    if (mapping && !mapping.product.ignore && !mapping.product.notAvailable) {
      const id = mapping.product.id;
      let selectedProduct = products.find((p) => p.id === id);
      const withoutSelected = products.filter((p) => p.id !== id);
      if (!selectedProduct) {
        selectedProduct = await this.getProduct(id).catch(console.log);
        if (selectedProduct) withoutSelected.splice(0, 0, selectedProduct);
        return withoutSelected;
      }
    }
    return products;
  }
}

module.exports = Supermarket;
