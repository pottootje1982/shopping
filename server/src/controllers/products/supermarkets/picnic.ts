import PicnicClient from 'picnic-api';
import { ImageSize } from 'picnic-api/lib/types/picnic-api';
import Supermarket from './supermarket';
import { IngredientProductDb } from '../../../db/table/ingredient-product';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PicnicApi extends Supermarket {
  private client;
  private authKey: string;

  private countryCode = 'nl';
  private apiVersion = '17';

  get url() {
    return `https://storefront-prod.${this.countryCode.toLowerCase()}.picnicinternational.com/api/${
      this.apiVersion
    }`;
  }

  constructor(
    protected ingToProduct: IngredientProductDb,
    authKey: string,
  ) {
    super(ingToProduct, 'picnic');
    this.client = new PicnicClient({ authKey });
  }

  async login(user: string, pass: string) {
    const { authKey } = await this.client.login(user, pass);
    this.authKey = authKey;
  }

  async search(query: string) {
    const { data: rawResults } = await axios.get(
      `${this.url}/pages/search-page-results?search_term=${encodeURIComponent(
        query,
      )}`,
      {
        headers: {
          'x-picnic-auth': this.authKey,
          'Content-Type': 'application/json',
          'x-picnic-agent': '30100;1.15.243-18832',
          'x-picnic-did': '3E48EB73F10C53E6',
        },
      },
    );
    const products = this.findChildrenOfType(
      rawResults.body.child.children,
      'PML',
    )
      .filter((c) => c.content)
      .flatMap((c) => c.content.sellingUnit);

    const getImageUri = (imageId: string, size: ImageSize) => {
      const alternateRoute = this.url.split('/api/')[0];
      return `${alternateRoute}/static/images/${imageId}/${size}.png`;
    };

    return products.map((c) => ({
      id: c.id,
      title: c.name,
      price: {
        now: (c.display_price / 100).toFixed(2),
        unitSize: c.unit_quantity,
      },
      image: getImageUri(c.image_id, 'small'),
    }));
  }

  convertProduct({
    id,
    name,
    price,
    image_id,
    unit_quantity,
    product_id,
  }: any) {
    return {
      id: parseInt(id || product_id),
      title: name,
      price: { now: price / 100.0, unitSize: unit_quantity },
      images: [
        {
          url: this.getImageUri(image_id, 'small'),
        },
      ],
    };
  }

  override async getProduct(id: string): Promise<any> {
    const { products }: any =
      (await this.client.getArticle(id).catch(console.log)) || {};
    if (!products || products.length === 0) return;
    return this.convertProduct(products[0]);
  }

  getImageUri(imageId: string, size: ImageSize) {
    const alternateRoute = this.client.url.split('/api/')[0];
    return `${alternateRoute}/static/images/${imageId}/${size}.png`;
  }

  async order(recipes: any[]) {
    const items = recipes
      .map(({ parsedIngredients }: any) => parsedIngredients)
      .flat(1)
      .map(({ product, ...rest }: any) => ({ ...product, ...rest }));
    const result: any[] = [];
    for (const { id, quantity } of items.filter(
      ({ id, notAvailable, ignore, quantity }: any) =>
        id && !notAvailable && !ignore && quantity > 0,
    )) {
      try {
        await this.client.addProductToShoppingCart(id, quantity);
        result.push({ id, quantity, status: 'OK' });
      } catch (err) {
        result.push({ id, quantity, status: err.message });
      }
    }
    return result;
  }

  // Create a function that recursively searches for children with a specific type
  // and returns the flatmap of all the children of that type
  findChildrenOfType(children, type: string) {
    return [
      ...(children || []).filter((c) => c.type === type),
      ...(children || []).flatMap((c) =>
        this.findChildrenOfType(c.children, type),
      ),
    ];
  }
}

export const create = async (ingToProduct: any, userDb: any, user: string) => {
  const { picnicUser, picnicPass } = (await userDb.getUser(user)) || {};
  const api = new PicnicApi(ingToProduct, picnicUser);
  if (picnicUser && picnicPass) {
    await api.login(picnicUser, picnicPass);
  }
  return api;
};

export default PicnicApi;
