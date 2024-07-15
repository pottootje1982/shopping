import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

export interface User {
  provider: string;
  providerId: string;
  name: string;
  email: string;
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    if (!req.headers.authorization) {
      return next();
    }
    // Get token from authorization header
    const token = req.headers.authorization.split(' ')[1];

    let tokenData;

    if (token) {
      tokenData = this.jwtService.decode(token.toString());
    }

    req.user = tokenData;

    next();
  }
}
