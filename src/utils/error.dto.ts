import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponseDto {
  @ApiProperty({
    example: false,
    description: 'Indica se o erro ocorreu ou não',
  })
  error: boolean;

  @ApiProperty({
    example: 'Usuário não encontrado',
    description: 'Mensagem explicando o erro',
  })
  message: string;
}

export class AxiosErrorInnerResponseDto {
  @ApiProperty({
    description: 'Dados do erro',
    type: ErrorResponseDto,
  })
  data: ErrorResponseDto;
}

export class AxiosErrorResponseDto {
  @ApiProperty({
    example: 'Usuário não encontrado',
    description: 'Mensagem explicando o erro',
  })
  message: string;

  @ApiProperty({
    description: 'Objeto de resposta do erro',
    type: AxiosErrorInnerResponseDto,
  })
  response: AxiosErrorInnerResponseDto;
}
