import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { ApiResponseTask } from './task-swagger-response';
import { AxiosErrorResponseDto } from 'src/utils/error.dto';

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
   * @param {CreateTaskDto} createTaskDto - Objeto contendo os dados da tarefa.
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
    type: AxiosErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'User not authenticated',
    type: AxiosErrorResponseDto,
  })
  async create(
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<ApiResponseSuccess> {
    return this.taskService.create(createTaskDto);
  }
}
