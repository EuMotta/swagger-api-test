import { ApiProperty } from "@nestjs/swagger";
import { Task } from "./task.schema";

/**
 * @class ApiResponseTask
 *
 * DTO para receber no swagger as informações da tarefa.
 */
export class ApiResponseTask {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Tarefa encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: Task, nullable: true })
  data?: Task | null;
}
