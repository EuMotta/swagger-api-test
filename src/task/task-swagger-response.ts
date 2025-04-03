import { ApiProperty } from '@nestjs/swagger';
import { ChangeTaskListDto, CreateTaskDto, Task } from './task.dto';

export class ChangeTaskList extends ChangeTaskListDto {}

export class CreateTask extends CreateTaskDto {}

export class ApiResponseTask {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Tarefa encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: Task, nullable: true })
  data?: Task | null;
}
