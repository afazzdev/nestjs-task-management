import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeORMConfig: TypeOrmModuleOptions = {
  username: 'postgres',
  password: 'Programmer2k20',
  database: 'nest_tasks',
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  synchronize: true,
};
