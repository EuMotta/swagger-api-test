import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SubTask, SubTaskDocument } from './sub_task.schema';
import { Model, Types } from 'mongoose';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { TaskService } from 'src/task/task.service';
import { CreateSubTaskDto } from './sub_task.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectModel(SubTask.name)
    private subTaskModel: Model<SubTaskDocument>,
    private readonly taskService: TaskService,
    private readonly usersService: UsersService,
  ) {}

  async create(newSubTask: CreateSubTaskDto): Promise<ApiResponseSuccess> {
    try {
      const { title, task_id, users_reminder } = newSubTask;

      if (!title) {
        throw new BadRequestException('O título da subtarefa é obrigatório');
      }

      if (!task_id) {
        throw new BadRequestException(
          'A subtarefa deve estar associada a uma tarefa',
        );
      }

      await this.taskService.validateTask(task_id);

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

      const createSubTask = new this.subTaskModel({
        ...newSubTask,
        task_id: new Types.ObjectId(newSubTask.task_id),
      });

      await createSubTask.save();

      return {
        error: false,
        message: 'Subtarefa criada com sucesso!',
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      console.error('Erro ao criar a tarefa:', error);
      throw new InternalServerErrorException(
        'Ocorreu um erro ao criar a tarefa',
      );
    }
  }
}
