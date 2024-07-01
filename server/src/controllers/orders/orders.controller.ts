import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Res,
  Query,
  Param,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Body,
} from '@nestjs/common';
import createSupermarket from '../products/supermarkets';
import * as path from 'path';
import * as fs from 'fs';
import { OrderDb } from '../../db/table/order';
import { IngredientProductDb } from '../../db/table/ingredient-product';
import { UserDb } from '../../db/table/user';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly orderDb: OrderDb,
    private readonly ingToProduct: IngredientProductDb,
    private readonly userDb: UserDb,
  ) {}

  @Get()
  async findAll(@Req() req) {
    const { user, supermarket } = req;
    const orders = await this.orderDb.find({ user, supermarket });
    return orders;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(@Req() req, @Res() res, @Param('id') id) {
    const response = await this.orderDb.deleteOrder(req.user, id);
    if (response.deletedCount === 0) {
      throw new NotFoundException(`Order with id ${id} not found.`);
    }
    return response.acknowledged;
  }

  @Get('/extension')
  async downloadExtension(@Res() res) {
    const file = path.join(__dirname, '/../extension.crx');
    const filename = path.basename(file);
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    const filestream = fs.createReadStream(file);
    filestream.pipe(res);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(
    @Req() req,
    @Query('supermarket') supermarket,
    @Body() body,
  ) {
    const { recipes } = body;
    const api = await createSupermarket(
      supermarket,
      this.ingToProduct,
      this.userDb,
      req.user,
    );
    await api.order(recipes);
    const response = await this.orderDb.storeOrder(
      recipes,
      supermarket,
      req.user,
    );
    return response;
  }
}
