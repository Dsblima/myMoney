import type { ICreateUserDTO } from "../dtos/ICreateUserDTO";

export class CreateUserUseCase {
  async execute(data: ICreateUserDTO) {
    console.log("data");
    console.log(data);
  }
}