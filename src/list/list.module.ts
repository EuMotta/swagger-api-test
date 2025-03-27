import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListController } from './list.controller';
import { ListService } from './list.service';
import { List, ListSchema } from './list.schema';
import { BoardModule } from 'src/board/board.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: List.name, schema: ListSchema }]),
    BoardModule,
  ],
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],
})
export class ListModule {}
