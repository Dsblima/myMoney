import type { CreateUserDTO } from "../dtos/CreateuserDTO";

export class CreateUserUseCase {
  async execute(data: CreateUserDTO) {
    console.log("data");
    console.log(data);
  }
}