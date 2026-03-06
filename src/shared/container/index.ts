import { container } from 'tsyringe';
import { IUserRepository } from '../../modules/users/repositories/interfaces/IUserRepository';
import { UsersRepository } from '../../modules/users/repositories/UsersRepository';

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository
);