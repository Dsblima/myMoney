import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListUserUseCase } from '../useCases/ListUserUseCase';
import { User } from '../User';

export class ListUserController {
  async handle(req: Request, res: Response): Promise<Response>{
    console.log("ListUserController");
    const listUserUseCase = container.resolve(ListUserUseCase)

    const allUsers: User[] = await listUserUseCase.execute();
    return res.status(201).json({users: allUsers});
  }
}