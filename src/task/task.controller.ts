import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ChangeTaskListDto,
  ChangeTaskStatusDto,
  CreateTaskDto,
} from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import {
  ApiResponseTask,
  ChangeTaskList,
  CreateTask,
} from './task-swagger-response';
import { AxiosErrorResponse } from 'src/utils/error.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { TokenPayload } from 'src/interfaces/token.interface';

/**
 * Controlador responsável pela gestão de tarefas no sistema.
 *
 * Este controlador fornece endpoints para criar, listar, atualizar e excluir tarefas.
 * Apenas usuários autenticados podem acessar esses recursos, garantindo segurança e controle de acesso.
 *
 * Funcionalidades incluídas:
 * - Criação de novas tarefas associadas a um quadro.
 * - Consulta de tarefas específicas ou listagem paginada.
 * - Atualização de informações das tarefas, como status e descrição.
 * - Remoção de tarefas indesejadas ou concluídas.
 * - Proteção por autenticação utilizando `AuthGuard`.
 *
 * @module TaskController
 */

@UseGuards(AuthGuard)
@ApiTags('tasks')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

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
  @ApiOperation({ summary: 'Create a new task', operationId: 'createTask' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
    type: ApiResponseTask,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided',
    type: AxiosErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
    type: AxiosErrorResponse,
  })
  @ApiBody({ type: CreateTask })
  async create(@Body() createTask: CreateTaskDto): Promise<ApiResponseSuccess> {
    return this.taskService.create(createTask);
  }

  /**
   * Atualizar a lista de uma tarefa específica.
   *
   * Este endpoint permite alterar a lista em que uma tarefa está localizada.
   * O usuário deve estar autenticado para realizar essa operação.
   *
   * @summary Alterar lista da tarefa
   * @param {string} id - ID da tarefa a ser alterada.
   * @param {ChangeTaskListDto} task - Objeto contendo os novos dados da tarefa.
   * @returns {Promise<ApiResponseSuccess>} Retorna uma resposta de sucesso ao alterar a lista da tarefa.
   * @throws {UnauthorizedException} Se o usuário não estiver autenticado.
   * @throws {BadRequestException} Se os dados fornecidos forem inválidos.
   */
  @Patch('/:id/change_list')
  @ApiOperation({
    summary: 'Alterar lista da tarefa',
    operationId: 'changeTaskList',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lista da tarefa alterada com sucesso',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
    type: AxiosErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
    type: AxiosErrorResponse,
  })
  @ApiBody({ type: ChangeTaskList })
  async changeList(
    @Body() task: ChangeTaskListDto,
    @Param('id') id: string,
  ): Promise<ApiResponseSuccess> {
    return this.taskService.changeList(task, id);
  }

  /**
   * Atualizar o status de uma tarefa específica.
   *
   * Este endpoint permite modificar o status de uma tarefa.
   * Apenas usuários autenticados podem realizar essa operação.
   *
   * @summary Atualizar status da tarefa
   * @param {string} id - ID da tarefa a ser alterada.
   * @param {TokenPayload} token - Token do usuário autenticado.
   * @returns {Promise<ApiResponseSuccess>} Retorna uma resposta de sucesso ao alterar o status da tarefa.
   * @throws {UnauthorizedException} Se o usuário não estiver autenticado.
   * @throws {BadRequestException} Se os dados fornecidos forem inválidos.
   */
  @Patch('/:id/update_status')
  @ApiOperation({
    summary: 'Atualizar status da tarefa',
    operationId: 'updateTaskStatus',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Status alterado com sucesso',
    type: ApiResponseSuccess,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos fornecidos',
    type: AxiosErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuário não autenticado',
    type: AxiosErrorResponse,
  })
  async changeStatus(
    @Param('id') id: string,
    @GetUser() token: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    return this.taskService.updateStatus(id, token);
  }
}
