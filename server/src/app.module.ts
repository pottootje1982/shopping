import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { OrdersController } from './controllers/orders/orders.controller';
import { ProductsController } from './controllers/products/products.controller';
import { RecipesController } from './controllers/recipes/recipes.controller';
import { UsersController } from './controllers/users/users.controller';
import { PaprikaApi } from 'paprika-api';
import { Db } from 'mongodb';
import { createMongoClient } from './db/mongo-client';
import { IngredientProductDb } from './db/table/ingredient-product';
import { RecipeDb } from './db/table/recipe';
import { OrderDb } from './db/table/order';
import { TranslationsDb } from './db/table/translations';
import { Paprika } from './paprika';
import { ConfigModule } from '@nestjs/config';
import { Paprika as PaprikaStub } from './paprika/paprika.stub';
import Translator from './translator/translator';
import { v2 } from '@google-cloud/translate';
import { UserDb } from './db/table/user';
import { AuthModule } from './auth/auth.module';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'client/build'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    JwtModule.register({ secret: process.env.JWT_SECRET }),
  ],
  controllers: [
    OrdersController,
    ProductsController,
    RecipesController,
    UsersController,
  ],
  providers: [
    AppService,
    IngredientProductDb,
    RecipeDb,
    OrderDb,
    TranslationsDb,
    UserDb,
    Paprika,
    Translator,
    {
      provide: 'PAPRIKA_USER',
      useValue: process.env.PAPRIKA_USER,
    },
    {
      provide: 'PAPRIKA_PASS',
      useValue: process.env.PAPRIKA_PASS,
    },
    {
      provide: 'USE_PAPRIKA_STUB',
      useValue: process.env.USE_PAPRIKA_STUB,
    },
    {
      provide: 'GOOGLE_API_KEY',
      useValue: process.env.GOOGLE_API_KEY,
    },
    {
      provide: 'PUBLIC_KEY',
      useFactory: () => Buffer.from(process.env.PUBLIC_KEY, 'utf8'),
    },
    {
      provide: 'INIT_VECTOR',
      useValue: () => Buffer.from(process.env.INIT_VECTOR, 'utf8'),
    },
    {
      provide: v2.Translate,
      useFactory: (googleApiKey) => {
        return new v2.Translate({ key: googleApiKey });
      },
      inject: ['GOOGLE_API_KEY'],
    },
    {
      provide: Paprika,
      useFactory: (user, pass, usePaprikaStub, recipeDb) => {
        if (usePaprikaStub === 'true') {
          return new PaprikaStub(recipeDb);
        }
        const paprikaApi = new PaprikaApi(user, pass);
        new Paprika(recipeDb, paprikaApi, user, pass);
      },
      inject: ['PAPRIKA_USER', 'PAPRIKA_PASS', 'USE_PAPRIKA_STUB', RecipeDb],
    },
    {
      provide: Db,
      useFactory: async () => {
        const client = await createMongoClient(
          process.env.USE_TEST_DB
            ? process.env.TEST_DB_URL
            : process.env.MONGO_URL,
        );
        return client.db();
      },
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
