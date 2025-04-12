import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SubTask, SubTaskSchema } from './sub_task.schema';
import { SubTaskController } from './sub_task.controller';
import { SubTaskService } from './sub_task.service';
import { UsersModule } from 'src/users/users.module';
import { TaskModule } from 'src/task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubTask.name, schema: SubTaskSchema }]),
    UsersModule,
    TaskModule,
  ],
  controllers: [SubTaskController],
  providers: [SubTaskService],
  exports: [SubTaskService],
})
export class SubTaskModule {}
