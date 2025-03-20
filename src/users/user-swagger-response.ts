import { UserDto } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDto } from 'src/db/pagination/page-meta.dto';
import { IsArray } from 'class-validator';

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */
export class UserPageDto {
  @IsArray()
  @ApiProperty({ isArray: true, type: UserDto })
  readonly data: UserDto[];

  @ApiProperty({ type: () => PageMetaDto })
  readonly meta: PageMetaDto;

  constructor(data: UserDto[], meta: PageMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}

export class ApiResponseUserList {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: UserPageDto })
  data?: UserPageDto;
}

/**
 * @class ApiResponseUser
 *
 * DTO para receber no swagger as informações do usuário.
 */
export class ApiResponseUser {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: UserDto, nullable: true })
  data?: UserDto | null;
}
