import { Repository, EntityRepository } from 'typeorm';
import { Task } from './tasks.entity';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task-dto';
import { GetTaskFilterDTO } from './dto/get-task-filter-dto';
import { User } from 'src/auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
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

    const task = await query.getMany();

    return task;
  }

  async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    const { title, description } = createTaskDTO;

    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.DONE;
    task.user = user;
    await task.save();

    delete task.user;

    return task;
  }
}
