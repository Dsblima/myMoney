import { inject, injectable } from "tsyringe";
import { z } from "zod";
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
    const userSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6)
    });
    try{
      const validatedData: ICreateUserDTO = userSchema.parse(data);
      console.log("validatedData", validatedData);
      await this.usersRepository.create(validatedData);
    } catch (error){
      if (error instanceof z.ZodError) {
        const mensagens = error.issues.map(err => err.message);
        console.error("Validation failed:", mensagens);
      } else {
        console.error("An unexpected error occurred:", error);
      }
    }
    // const validatedData = userSchema.safeParse(data);
    // if (validatedData.success) {

    //   console.log("validatedData", validatedData);
    //   await this.usersRepository.create(validatedData.data);
    // } else {
    //   console.error("Invalid data: ", validatedData.error.issues )
    //   const mensagens = validatedData.error.issues.map(err => err.message);
    //   console.log(mensagens); 
    // }
  }
}