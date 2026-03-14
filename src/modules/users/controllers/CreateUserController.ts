import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateUserUseCase } from '../useCases/CreateUserUseCase';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    console.log("Creating user...");
    const {name, email, password} = req.body;
    
    console.log("name, email, password", name, email, password);

    const createUserUseCase = container.resolve(CreateUserUseCase);
    const createdUser = await createUserUseCase.execute({name, email, password});
    return res.status(201).json(createdUser);
  }
}