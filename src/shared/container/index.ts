import { container } from 'tsyringe';
import { IUserTokenRepository } from '../../modules/auth/repositories/interface/IUserTokenRepository';
import { UserTokenRepository } from '../../modules/auth/repositories/UserTokenRepository';
import { DebtRepository } from '../../modules/debts/repositories/DebtRepository';
import { IDebtRepository } from '../../modules/debts/repositories/interface/IDebtRepository';
import { InstallmentRepository } from '../../modules/installments/repositories/InstallmentRepository';
import { IInstallmentRepository } from '../../modules/installments/repositories/interface/IInstallmentRepository';
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
container.registerSingleton<IDebtRepository>(
  'DebtRepository',
  DebtRepository
);
container.registerSingleton<IInstallmentRepository>(
  'InstallmentRepository',
  InstallmentRepository
);