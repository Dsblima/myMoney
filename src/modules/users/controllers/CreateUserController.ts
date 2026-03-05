import { Request, Response } from 'express';
import {CreateUserUseCase} from '../useCases/CreateUserUseCase';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    console.log("Creating user...");
     const {name, email, password} = req.body;
    await new CreateUserUseCase().execute({name, email, password});
    return res.status(201).json({ message: "User created successfully." });
  }
}