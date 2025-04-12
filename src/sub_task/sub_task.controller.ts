import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubTaskService } from './sub_task.service';
import { CreateSubTaskDto } from './sub_task.dto';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { AxiosErrorResponse } from 'src/utils/error.dto';
import { CreateSubTask } from './sub_task-swagger-response';

@UseGuards(AuthGuard)
@ApiTags('subtasks')
@Controller('sub_task')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  /**
   * Cria uma nova tarefa.
   *
   * Este endpoint permite a criação de uma nova tarefa dentro de um quadro.
   * O usuário deve estar autenticado para realizar essa operação.
   *
   * @summary Criar Tarefa
   * @param {CreateTaskDto} createTask - Objeto contendo os dados da tarefa.
   * @returns {Promise<ApiResponseSuccess>} Retorna uma resposta de sucesso ao criar a tarefa.
   * @throws {UnauthorizedException} Se o usuário não estiver autenticado.
   * @throws {BadRequestException} Se os dados fornecidos forem inválidos.
   */

  @Post()
  @ApiOperation({ summary: 'Cria uma nova subtarefa', operationId: 'createSubTask' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'subtarefa criada com sucesso',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados invalidos',
    type: AxiosErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
    type: AxiosErrorResponse,
  })
  @ApiBody({ type: CreateSubTask })
  async create(@Body() createSubTask: CreateSubTaskDto): Promise<ApiResponseSuccess> {
    return this.subTaskService.create(createSubTask);
  }
}
