import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  readonly limit: number = 10;

  @ApiPropertyOptional({ description: 'Termo de busca para pesquisa' })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly search?: string;

  @ApiPropertyOptional({
    description: 'Filtrar por status (true = ativo, false = inativo)',
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  readonly status?: string;

  @ApiPropertyOptional({
    description: 'Nome do campo para ordenação',
  })
  @IsString()
  @IsOptional()
  readonly orderBy?: string = 'created_at';

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
