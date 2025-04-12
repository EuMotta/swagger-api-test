import { ApiProperty } from '@nestjs/swagger';
import { CreateSubTaskDto } from './sub_task.dto';

export class CreateSubTask extends CreateSubTaskDto {}

export class SubTask extends CreateSubTaskDto {
  @ApiProperty({
    description: 'ID único da tarefa',
    example: '60b8d295f3a5f926e456b1a1',
  })
  _id: string;
}

export class ApiResponseSubTask {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Tarefa encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: SubTask, nullable: true })
  data?: SubTask | null;
}
