import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';


/**
 * @class BoardDto
 * DTO para criar um quadro.
 */

export class CreateBoardDto {
  @ApiProperty({
    description: 'Nome do quadro',
    example: 'Projeto X',
  })
  @IsString()
  @MaxLength(200, {
    message: 'O nome do quadro pode ter no máximo 200 caracteres',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Descrição do quadro',
    example: 'Descrição do Projeto X',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'A descrição pode ter no máximo 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    description: 'IDs dos membros do quadro',
    example: ['user-id-1', 'user-id-2'],
  })
  @IsOptional()
  @IsArray()
  members: string[];

  @ApiPropertyOptional({
    description: 'Link curto do quadro',
    example: 'proj-x',
  })
  @ApiPropertyOptional({
    description: 'Indica se o quadro é privado',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  is_private: boolean;

  @ApiPropertyOptional({
    description: 'ID do dono do quadro, que virá do token',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsString({ message: 'owner_id must be a string' })
  owner_id?: string;
}
