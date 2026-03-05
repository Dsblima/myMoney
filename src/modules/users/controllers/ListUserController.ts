import { Request, Response } from 'express';
import { ListUserUseCase } from '../useCases/ListUserUseCase';

export class ListUserController {
  async handle(req: Request, res: Response): Promise<Response>{
    console.log("ListUserController");
    await new ListUserUseCase().execute();
    return res.status(201).json({message: "all users listed"});
  }
}