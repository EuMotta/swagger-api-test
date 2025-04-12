import { ApiProperty } from '@nestjs/swagger';
import { ChangeTaskListDto, CreateTaskDto } from './task.dto';
import { SubTask } from 'src/sub_task/sub_task-swagger-response';

export class ChangeTaskList extends ChangeTaskListDto {}

export class CreateTask extends CreateTaskDto {}

export class Task extends CreateTaskDto {
  @ApiProperty({
    description: 'ID único da tarefa',
    example: '60b8d295f3a5f926e456b1a1',
  })
  _id: string;
  @ApiProperty({
    description: 'Subtarefas completas',
    type: () => [SubTask], 
  })
  sub_tasks: SubTask[];
}

export class ApiResponseTask {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Tarefa encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: Task, nullable: true })
  data?: Task | null;
}
