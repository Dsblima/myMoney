import { compare } from 'bcryptjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { sign, SignOptions } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';
import { IUserRepository } from '../../users/repositories/interfaces/IUserRepository';
import { authConfig } from '../config/auth';
import { IUserTokenRepository } from '../repositories/interface/IUserTokenRepository';

dayjs.extend(utc);
interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    refresh_token: string;
}

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,
    @inject("UserTokenRepository")
    private userTokenRepository: IUserTokenRepository
  ){}
  async execute({email, password}: IRequest) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user)
      throw new Error("email or password is incorrect!");

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch)
      throw new Error("email or password is incorrect!");

    const options: SignOptions = {
      subject: String(user.id),
      expiresIn: authConfig.expires_in_refresh_token_days,
    }
    const refresh_token = sign({}, authConfig.secret_token, options);
    
    await this.userTokenRepository.create({
      userId: user.id,
      refresh_token,
      expires_date: this.addDays(authConfig.expires_in_refresh_token_days)
    })

    const tokenReturn: IResponse = {
      refresh_token,
      user: {
          name: user.name,
          email: user.email,
      },
    };

    return tokenReturn;
  }

  private addDays(days: number): Date {
    return dayjs().add(days, 'days').toDate();
  }
}