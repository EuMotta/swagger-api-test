import {
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatusEnun {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class TaskDto {
  @IsUUID()
  @IsOptional()
  @ApiProperty({
    description: 'Unique identifier of the task',
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
    required: false,
  })
  id: string;

  @IsString()
  @MinLength(5)
  @MaxLength(256)
  @ApiProperty({
    description: 'Title of the task',
    example: 'New Task',
    minLength: 5,
    maxLength: 256,
  })
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(512)
  @ApiProperty({
    description: 'Detailed description of the task',
    example: 'Description of the task',
    minLength: 5,
    maxLength: 512,
  })
  description: string;

  @IsEnum(TaskStatusEnun)
  @IsOptional()
  @ApiProperty({
    description: 'Status of the task',
    example: 'TO_DO',
    enum: TaskStatusEnun,
    required: false,
  })
  status: string;

  @IsDateString()
  @ApiProperty({
    description: 'Expiration date of the task',
    example: '2025-12-31T23:59:59.000Z',
  })
  expiration_date: Date;
}

export interface FindAllParameters {
  title: string;
  status: string;
}
