import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsOptional,
  IsNumber,
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @class CardLimitDto
 * DTO para representar os limites de cartões dentro da lista.
 */
class CardLimitDto {
  @ApiProperty({ description: 'Status da limitação', example: 'ok' })
  @IsNotEmpty({ message: 'O status da limitação é obrigatório' })
  @IsString({ message: 'O status deve ser uma string' })
  status: string;

  @ApiProperty({
    description: 'Número de cartões que desabilita a lista',
    example: 5000,
  })
  @IsNotEmpty({ message: 'O limite de desativação é obrigatório' })
  @IsNumber({}, { message: 'O limite de desativação deve ser um número' })
  disable_at: number;

  @ApiProperty({
    description: 'Número de cartões que gera um aviso',
    example: 4000,
  })
  @IsNotEmpty({ message: 'O limite de aviso é obrigatório' })
  @IsNumber({}, { message: 'O limite de aviso deve ser um número' })
  warn_at: number;
}

/**
 * @class CardLimitsDto
 * DTO que agrupa os limites de cartões na lista.
 */
class CardLimitsDto {
  @ApiProperty({ description: 'Limite de cartões abertos na lista' })
  @ValidateNested()
  @Type(() => CardLimitDto)
  open_per_list: CardLimitDto;

  @ApiProperty({ description: 'Limite total de cartões na lista' })
  @ValidateNested()
  @Type(() => CardLimitDto)
  total_per_list: CardLimitDto;
}

/**
 * @class LimitsDto
 * DTO que representa as restrições de limites dentro de uma lista.
 */
export class Limits {
  @ApiProperty({ description: 'Configuração de limite de cartões' })
  @ValidateNested()
  @Type(() => CardLimitsDto)
  cards: CardLimitsDto;
}

/**
 * @class CreateListDto
 * DTO para criar uma nova lista.
 */

export class CreateListDto {
  @ApiProperty({ description: 'Nome da lista', example: 'Product Backlog' })
  @IsNotEmpty({ message: 'O nome da lista é obrigatório' })
  @IsString({ message: 'O nome deve ser uma string' })
  name: string;

  @ApiPropertyOptional({
    description: 'Se a lista está fechada',
    example: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'O valor de "closed" deve ser booleano' })
  closed?: boolean;

  @ApiPropertyOptional({ description: 'Cor da lista', example: null })
  @IsOptional()
  @IsString({ message: 'A cor deve ser uma string' })
  color?: string | null;

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

