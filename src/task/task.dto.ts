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

export class SubTaskDto {
  @ApiProperty({
    description: 'Nome da subtarefa',
    example: 'Configurar banco de dados',
  })
  @IsNotEmpty({ message: 'O nome da subtarefa é obrigatório' })
  @IsString({ message: 'O nome da subtarefa deve ser uma string' })
  name: string;
}

export class CreateTaskDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Implementar autenticação JWT',
  })
  @IsNotEmpty({ message: 'O título é obrigatório' })
  @IsString({ message: 'O título deve ser uma string' })
  title: string;

  @ApiProperty({
    description: 'ID da lista associada à tarefa (MongoDB)',
    example: '60b8d295f3a5f926e456b1a1',
  })
  @IsNotEmpty({ message: 'A tarefa deve estar associada a uma lista' })
  @IsString({ message: 'O ID da lista deve ser uma string' })
  list_id: string;

  @ApiPropertyOptional({
    description: 'Descrição detalhada da tarefa',
    example: 'Implementar autenticação usando JWT, Passport e NestJS',
  })
  @IsOptional()
  @IsString({ message: 'A descrição deve ser uma string' })
  description?: string;

  @ApiPropertyOptional({
    description: 'Lista de subtarefas ou itens de checklist',
    type: [SubTaskDto],
  })
  @IsOptional()
  @IsArray({ message: 'Tasks deve ser um array' })
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
  @IsDateString({}, { message: 'A data de início deve ser uma string no formato ISO' })
  start_date?: string;

  @ApiPropertyOptional({
    description: 'Lista de labels associadas à tarefa',
    example: ['backend', 'auth'],
  })
  @IsOptional()
  @IsArray({ message: 'Labels deve ser um array' })
  @IsString({ each: true, message: 'Cada label deve ser uma string' })
  labels?: string[];

  @ApiPropertyOptional({
    description: 'Data de lembrete da tarefa',
    example: '2024-06-20T12:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'O lembrete deve ser uma string no formato ISO' })
  due_reminder?: string;

  @ApiPropertyOptional({
    description: 'IDs dos usuários que receberão lembrete (PostgreSQL)',
    example: ['550e8400-e29b-41d4-a716-446655440000'],
  })
  @IsOptional()
  @IsArray({ message: 'Os usuários de lembrete devem ser um array' })
  @IsUUID('4', { each: true, message: 'Cada usuário deve ter um ID válido (UUID)' })
  users_reminder?: string[];

  @ApiPropertyOptional({
    description: 'Link curto associado à tarefa',
    example: 'abc123',
  })
  @IsOptional()
  @IsString({ message: 'O short_link deve ser uma string' })
  short_link?: string;

  @ApiPropertyOptional({
    description: 'URL curta associada à tarefa',
    example: 'https://short.url/abc123',
  })
  @IsOptional()
  @IsString({ message: 'O short_url deve ser uma string' })
  short_url?: string;

  @ApiPropertyOptional({
    description: 'Data de vencimento da tarefa',
    example: '2024-07-01T00:00:00Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'A data de vencimento deve ser uma string no formato ISO' })
  due_date?: string;
}
