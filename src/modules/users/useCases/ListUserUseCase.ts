import { inject, injectable } from "tsyringe";
import { User } from "../User";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";

@injectable()
export class ListUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository
  ){}
  async execute(): Promise<User[]>{
    console.log("All users");
    const allUsers = await this.usersRepository.listUsers();
    return allUsers;
  }
}