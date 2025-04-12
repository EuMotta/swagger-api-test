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

import { ChangeTaskListDto, CreateTaskDto } from './task.dto';
import { Task, TaskDocument } from './task.schema';
import { UsersService } from 'src/users/users.service';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { ListService } from 'src/list/list.service';
import { TokenPayload } from 'src/interfaces/token.interface';
import { BoardService } from 'src/board/board.service';

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

      if (!title)
        throw new BadRequestException('O título da tarefa é obrigatório.');
      if (!list_id)
        throw new BadRequestException(
          'A tarefa deve estar associada a uma lista.',
        );

      const existsList = await this.listService.get(list_id);
      if (!existsList) {
        throw new NotFoundException('Lista não encontrada.');
      }

      if (users_reminder?.length) {
        await this.validateUsers(users_reminder);
      }

      const createdTask = new this.taskModel({
        ...createTask,
        board_id: new Types.ObjectId(existsList.id_board),
        list_id: new Types.ObjectId(list_id),
      });

      await createdTask.save();

      return {
        error: false,
        message: 'Tarefa criada com sucesso!',
      };
    } catch (error) {
      console.error('Erro ao criar a tarefa:', error);

      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar a tarefa.',
      );
    }
  }

  async get(id: string) {
    try {
      if (!id) throw new BadRequestException('O ID da tarefa é obrigatório.');

      const task = await this.validateTask(id);

      return {
        error: false,
        message: 'Tarefa encontrada com sucesso!',
        data: task,
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

  async changeList(
    changeTask: ChangeTaskListDto,
    id: string,
  ): Promise<ApiResponseSuccess> {
    try {
      if (!id) {
        throw new BadRequestException('O ID da tarefa é obrigatório.');
      }

      const { task } = await this.validateTaskAndList(id, changeTask.list_id);

      if (task.list_id.equals(new Types.ObjectId(changeTask.list_id))) {
        throw new ConflictException('Tarefa já está na lista desejada.');
      }

      const updatedTask = await this.taskModel.findByIdAndUpdate(
        { _id: id },
        { $set: { list_id: new Types.ObjectId(changeTask.list_id) } },
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

      await this.validateTaskAndBoard(id, token);

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

  async validateTask(taskId: string) {
    const task = await this.taskModel
      .aggregate([
        {
          $match: {
            _id: new Types.ObjectId(taskId),
          },
        },
        {
          $lookup: {
            from: 'subtasks',
            localField: '_id',
            foreignField: 'task_id',
            as: 'sub_tasks',
          },
        },
      ])
      .exec();

    if (!task || task.length === 0) {
      throw new NotFoundException('Tarefa não encontrada.');
    }

    return task[0];
  }

  private async validateTaskAndList(taskId: string, list_id: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Tarefa não encontrada.');

    const existsList = await this.listService.get(list_id);
    if (!existsList) {
      throw new NotFoundException('Lista não encontrada.');
    }

    return { task };
  }

  private async validateUsers(userIds: string[]): Promise<void> {
    for (const userId of userIds) {
      const userExists = await this.usersService.findByUserId(userId);
      if (!userExists) {
        throw new NotFoundException(`Usuário com ID ${userId} não encontrado.`);
      }
    }
  }

  private async validateTaskAndBoard(taskId: string, token: TokenPayload) {
    const task = await this.taskModel.findById(taskId);
    if (!task) throw new NotFoundException('Tarefa não encontrada.');

    const board = await this.boardService.findBoard(task.board_id);
    if (!board) throw new NotFoundException('Board não encontrado.');

    return { task, board };
  }
}
