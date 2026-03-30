import { prisma } from "../../../shared/infra/prisma/prisma";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { User } from "../User";
import { IUserRepository } from "./interfaces/IUserRepository";
export class UsersRepository implements IUserRepository {
  async create({name, email, password}: ICreateUserDTO): Promise<User> {
    console.log("UsersRepository")
    const createdUser: User = { id : "123",
      name: name,
      email: email,
      password: password}; 

    const userPrism = await prisma.user.create({
      data: {
        name,
        email,
        password
      }
    });
    console.log("userPrism2", userPrism)
    return createdUser;
  }

  async listUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async findById(userId: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: {id: userId}
    });

    return user;
  }
  async delete(userId: string): Promise<void> {
    const deletedUser = await prisma.user.delete({
      where: {id: userId}
    });
    
    console.log("deletedUser");
    console.log(deletedUser);
    return deletedUser;
  }
}