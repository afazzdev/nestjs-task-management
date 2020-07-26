import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTaskFilterDTO } from './dto/get-task-filter-dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './tasks.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!task) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }

    return task;
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const task = await this.taskRepository.delete({ id, userId: user.id });

    if (!task.affected) {
      throw new NotFoundException(`Task with id: ${id} not found`);
    }
  }

  async updateTaskById(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
