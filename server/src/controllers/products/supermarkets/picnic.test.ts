import { PicnicApi } from './picnic';
import axios from 'axios';
import expectedResult from './picnic.data.json';
import { IngredientProductDb } from '../../../db/table/ingredient-product';

jest.mock('axios');

describe('PicnicApi', () => {
  describe('search', () => {
    it('should return search results', async () => {
      const query = 'korianderpoeder';

      jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: expectedResult });

      // Create jest mock for IngredientProductDb with jest
      const ingToProduct = jest.mock('../../../db/table/ingredient-product');

      const picnicApi = new PicnicApi(
        ingToProduct as unknown as IngredientProductDb,
        'authKey',
      );

      const results = await picnicApi.search(query);

      expect(results.length).toEqual(1);
      expect(results[0].title).toEqual('Verstegen koriander gemalen');
      expect(results[0].price.now).toEqual('3.09');
      expect(results[0].price.unitSize).toEqual('33 gram');
      expect(axios.get).toHaveBeenCalledWith(
        '/pages/search-page-results?search_term=korianderpoeder',
      );
    });
  });
});
