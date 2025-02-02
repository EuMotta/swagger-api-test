import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaskEntity } from 'src/db/entities/task.entity';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task', operationId: 'createTask' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Task created successfully',
    type: TaskEntity,
  })
  create(@Body() task: TaskDto) {
    return this.taskService.create(task);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get task details by ID',
    operationId: 'getTaskById',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found task',
    type: TaskEntity,
  })
  findById(@Param('id') id: string) {
    return this.taskService.findById(id);
  }

  @Get()
  @ApiOperation({
    summary: 'List tasks with optional filters',
    operationId: 'listTasks',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of tasks',
    type: [TaskEntity],
  })
  findAll(@Query() Params: FindAllParameters): TaskDto[] {
    return this.taskService.findAll(Params);
  }

  @Put()
  @ApiOperation({
    summary: 'Update an existing task',
    operationId: 'updateTask',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Task updated successfully',
    type: TaskEntity,
  })
  @ApiBody({
    description: 'The task object to update',
    type: TaskDto,
    examples: {
      example1: {
        summary: 'Example task update',
        value: {
          id: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
          title: 'Updated Task Title',
          description: 'Updated description for the task',
          status: 'Completed',
          expirationDate: '2025-12-31T23:59:59.000Z',
        },
      },
    },
  })
  update(@Body() task: TaskDto) {
    return this.taskService.update(task);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete a task by ID', operationId: 'deleteTask' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Task deleted successfully',
  })
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
