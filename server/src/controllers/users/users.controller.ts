import {
  Controller,
  Post,
  Get,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  Body,
  Param,
  Injectable,
} from '@nestjs/common';
import { GetUser } from '../get-user';
import { UserDb } from '../../db/table/user';

@Injectable()
@Controller('users')
export class UsersController {
  constructor(private readonly userDb: UserDb) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() newUser: any, @GetUser() user: any) {
    if (!user) throw new UnauthorizedException();
    const createdUser = this.userDb.storeUser(newUser, user);
    return createdUser;
  }

  @Get(':email?')
  async getUser(@Param('email') email: string, @GetUser() user: any) {
    if (!user) throw new UnauthorizedException();
    if (!email) return this.userDb.getUsers();
    return await this.userDb.getUser(email);
  }
}
