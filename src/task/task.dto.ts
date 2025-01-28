import {
  IsString,
  IsUUID,
  IsOptional,
  MinLength,
  MaxLength,
  IsEnum,
  IsDateString,
} from 'class-validator';

export enum TaskStatusEnun {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
export class TaskDto {
  @IsUUID()
  @IsOptional()
  id: string;

  @IsString()
  @MinLength(5)
  @MaxLength(256)
  title: string;

  @IsString()
  @MinLength(5)
  @MaxLength(512)
  description: string;

  @IsEnum(TaskStatusEnun)
  @IsOptional()
  status: string;

  @IsDateString()
  expiration_date: Date;
}

export interface FindAllParameters {
  title: string;
  status: string;
}
