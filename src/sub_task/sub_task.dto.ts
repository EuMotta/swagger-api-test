import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @class CreateTaskDto
 *
 * DTO para criar uma nova tarefa, incluindo subtarefas, prazos e atributos opcionais.
 */

export class CreateSubTaskDto {
  @ApiProperty({
    description: 'Título da subtarefa',
    example: 'Implementar autenticação JWT',
  })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'ID da subtarefa associada à tarefa',
    example: '60b8d295f3a5f926e456b1a1',
  })
  @IsNotEmpty({ message: 'A subtarefa deve estar associada a uma tarefa' })
  @IsString({ message: 'O ID da tarefa deve ser uma string' })
  task_id: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Implementar autenticação usando JWT',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Se a subtarefa está concluída',
    example: false,
  })
  @IsOptional()
  is_completed?: boolean;

  @ApiPropertyOptional({
    description: 'Data de início da subtarefa',
    example: '2024-06-15T08:00:00Z',
  })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'A data de início deve ser uma string no formato ISO' },
  )
  start_date?: string;

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

  @ApiPropertyOptional({
    description: 'Data de vencimento',
    example: '2024-07-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString()
  due_date?: string;
}
