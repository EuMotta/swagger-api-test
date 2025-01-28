import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnun } from './task.dto';
import { v4 as uuid } from 'uuid';
@Injectable()
export class TaskService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    task.id = uuid();
    task.status = TaskStatusEnun.TO_DO;
    this.tasks.push(task);
  }

  findById(id: string): TaskDto {
    const foundTask = this.tasks.filter((t) => t.id === id);

    if (foundTask.length) {
      return foundTask[0];
    }

    throw new HttpException(
      `task com id: ${id} nao encontrada`,
      HttpStatus.NOT_FOUND,
    );
  }

  findAll(params: FindAllParameters): TaskDto[] {
    return this.tasks.filter((t) => {
      let match = true;
      if (params.title !== undefined && !t.title.includes(params.title)) {
        match = false;
      }
      if (params.status !== undefined && !t.status.includes(params.status)) {
        match = false;
      }

      return match;
    });
  }

  update(task: TaskDto) {
    const taskIndex = this.tasks.findIndex((t) => t.id === task.id);

    if (taskIndex >= 0) {
      this.tasks[taskIndex] = task;
      return;
    }

    throw new HttpException(
      `task com id: ${task.id} nao encontrada`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    const taskIndex = this.tasks.findIndex((t) => t.id === id);
    if (taskIndex >= 0) {
      this.tasks.splice(taskIndex, 1);
      return;
    }

    throw new HttpException(
      `task com id ${id} nao encontrado`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
