import { inject, injectable } from "tsyringe";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";

@injectable()
export class UpdateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository
  ){}

  async execute(userToUpdate: IUpdateUserDTO) {
    const userExists = await this.usersRepository.findById(userToUpdate.id);

    if (!userExists) {
      throw new Error('User not found');
    }

    return await this.usersRepository.update(userToUpdate);
  }
}