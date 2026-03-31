import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../../dtos/IUpdateUserDTO";
import { User } from "../../User";

export interface IUserRepository {
  create(data: ICreateUserDTO): Promise<User>;
  update(userToUpdate: IUpdateUserDTO): Promise<User>;
  listUsers(): Promise<User[]>;
  findById(id: string): Promise<User>;
  delete(id: string): Promise<void>;
}