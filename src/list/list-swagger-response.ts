import { ApiProperty } from "@nestjs/swagger";
import { List } from "./list.schema";

/**
 * @class ApiResponseTask
 *
 * DTO para receber no swagger as informações da tarefa.
 */
export class ApiResponseTask {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Lista encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: List, nullable: true })
  data?: List | null;
}
