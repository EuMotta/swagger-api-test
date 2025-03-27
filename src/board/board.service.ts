import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBoardDto } from './board.dto';
import { Board, BoardDocument } from './board.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { ApiResponseData } from 'src/interfaces/api';
import { PageOptionsDto } from 'src/db/pagination/page-options.dto';
import parse from '../utils/parse';
import { PageDto } from 'src/db/pagination/page.dto';
import { PageMetaDto } from 'src/db/pagination/page-meta.dto';

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

      const createdBoard = new this.boardModel(createBoardDto);
      await createdBoard.save();

      return {
        error: false,
        message: `Quadro criado com sucesso!`,
      };
    } catch (error) {
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
      if (!Types.ObjectId.isValid(boardId)) {
        throw new BadRequestException('ID do quadro inválido.');
      }
      const objectId = new Types.ObjectId(boardId);

      const board = await this.boardModel
        .aggregate([
          { $match: { _id: objectId } },
          {
            $lookup: {
              from: 'lists',
              localField: '_id',
              foreignField: 'id_board',
              as: 'lists',
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
   * @param {PageOptionsDto} pageOptionsDto - Opções de paginação (limite, página, etc.).
   * @param {string} userId - ID do usuário dono dos quadros.
   * @returns {Promise<ApiResponseData<PageDto<Board>>>} Retorna uma lista paginada de quadros.
   *
   * @throws {BadRequestException} Se o ID do usuário não for informado.
   * @throws {InternalServerErrorException} Se ocorrer um erro ao buscar os quadros.
   */

  async getAll(
    pageOptionsDto: PageOptionsDto,
    userId: string,
  ): Promise<ApiResponseData<PageDto<Board>>> {
    try {
      if (!userId) {
        throw new BadRequestException('ID do usuário é obrigatório.');
      }

      const limit = parse.getNumberIfPositive(pageOptionsDto.limit) || 10;
      const page = parse.getNumberIfPositive(pageOptionsDto.page) || 1;
      const offset = (page - 1) * limit;

      const boardsAggregation = this.boardModel.aggregate([
        {
          $match: {
            $or: [{ owner_id: userId }, { members: userId }],
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
        { $unwind: { path: '$lists', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'tasks',
            localField: 'lists._id',
            foreignField: 'list_id',
            as: 'lists.tasks',
          },
        },
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            description: { $first: '$description' },
            members: { $first: '$members' },
            short_link: { $first: '$short_link' },
            archived: { $first: '$archived' },
            is_private: { $first: '$is_private' },
            owner_id: { $first: '$owner_id' },
            createdAt: { $first: '$createdAt' },
            updatedAt: { $first: '$updatedAt' },
            lists: { $push: '$lists' },
          },
        },
        { $skip: offset },
        { $limit: limit },
      ]);

      const itemCount = await this.boardModel.countDocuments({
        $or: [{ owner_id: userId }, { members: userId }],
      });

      const boards = await boardsAggregation.exec();

      const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
      const pageDto = new PageDto(boards, pageMetaDto);

      return {
        error: false,
        message: 'Quadros encontrados com sucesso!',
        data: pageDto,
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

  findBoard(boardId: string) {
    if (!Types.ObjectId.isValid(boardId)) {
      throw new BadRequestException('ID do quadro inválido.');
    }
    return this.boardModel.findById(new Types.ObjectId(boardId));
  }
}
