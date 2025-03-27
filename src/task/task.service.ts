import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTaskDto } from './task.dto';
import { Task, TaskDocument } from './task.schema';
import { UsersService } from 'src/users/users.service';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Cria uma nova tarefa validando se o usuário existe no PostgreSQL
   */
  async create(createTaskDto: CreateTaskDto): Promise<ApiResponseSuccess> {
    const { title, list_id, users_reminder } = createTaskDto;

    if (!title) {
      throw new BadRequestException('O título da tarefa é obrigatório');
    }

    if (!list_id) {
      throw new BadRequestException(
        'A tarefa deve estar associada a uma lista',
      );
    }

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

    const createdTask = new this.taskModel(createTaskDto);
    await createdTask.save();

    return {
      error: false,
      message: 'Tarefa criada com sucesso!',
    };
  }
}
