import {
  Controller,
  Get,
  Header,
  HttpCode,
  Injectable,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PostmanGuard } from './google-oauth.strategy';

@Controller('google')
@Injectable()
export class AppController {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(PostmanGuard)
  async googleAuth() {}

  @Post('token')
  @UseGuards(PostmanGuard)
  @HttpCode(200)
  @Header('content-type', 'application/json')
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const jwt = await this.jwtService.signAsync(req.user, {
      secret: this.configService.get('JWT_SECRET'),
    });
    res.cookie('access_token', jwt);
    res.json({ access_token: jwt });
    // Just passing the result like this doesn't work with Postman
    // return { access_token: jwt };
  }
}
