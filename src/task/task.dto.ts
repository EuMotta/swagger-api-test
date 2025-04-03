import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @class SubTaskDto
 *
 * DTO para representar uma subtarefa dentro de uma tarefa principal.
 */

export class SubTaskDto {
  @ApiProperty({
    description: 'Nome da subtarefa',
    example: 'Configurar banco de dados',
  })
  @IsNotEmpty({ message: 'O nome da subtarefa é obrigatório' })
  @IsString({ message: 'O nome da subtarefa deve ser uma string' })
  name: string;
}

/**
 * @class CreateTaskDto
 *
 * DTO para criar uma nova tarefa, incluindo subtarefas, prazos e atributos opcionais.
 */

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar autenticação JWT',
  })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'ID da lista associada à tarefa',
    example: '60b8d295f3a5f926e456b1a1',
  })
  @IsNotEmpty({ message: 'A tarefa deve estar associada a uma lista' })
  @IsString({ message: 'O ID da lista deve ser uma string' })
  list_id: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Implementar autenticação usando JWT',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Lista de subtarefas',
    type: [SubTaskDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SubTaskDto)
  tasks?: SubTaskDto[];

  @ApiPropertyOptional({
    description: 'Se a tarefa está concluída',
    example: false,
  })
  @IsOptional()
  is_completed?: boolean;

  @ApiPropertyOptional({
    description: 'Data de início da tarefa',
    example: '2024-06-15T08:00:00Z',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data de início deve ser uma string no formato ISO' },
  )
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Labels associadas à tarefa',
    example: ['backend', 'auth'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  labels?: string[];

  @ApiPropertyOptional({
    description: 'Data de lembrete',
    example: '2024-06-20T12:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  due_reminder?: string;

  @ApiPropertyOptional({
    description: 'IDs dos usuários para lembrete',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  users_reminder?: string[];

  @ApiPropertyOptional({ description: 'Link curto', example: 'abc123' })
  @IsOptional()
  @IsString()
  short_link?: string;

  @ApiPropertyOptional({
    description: 'URL curta',
    example: 'https://short.url/abc123',
  })
  @IsOptional()
  @IsString()
  short_url?: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    example: '2024-07-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;
}

/**
 * @class ChangeTaskListDto
 *
 * DTO para trocar a tarefa de lista.
 */

export class ChangeTaskListDto {
  @ApiProperty({
    description: 'ID da lista associada à tarefa',
    example: '60b8d295f3a5f926e456b1a1',
  })
  @IsNotEmpty({ message: 'A tarefa deve estar associada a uma lista' })
  @IsString({ message: 'O ID da lista deve ser uma string' })
  list_id: string;
}

export class ChangeTaskStatusDto {
  @ApiProperty({
    description: 'Se a tarefa está concluída',
    example: false,
  })
  @IsOptional()
  is_completed?: boolean;
}

/**
 * @class TaskDto
 *
 * DTO para representar uma tarefa existente, com um identificador único.
 */
export class Task extends CreateTaskDto {
  @ApiProperty({
    description: 'ID único da tarefa',
    example: '60b8d295f3a5f926e456b1a1',
  })
  _id: string;
}
