import { Repository, EntityRepository } from 'typeorm';
import { Task } from './tasks.entity';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTaskFilterDTO } from './dto/get-task-filter-dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger();

  async getTasks(filterDTO: GetTaskFilterDTO, user: User): Promise<Task[]> {
    const { search, status } = filterDTO;

    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const task = await query.getMany();

      return task;
    } catch (error) {
      this.logger.error(
        `Failed to get task for user "${user.username}", DTO: "${JSON.stringify(
          filterDTO,
          error.stack,
        )}"`,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.DONE;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create task for user "${
          user.username
        }". Data ${JSON.stringify(createTaskDTO)}`,
      );
      throw new InternalServerErrorException();
    }

    delete task.user;

    return task;
  }
}
