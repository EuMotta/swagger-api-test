import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { ListService } from './list.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateListDto } from './list.dto';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { AxiosErrorResponse } from 'src/utils/error.dto';

/**
 * Controlador responsável pela gestão de listas no sistema.
 *
 * Este controlador fornece endpoints para criar, listar, atualizar e excluir listas dentro de um quadro.
 * Apenas usuários autenticados podem acessar esses recursos, garantindo segurança e controle de acesso.
 *
 * Funcionalidades incluídas:
 * - Criação de novas listas associadas a um quadro específico.
 * - Proteção por autenticação utilizando `AuthGuard`.
 *
 * @module ListController
 */

@UseGuards(AuthGuard)
@ApiTags('lists')
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  /**
   * Cria uma nova lista dentro de um quadro.
   *
   * Este endpoint permite a criação de uma nova lista associada a um quadro existente.
   * O usuário deve estar autenticado para realizar essa operação.
   *
   * @summary Criar Lista
   * @param {CreateListDto} createList - Objeto contendo os dados da lista.
   * @returns {Promise<ApiResponseSuccess>} Retorna uma resposta de sucesso ao criar a lista.
   * @throws {UnauthorizedException} Se o usuário não estiver autenticado.
   * @throws {BadRequestException} Se os dados fornecidos forem inválidos ou a lista já existir.
   */

  @Post()
  @ApiOperation({ summary: 'Cria uma nova lista', operationId: 'createList' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Lista criada com sucesso',
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
  })
  async create(@Body() createList: CreateListDto): Promise<ApiResponseSuccess> {
    return this.listService.create(createList);
  }
}
