import { container } from 'tsyringe';
import { IUserTokenRepository } from '../../modules/auth/repositories/interface/IUserTokenRepository';
import { UserTokenRepository } from '../../modules/auth/repositories/UserTokenRepository';
import { IUserRepository } from '../../modules/users/repositories/interfaces/IUserRepository';
import { UsersRepository } from '../../modules/users/repositories/UsersRepository';

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository
);
container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository
);