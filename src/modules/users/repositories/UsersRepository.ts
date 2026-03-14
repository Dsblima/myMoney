import { prisma } from "../../../shared/infra/prisma/prisma";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../User";
import { IUserRepository } from "./interfaces/IUserRepository";
export class UsersRepository implements IUserRepository {
  
  users: User[] = [];
  async create({name, email, password}: ICreateUserDTO): Promise<User> {
    console.log("UsersRepository")
    const createdUser: User = { id : "123",
      name: name,
      email: email,
      password: password}; 
    this.users.push(createdUser);

    const userPrism = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
    console.log("users lenght", this.users.length)
    console.log("userPrism2", userPrism)
    return createdUser;
  }

  async listUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

}