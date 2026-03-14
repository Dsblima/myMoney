import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../User";

export interface IUserRepository {
  create(data: ICreateUserDTO): Promise<User>;
  listUsers(): Promise<User[]>;
}