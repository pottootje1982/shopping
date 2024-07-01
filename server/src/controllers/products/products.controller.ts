import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpStatus,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import create from './supermarkets';
import { GetUser } from '../get-user';
import { IngredientProductDb } from '../../db/table/ingredient-product';
import { UserDb } from '../../db/table/user';
import { User } from '../../jwt/jwt.middleware';

@Controller('products')
export class ProductsController {
  constructor(
    private ingToProduct: IngredientProductDb,
    private userDb: UserDb,
  ) {}

  @Get()
  async getAllProducts(@Query() query: any, @GetUser() user: User) {
    const { supermarket, query: searchQuery, full } = query;
    const api = await create(
      supermarket,
      this.ingToProduct,
      this.userDb,
      user.email,
    );
    const products = await api.search(searchQuery, full).catch((err) => {
      console.log(`Searching for ${searchQuery} failed: ${err.message}`);
      return [];
    });
    return products;
  }

  @Post('choose')
  @HttpCode(HttpStatus.CREATED)
  async chooseProduct(@Body() body: any, @Query() query: any) {
    const { ingredient, product } = body;
    const { supermarket } = query;
    this.ingToProduct
      .storeMapping(ingredient, product, supermarket)
      .catch((err) => {
        console.log(err);
      });
  }

  @Get(':productId/product')
  async getProduct(
    @Param('productId') productId: string,
    @GetUser() user: User,
    @Query('supermarket') supermarket: string,
  ) {
    const { email } = user;
    const api = await create(
      supermarket,
      this.ingToProduct,
      this.userDb,
      email,
    );
    const product = await api.getProduct(productId);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }
}
