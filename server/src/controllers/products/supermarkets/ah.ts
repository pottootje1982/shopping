import axios from 'axios';
import Supermarket from './supermarket';
import { IngredientProductDb } from '../../../db/table/ingredient-product';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AhApi extends Supermarket {
  constructor(protected ingToProduct: IngredientProductDb) {
    super(ingToProduct, 'ah');
  }

  login(): void {}

  async search(query: string, full: boolean): Promise<any> {
    const { data } = await axios.get(
      `https://www.ah.nl/zoeken/api/products/search?query=${query}`,
    );
    const cards = data.cards;
    const products = cards
      .map((card: any) => card.products[0])
      .map(({ id, title, images, price }: any) => ({
        id,
        title,
        images,
        price,
      }));

    return this.getSelected(full, products);
  }

  override async getProduct(idStr: string): Promise<any> {
    const id = parseInt(idStr.toString());
    const url = `https://www.ah.nl/zoeken/api/products/product?webshopId=${id}`;
    return axios
      .get(url)
      .then(({ data }) => {
        return data.card.products.find((p: any) => p.id === id);
      })
      .catch(() => {
        console.log(`Product with id '${id}' not found in AH`);
      });
  }

  order(): void {
    // Products are ordered via chrome extension
    throw new Error('Method not implemented.');
  }
}
