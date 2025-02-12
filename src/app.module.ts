import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskModule } from './task/task.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db/db.module';

import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { seconds } from './utils';
import { RegisterController } from './register/register.controller';
import { RegisterModule } from './register/register.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TaskModule,
    UsersModule,
    AuthModule,
    DbModule,

    ThrottlerModule.forRoot({
      errorMessage: () => 'limite de requisição excedido',
      throttlers: [
        {
          name: 'default',
          ttl: seconds(3),
          limit: 2,
        },
        {
          name: 'other',
          ttl: seconds(3),
          limit: 22,
        },
      ],
    }),

    RegisterModule,
  ],
  controllers: [AppController, RegisterController],
  providers: [
    AppService,

    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
