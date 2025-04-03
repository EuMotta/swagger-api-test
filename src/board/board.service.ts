import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBoardDto } from './board.dto';
import { Board, BoardDocument } from './board.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { ApiResponseData } from 'src/interfaces/api';
import { PageOptions } from 'src/db/pagination/page-options.dto';
import parse from '../utils/parse';
import { Page } from 'src/db/pagination/page.dto';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { ConfigService } from '@nestjs/config';
import { generateUniqueShortLink } from 'src/utils/generate-short-link';

@Injectable()
export class BoardService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<BoardDocument>,
  ) {}

  /**
   * Cria um novo quadro garantindo validações de duplicação e estrutura correta.
   *
   * @async
   * @function create
   * @param {CreateBoardDto} createBoardDto - Dados do quadro a ser criado.
   * @returns {Promise<ApiResponseSuccess>} Retorna um objeto indicando sucesso ou erro na criação do quadro.
   *
   * @throws {BadRequestException} Se já existir um quadro com o mesmo nome.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado ao criar o quadro.
   */

  async create(createBoardDto: CreateBoardDto): Promise<ApiResponseSuccess> {
    try {
      const existingBoard = await this.boardModel.findOne({
        name: createBoardDto.name,
      });

      if (existingBoard) {
        throw new BadRequestException('Já existe um quadro com este nome.');
      }

      const shortLink = await generateUniqueShortLink(
        this.boardModel,
        'short_link',
      );
      const createdBoard = new this.boardModel(createBoardDto);
      createdBoard.short_link = shortLink;

      await createdBoard.save();

      return {
        error: false,
        message: `Quadro criado com sucesso!`,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Erro ao criar quadro:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar o quadro',
      );
    }
  }

  /**
   * Obtém um quadro específico pelo ID.
   *
   * @async
   * @function get
   * @param {string} boardId - ID do quadro a ser buscado.
   * @returns {Promise<ApiResponseData<Board>>} Retorna os dados do quadro se encontrado.
   *
   * @throws {BadRequestException} Se o ID do quadro for inválido ou não for encontrado.
   * @throws {InternalServerErrorException} Se ocorrer um erro ao buscar o quadro.
   */

  async get(boardId: string): Promise<ApiResponseData<Board>> {
    try {
      let matchCondition: any;

      if (Types.ObjectId.isValid(boardId)) {
        matchCondition = { _id: new Types.ObjectId(boardId) };
      } else {
        matchCondition = { short_link: boardId };
      }

      const configService = new ConfigService();
      const shortLinkBase = configService.get<string>('SHORT_LINK_KANBAN');

      const board = await this.boardModel
        .aggregate([
          { $match: matchCondition },
          {
            $addFields: {
              member_qty: { $size: '$members' },
              short_link: { $concat: [shortLinkBase, '$short_link'] },
            },
          },

          {
            $lookup: {
              from: 'lists',
              localField: '_id',
              foreignField: 'id_board',
              as: 'lists',
            },
          },
          {
            $lookup: {
              from: 'tasks',
              localField: '_id',
              foreignField: 'board_id',
              as: 'tasks',
            },
          },
        ])
        .exec();

      if (!board || board.length === 0) {
        throw new BadRequestException('Quadro não encontrado ou sem listas.');
      }

      return {
        error: false,
        message: 'Quadro encontrado com sucesso!',
        data: board[0],
      };
    } catch (error) {
      console.error('Erro ao buscar quadro:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar o quadro',
      );
    }
  }

  /**
   * Obtém todos os quadros de um usuário com paginação.
   *
   * @async
   * @function getAll
   * @param {PageOptions} PageOptions - Opções de paginação (limite, página, etc.).
   * @param {string} userId - ID do usuário dono dos quadros.
   * @returns {Promise<ApiResponseData<Page<Board>>>} Retorna uma lista paginada de quadros.
   *
   * @throws {BadRequestException} Se o ID do usuário não for informado.
   * @throws {InternalServerErrorException} Se ocorrer um erro ao buscar os quadros.
   */

  async getAll(
    pageOptions: PageOptions,
    userId: string,
  ): Promise<ApiResponseData<Page<Board>>> {
    try {
      if (!userId) {
        throw new BadRequestException('ID do usuário é obrigatório.');
      }

      const limit = parse.getNumberIfPositive(pageOptions.limit) || 10;
      const page = parse.getNumberIfPositive(pageOptions.page) || 1;
      const offset = (page - 1) * limit;
      const configService = new ConfigService();
      const shortLinkBase = configService.get<string>('SHORT_LINK_KANBAN');

      const boardsAggregation = this.boardModel.aggregate([
        {
          $match: {
            $or: [{ owner_id: userId }, { members: userId }],
          },
        },
        {
          $addFields: {
            member_qty: { $size: '$members' },
            short_link: { $concat: [shortLinkBase, '$short_link'] },
          },
        },
        {
          $unset: 'members',
        },
        { $skip: offset },
        { $limit: limit },
      ]);

      const itemCount = await this.boardModel.countDocuments({
        $or: [{ owner_id: userId }, { members: userId }],
      });

      const boards = await boardsAggregation.exec();

      const pageMeta = new PageMeta({ itemCount, pageOptions });
      const paginated = new Page(boards, pageMeta);

      return {
        error: false,
        message: 'Quadros encontrados com sucesso!',
        data: paginated,
      };
    } catch (error) {
      console.error('Erro ao buscar quadros:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao buscar os quadros.',
      );
    }
  }

  /**
   * Busca um quadro pelo ID sem processar agregações.
   *
   * @function findBoard
   * @param {string} boardId - ID do quadro a ser buscado.
   * @returns {Promise<BoardDocument | null>} Retorna o quadro encontrado ou null se não existir.
   *
   * @throws {BadRequestException} Se o ID do quadro for inválido.
   */

  async findBoard(
    boardId: string | Types.ObjectId,
  ): Promise<BoardDocument | null> {
    if (typeof boardId === 'string') {
      if (!Types.ObjectId.isValid(boardId)) {
        throw new BadRequestException('ID do quadro inválido.');
      }
      boardId = new Types.ObjectId(boardId);
    } else if (!(boardId instanceof Types.ObjectId)) {
      throw new BadRequestException('ID do quadro inválido.');
    }

    return this.boardModel.findById(boardId).exec();
  }
}
