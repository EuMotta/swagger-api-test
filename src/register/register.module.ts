import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';

@Module({
  providers: [RegisterService]
})
export class RegisterModule {}
