import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
  ChangeTaskListDto,
  ChangeTaskStatusDto,
  CreateTaskDto,
} from './task.dto';
import { Task, TaskDocument } from './task.schema';
import { UsersService } from 'src/users/users.service';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { ListService } from 'src/list/list.service';
import { TokenPayload } from 'src/interfaces/token.interface';
import { BoardService } from 'src/board/board.service';
import { BoardDocument } from 'src/board/board.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly usersService: UsersService,
    private readonly listService: ListService,
    private readonly boardService: BoardService,
  ) {}

  /**
   * Cria uma nova tarefa validando se o usuário existe no PostgreSQL
   */

  async create(createTask: CreateTaskDto): Promise<ApiResponseSuccess> {
    try {
      const { title, list_id, users_reminder } = createTask;

      if (!title) {
        throw new BadRequestException('O título da tarefa é obrigatório');
      }

      if (!list_id) {
        throw new BadRequestException(
          'A tarefa deve estar associada a uma lista',
        );
      }
      const existsList = await this.listService.get(list_id);
      if (users_reminder && users_reminder.length > 0) {
        for (const userId of users_reminder) {
          const userExists = await this.usersService.findByUserId(userId);
          if (!userExists) {
            throw new NotFoundException(
              `Usuário com ID ${userId} não encontrado`,
            );
          }
        }
      }

      const createdTask = new this.taskModel({
        ...createTask,
        board_id: new Types.ObjectId(existsList.id_board),
        list_id: new Types.ObjectId(createTask.list_id),
      });
      await createdTask.save();

      return {
        error: false,
        message: 'Tarefa criada com sucesso!',
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar a tarefa:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar a tarefa',
      );
    }
  }
  async changeList(
    changeTask: ChangeTaskListDto,
    id: string,
  ): Promise<ApiResponseSuccess> {
    try {
      if (!id) {
        throw new BadRequestException('O ID da tarefa é obrigatório.');
      }

      const { list_id } = changeTask;

      if (!list_id) {
        throw new BadRequestException(
          'A tarefa deve estar associada a uma lista.',
        );
      }

      const existsList = await this.listService.get(list_id);
      if (!existsList) {
        throw new NotFoundException('Lista não encontrada.');
      }

      const updatedTask = await this.taskModel.findByIdAndUpdate(
        { _id: id },
        { $set: { list_id: new Types.ObjectId(list_id) } },
        { new: true, runValidators: true },
      );

      if (!updatedTask) {
        throw new NotFoundException('Tarefa não encontrada.');
      }

      return {
        error: false,
        message: 'Tarefa atualizada com sucesso!',
      };
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error);

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar a tarefa.',
      );
    }
  }

  async updateStatus(
    id: string,
    token: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    try {
      if (!id) throw new BadRequestException('O ID da tarefa é obrigatório.');

      const { task, board } = await this.validateTaskAndBoard(id, token);

      await this.taskModel.findOneAndUpdate(
        { _id: id },
        [{ $set: { is_completed: { $eq: [false, '$is_completed'] } } }],
        { new: true, runValidators: true },
      );

      return {
        error: false,
        message: 'Tarefa atualizada com sucesso!',
      };
    } catch (error) {
      console.error('Erro ao atualizar o status da tarefa:', error);

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao atualizar a tarefa.',
      );
    }
  }

  private async validateTaskAndBoard(id: string, token: TokenPayload) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Tarefa não encontrada.');

    const board = await this.boardService.findBoard(task.board_id);
    if (!board) throw new NotFoundException('Board não encontrado.');

    const isUserAuthorized =
      board.owner_id.toString() === token.sub ||
      board.members.includes(token.sub);
    if (!isUserAuthorized)
      throw new ForbiddenException(
        'Usuário sem permissão para acessar este board.',
      );

    return { task, board };
  }
}
