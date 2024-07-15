import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JwtService } from '@nestjs/jwt';
import { GoogleOauthStrategy } from './google-oauth.strategy';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

@Module({
  controllers: [AppController],
  providers: [JwtService, GoogleOauthStrategy, ExecutionContextHost],
})
export class AuthModule {}
