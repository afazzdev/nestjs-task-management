import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTaskFilterDTO } from './dto/get-task-filter-dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTask(): Task[] {
    return this.tasks;
  }

  getTaskWithFilter(filterDTO: GetTaskFilterDTO): Task[] {
    const { status, search } = filterDTO;
    let task = this.getAllTask();

    if (filterDTO.status) {
      task = task.filter(el => el.status === status);
    }

    if (filterDTO.search) {
      task = task.filter(
        el => el.description.includes(search) || el.title.includes(search),
      );
    }

    return task;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(el => el.id === id);
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTaskById(id: string): void {
    this.tasks = this.tasks.filter(el => el.id !== id);
  }

  updateTaskById(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);
    task.status = status;

    return task;
  }
}
