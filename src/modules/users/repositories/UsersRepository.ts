import { prisma } from "../../../shared/infra/prisma/prisma";
import { ICreateUserDTO } from "../dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../dtos/IUpdateUserDTO";
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
  async update(userToUpdate: IUpdateUserDTO): Promise<User> {
    const updateUser = await prisma.user.update({
      where: {id: userToUpdate.id},
      data: {
        name: userToUpdate.name,
        email: userToUpdate.email
      }
    });

    return updateUser;
  }
  async listUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async findById(userId: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {id: userId}
    });

    if (!user) {
      throw new Error(`User with id ${userId} not found`);
    }

    return user;
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {email: email}
    });

    return user;
  }
  async delete(userId: string): Promise<void> {
    const deletedUser = await prisma.user.delete({
      where: {id: userId}
    });
    
    console.log("deletedUser");
    console.log(deletedUser);
  }
}