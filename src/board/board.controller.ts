import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BoardService } from './board.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Board } from './board.schema';
import { CreateBoardDto } from './board.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { TokenPayload } from 'src/interfaces/token.interface';
import { ApiResponseData } from 'src/interfaces/api';
import { ApiResponseBoard } from './board-swagger-response';
import { PageOptionsDto } from 'src/db/pagination/page-options.dto';
import { PageDto } from 'src/db/pagination/page.dto';

/**
 * Controlador responsável pela gestão de quadros no sistema.
 *
 * Este controlador fornece endpoints para criar, listar e obter detalhes de quadros.
 * Apenas usuários autenticados podem acessar esses recursos.
 *
 * Funcionalidades incluídas:
 * - Criação de novos quadros.
 * - Recuperação de um quadro específico pelo ID.
 * - Listagem paginada de todos os quadros do usuário.
 *
 * @module BoardController
 */

@UseGuards(AuthGuard)
@ApiTags('boards')
@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  /**
   * Obtém os detalhes de um quadro específico pelo ID.
   *
   * Este endpoint permite a recuperação de um quadro existente com base no seu identificador único.
   * O usuário deve estar autenticado para acessar essas informações.
   *
   * @summary Obter detalhes de um quadro
   * @param {string} id - O ID do quadro a ser recuperado.
   * @returns {Promise<ApiResponseData<Board>>} Retorna os detalhes do quadro.
   * @throws {BadRequestException} Se o ID for inválido ou o quadro não for encontrado.
   */

  @Get('/:id')
  @ApiOperation({ summary: 'Show board', operationId: 'getBoard' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Board successful',
    type: ApiResponseBoard,
  })
  async get(@Param('id') id: string): Promise<ApiResponseData<Board>> {
    return this.boardService.get(id);
  }

  /**
   * Obtém todos os quadros do usuário autenticado com paginação.
   *
   * Este endpoint retorna uma lista paginada de quadros que pertencem ao usuário ou dos quais ele é membro.
   *
   * @summary Listar todos os quadros do usuário
   * @param {PageOptionsDto} pageOptions - Parâmetros de paginação (página e limite).
   * @param {TokenPayload} token - Token do usuário autenticado para identificar o dono dos quadros.
   * @returns {Promise<ApiResponseData<PageDto<Board>>>} Lista paginada de quadros.
   */

  @Get()
  @ApiOperation({ summary: 'Show all boards', operationId: 'getAllBoards' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all boards successful',
    type: ApiResponseBoard,
  })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  async getAll(
    @Query() pageOptions: PageOptionsDto,
    @GetUser() token: TokenPayload,
  ): Promise<ApiResponseData<PageDto<Board>>> {
    return this.boardService.getAll(pageOptions, token.sub);
  }

  /**
   * Cria um novo quadro.
   *
   * Este endpoint permite a criação de um novo quadro no sistema, vinculado ao usuário autenticado.
   *
   * @summary Criar um quadro
   * @param {CreateBoardDto} createBoard - Objeto contendo os dados do quadro a ser criado.
   * @param {TokenPayload} token - Token do usuário autenticado para definir o proprietário do quadro.
   * @returns {Promise<ApiResponseSuccess>} Confirmação de criação do quadro.
   * @throws {BadRequestException} Se os dados forem inválidos ou um quadro com o mesmo nome já existir.
   */

  @Post()
  @ApiOperation({ summary: 'Create a new Board', operationId: 'createBoard' })
  @ApiResponse({
    status: 201,
    description: 'Board created successfully',
    type: Board,
  })
  async create(
    @Body() createBoard: CreateBoardDto,
    @GetUser() token: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    createBoard.owner_id = token.sub;
    return this.boardService.create(createBoard);
  }
}
