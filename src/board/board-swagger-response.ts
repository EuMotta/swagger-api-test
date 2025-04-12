import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { Type } from 'class-transformer';
import { List } from 'src/list/list-swagger-response';
import { Task } from 'src/task/task-swagger-response';

export class Board {
  @ApiProperty({ example: 'Nome do Quadro', description: 'Nome do quadro' })
  @IsString()
  @MaxLength(200, {
    message: 'O nome do quadro pode ter no máximo 200 caracteres',
  })
  name: string;

  @ApiPropertyOptional({
    example: 'Descrição do quadro',
    description: 'Descrição do quadro',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'A descrição pode ter no máximo 500 caracteres' })
  description?: string;

  @ApiPropertyOptional({
    example: ['member1', 'member2'],
    description: 'Lista de IDs dos membros',
  })
  @IsArray()
  @IsOptional()
  members: string[];

  @ApiPropertyOptional({
    type: [List],
    example: [
      { _id: 'list1', name: 'Product Backlog', id_board: 'board1' },
      { _id: 'list2', name: 'Sprint Backlog', id_board: 'board1' },
    ],
    description: 'Lista de objetos representando as listas do quadro',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => List)
  lists: List[];

  @ApiPropertyOptional({
    type: [Task],
    example: [
      { _id: 'list1', name: 'Product Backlog', id_board: 'board1' },
      { _id: 'list2', name: 'Sprint Backlog', id_board: 'board1' },
    ],
    description: 'Lista de objetos representando as listas do quadro',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Task)
  tasks: Task[];

  @ApiPropertyOptional({
    example: 'short-link',
    description: 'Short link do quadro',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'O short_link pode ter no máximo 100 caracteres' })
  short_link?: string;

  @ApiPropertyOptional({
    example: false,
    description: 'Indica se o quadro está arquivado',
  })
  @IsBoolean()
  @IsOptional()
  archived: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica se o quadro é privado',
  })
  @IsBoolean()
  @IsOptional()
  is_private: boolean;

  @ApiPropertyOptional({
    example: 'user123',
    description: 'ID do proprietário do quadro',
  })
  @IsOptional()
  @IsString({ message: 'owner_id must be a string' })
  owner_id?: string;
}

/**
 * @class ApiResponseBoard
 *
 * DTO para receber no swagger as informações do Quadro.
 */

export class ApiResponseBoard {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Quadro encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: Board, nullable: true })
  data?: Board | null;
}

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class BoardPage {
  @IsArray()
  @ApiProperty({ isArray: true, type: Board })
  readonly data: Board[];

  @ApiProperty({ type: () => PageMeta })
  readonly meta: PageMeta;

  constructor(data: Board[], meta: PageMeta) {
    this.data = data;
    this.meta = meta;
  }
}

export class ApiResponseBoardList {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Quadros encontrados com sucesso!' })
  message: string;

  @ApiProperty({ type: BoardPage })
  data?: BoardPage;
}
