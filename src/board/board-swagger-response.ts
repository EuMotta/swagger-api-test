import { ApiProperty } from '@nestjs/swagger';
import { Board } from './board.schema';

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
