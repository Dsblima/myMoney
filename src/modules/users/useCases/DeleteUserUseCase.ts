import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";

@injectable()
export class DeleteUserUseCase {
  constructor(
    @inject("UsersRepository") 
    private usersRepository: IUserRepository
  ) {}

  async execute(userId: string): Promise<void> {
    const userExists = await this.usersRepository.findById(userId);

    if (!userExists) {
      throw new Error('User not found');
    }
   return await this.usersRepository.delete(userId);
  }
}