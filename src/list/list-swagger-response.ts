import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Task } from 'src/task/task.dto';
import { Limits } from './list.dto';

/**
 * @class List
 * DTO para representar uma lista existente.
 */
export class List {
  @ApiProperty({ description: '_id da lista', example: 'Product Backlog' })
  @IsNotEmpty({ message: 'O _id da lista é obrigatório' })
  @IsString({ message: 'O _id deve ser uma string' })
  _id: string;

  @ApiProperty({ description: 'Nome da lista', example: 'Product Backlog' })
  @IsNotEmpty({ message: 'O nome da lista é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @ApiPropertyOptional({
    type: [Task],
    example: [
      { _id: 'task1', title: 'Product Backlog' },
      { _id: 'list2', title: 'Sprint Backlog' },
    ],
    description: 'Tarefas associadas à lista',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Task)
  tasks: Task[];

  @ApiProperty({
    description: 'ID do quadro ao qual a lista pertence',
    example: '65d544ffce24be2813a3d265',
  })
  @IsNotEmpty({ message: 'O ID do quadro é obrigatório' })
  @IsString({ message: 'O ID do quadro deve ser uma string' })
  id_board: string;

  @ApiPropertyOptional({ description: 'Limites de cartões dentro da lista' })
  @ValidateNested()
  @Type(() => Limits)
  limits?: Limits;
}
/**
 * @class ApiResponseTask
 *
 * DTO para receber no swagger as informações da tarefa.
 */
export class ApiResponseList {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Lista encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: List, nullable: true })
  data?: List | null;
}
