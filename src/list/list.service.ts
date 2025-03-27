import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { List, ListDocument } from './list.schema';
import { CreateListDto } from './list.dto';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { BoardService } from 'src/board/board.service';

@Injectable()
export class ListService {
  constructor(
    @InjectModel(List.name) private listModel: Model<ListDocument>,
    private readonly boardService: BoardService,
  ) {}

  /**
   * Cria uma nova lista garantindo validações de duplicação e estrutura correta.
   *
   * @async
   * @function create
   * @param {CreateListDto} list - Dados da lista a ser criada.
   * @returns {Promise<ApiResponseSuccess>} Retorna um objeto indicando sucesso ou erro na criação da lista.
   *
   * @throws {BadRequestException} Se o quadro não for encontrado ou se já existir uma lista com o mesmo nome.
   * @throws {InternalServerErrorException} Se ocorrer um erro inesperado ao criar a lista.
   */

  async create(list: CreateListDto): Promise<ApiResponseSuccess> {
    try {
      const existingList = await this.listModel.findOne({
        name: list.name,
      });

      const existingBoard = await this.boardService.findBoard(list.id_board);

      if (!existingBoard) {
        throw new BadRequestException('Quadro não encontrado.');
      }

      if (existingList) {
        throw new BadRequestException(
          'Já existe uma lista com este nome neste quadro.',
        );
      }

      const newList = new this.listModel({
        ...list,
        id_board: new Types.ObjectId(list.id_board),
      });
      await newList.save();

      return {
        error: false,
        message: `Lista criada com sucesso!`,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar a lista:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar a lista',
      );
    }
  }
}
