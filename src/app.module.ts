import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { AuditController } from './audit/audit.controller';
import { EmailVerifyController } from './email_verify/email_verify.controller';
import { EmailVerifyModule } from './email_verify/email_verify.module';
import { AddressController } from './address/address.controller';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';
import { LoggingMiddleware } from './middlewares/logging.middleware';

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
    EmailVerifyModule,
    AddressModule,
  ],
  controllers: [
    AppController,
    AuditController,
    EmailVerifyController,
    AddressController,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
