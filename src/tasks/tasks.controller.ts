import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTaskFilterDTO } from './dto/get-task-filter-dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation-pipes';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) filterDTO: GetTaskFilterDTO): Task[] {
    if (Object.keys(filterDTO).length) {
      return this.taskService.getTaskWithFilter(filterDTO);
    } else {
      return this.taskService.getAllTask();
    }
  }

  @Get(':id')
  getTaskById(@Param('id') id: string): Task {
    return this.taskService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.taskService.createTask(createTaskDTO);
  }

  @Delete(':id')
  deleteTaskById(@Param('id') id: string): void {
    return this.taskService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskById(id, status);
  }
}
