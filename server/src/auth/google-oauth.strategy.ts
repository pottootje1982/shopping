import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'postman') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(at: string, rt: string, profile: Profile) {
    const { id, name, emails } = profile;

    // Here a custom User object is returned. In the the repo I'm using a UsersService with repository pattern, learn more here: https://docs.nestjs.com/techniques/database
    return {
      provider: 'google',
      providerId: id,
      name: name.givenName,
      email: emails[0].value,
    };
  }
}

export class PostmanGuard extends AuthGuard('postman') {
  getAuthenticateOptions(context: ExecutionContext) {
    const httpContext: HttpArgumentsHost = context.switchToHttp();
    const req = httpContext.getRequest();

    const callbackURL = req.query.redirect_uri;
    return { callbackURL };
  }
}
