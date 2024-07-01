import { Module } from '@nestjs/common';
import { GoogleOauthStrategy } from './google-oauth.strategy';

@Module({
  providers: [GoogleOauthStrategy],
})
export class AuthModule {}
