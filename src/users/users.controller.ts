import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserResponse,
  UpdateUserEmailResponse,
  UpdateUserResponse,
  UpdateUserStatusResponse,
  UserDto,
} from './user.dto';
import { Throttle } from '@nestjs/throttler';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiResponseData } from 'src/interfaces/api';
import { PageDto } from 'src/db/pagination/page.dto';
import { PageOptionsDto } from 'src/db/pagination/page-options.dto';
import { AdminOnly } from 'src/guards/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';

/**
 * Controlador responsável pela gestão de usuários no sistema.
 *
 * Esta classe define os endpoints relacionados às operações com usuários, como criação, consulta, atualização e exclusão.
 * Apenas usuários autenticados podem acessar esses recursos, e algumas operações são restritas a administradores.
 *
 * Funcionalidades incluídas:
 * - Criação de novos usuários.
 * - Consulta de usuários individuais ou listagem paginada.
 * - Atualização de dados do usuário, incluindo e-mail e status.
 * - Aplicação de regras de autenticação e controle de acesso.
 * - Proteção contra abuso com limitação de taxa (rate limiting).
 *
 * @module UsersController
 */

@UseGuards(AuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Cria um novo usuário no sistema.
   *
   * Este endpoint permite o registro de um novo usuário com os dados fornecidos.
   * Apenas administradores têm permissão para executar essa operação.
   * Um limite de taxa (rate limiting) é aplicado para evitar abusos.
   *
   * @summary Criar Usuário
   * @param {CreateUserResponse} user - Objeto contendo os dados do usuário para registro.
   * @returns {Promise<ApiResponseData<CreateUserResponse>>} Retorna os detalhes do usuário criado.
   * @throws {UnauthorizedException} Se o registro falhar por problemas de autenticação.
   */

  @Throttle({ default: { limit: 1, ttl: 500 } })
  @UseGuards(AdminOnly)
  @Post()
  @HttpCode(HttpStatus.OK)
  /* swagger start */
  @ApiOperation({ summary: 'Create a new User', operationId: 'createUser' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Register successful',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Register Fail',
  })
  @ApiBody({ type: CreateUserResponse })
  /* swagger end */
  async create(
    @Body() user: CreateUserResponse,
  ): Promise<ApiResponseData<CreateUserResponse>> {
    return this.usersService.create(user);
  }

  /**
   * Recupera a lista de todos os usuários cadastrados.
   *
   * Este endpoint permite obter uma lista paginada de usuários do sistema.
   * Um limite de taxa (rate limiting) é aplicado para evitar abusos.
   *
   * @summary Obter Todos os Usuários
   * @param {PageOptionsDto} pageOptionsDto - Opções de paginação, como número da página e tamanho da página.
   * @returns {Promise<ApiResponseData<PageDto<UserDto>>>} Retorna uma lista paginada de usuários.
   * @throws {BadRequestException} Se a requisição for inválida.
   */

  @Throttle({ default: { limit: 1, ttl: 500 } })
  @Get()
  /* swagger start */
  @ApiOperation({ summary: 'Get All Users', operationId: 'getAllUsers' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Get all users Fail',
  })
  @ApiBody({ type: UserDto })
  /* swagger end */
  async getAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<ApiResponseData<PageDto<UserDto>>> {
    return this.usersService.getAll(pageOptionsDto);
  }

  /**
   * Recupera um usuário pelo endereço de e-mail.
   *
   * Este endpoint permite buscar um usuário cadastrado com base no e-mail fornecido.
   * Se o usuário for encontrado, retorna seus detalhes. Caso contrário, retorna um erro.
   *
   * @summary Buscar Usuário por E-mail
   * @param {string} email - O endereço de e-mail do usuário a ser buscado.
   * @returns {Promise<CreateUserResponse>} Os detalhes do usuário encontrado.
   * @throws {BadRequestException} Se o e-mail for inválido ou a busca falhar.
   */

  @Get('/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Get User With Email',
    operationId: 'getUserByEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get User With Email successful',
    type: CreateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Get User With Email Fail',
  })
  @ApiBody({ type: CreateUserResponse })
  /* swagger end */
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByUserEmail(email);
  }

  /**
   * Atualiza os dados de um usuário com base no endereço de e-mail fornecido.
   *
   * Este endpoint permite a atualização das informações de um usuário já cadastrado.
   * Apenas administradores têm permissão para executar essa operação.
   *
   * @summary Atualizar Usuário
   * @param {string} email - O endereço de e-mail do usuário a ser atualizado.
   * @param {UpdateUserResponse} user - Objeto contendo os novos dados do usuário.
   * @returns {Promise<CreateUserResponse>} Os detalhes do usuário atualizado.
   * @throws {BadRequestException} Se os dados forem inválidos ou a atualização falhar.
   * @throws {ForbiddenException} Se o usuário não tiver permissão para atualizar os dados.
   */

  @UseGuards(AdminOnly)
  @Put('/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Update User With Email',
    operationId: 'updateUserByEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update User With Email successful',
    type: UpdateUserResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update User With Email Fail',
  })
  @ApiBody({ type: UpdateUserResponse })
  /* swagger end */
  update(@Param('email') email: string, @Body() user: UpdateUserResponse) {
    return this.usersService.update(email, user);
  }

  /**
   * Atualizar o status do usuário pelo email.
   *
   * Este endpoint permite apenas administradores atualizarem o status.
   *
   * @summary Atualizar status do usuário
   * @param {string} email - Email que será utilizado para atualizar
   * @param {UpdateUserStatusResponse} data - Variavel para atualizar o status
   * @returns {Promise<UpdateUserStatusResponse>} Status atualizado.
   * @throws {BadRequestException} Caso a operação falhe.
   */

  @UseGuards(AdminOnly)
  @Patch('update_status/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Update user status',
    operationId: 'updateUserStatus',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update User status successful',
    type: UpdateUserStatusResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update User status Fail',
  })
  @ApiBody({ type: UpdateUserStatusResponse })
  /* swagger end */
  updateStatus(
    @Param('email') email: string,
    @Body() data: UpdateUserStatusResponse,
  ) {
    return this.usersService.updateStatus(email, data);
  }

  /**
   * Atualizar o email do usuário pelo email atual.
   *
   * Este endpoint permite apenas administradores atualizarem o status.
   *
   * @summary Atualizar email do usuário
   * @param {string} email - Email que será utilizado para atualizar
   * @param {UpdateUserStatusResponse} data - Variavel para atualizar o email
   * @returns {Promise<UpdateUserEmailResponse>} email atualizado.
   * @throws {BadRequestException} Caso a operação falhe.
   */

  @UseGuards(AdminOnly)
  @Patch('update_email/:email')
  /* swagger start */
  @ApiOperation({
    summary: 'Update user email',
    operationId: 'updateUserEmail',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update User email successful',
    type: UpdateUserEmailResponse,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Update User status Fail',
  })
  @ApiBody({ type: UpdateUserEmailResponse })
  /* swagger end */
  updateEmail(
    @Param('email') email: string,
    @Body() data: UpdateUserEmailResponse,
  ) {
    return this.usersService.updateEmail(email, data);
  }
}
