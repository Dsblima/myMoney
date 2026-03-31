import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { UpdateUserUseCase } from '../useCases/UpdateUserUseCase';

export class UpdateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const {id} = req.params;
    const {name, email} = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const updateUserUseCase = container.resolve(UpdateUserUseCase);
    const updatedUser = await updateUserUseCase.execute({name, email, id})

    return res.status(200).json({updatedUser: updatedUser});
  }
}