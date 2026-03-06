import { inject, injectable } from "tsyringe";
import type { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";

@injectable()
export class CreateUserUseCase {

  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository
  ){}
  async execute(data: ICreateUserDTO) {
    console.log("CreateUserUseCase");
    console.log(data);

    await this.usersRepository.create(data);
  }
}