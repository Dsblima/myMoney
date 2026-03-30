import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { DeleteUserUseCase } from '../useCases/DeleteUserUseCase';

export class DeleteUserController {
  async handle (req: Request, res: Response): Promise<Response> {
    const {id} = req.params;
    
    if (!id || typeof id !== 'string') {
      return res.status(400).json({ error: 'Invalid user id' });
    }
    
    const deleteUserUseCase = container.resolve(DeleteUserUseCase);
    const deletedUser = await deleteUserUseCase.execute(id);
    return res.status(201).json({deletedUser: deletedUser});
  }
}