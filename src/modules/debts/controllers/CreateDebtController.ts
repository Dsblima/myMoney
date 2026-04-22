import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ICreateDebtDTO } from '../dtos/ICreateDebtDTO';
import { CreateDebtUseCase } from '../useCases/CreateDebtUseCase';

export class CreateDebtController{
  async handle(req: Request, res: Response): Promise<Response> {
    const {debtorId, creditorId, totalAmount, installments } = req.body;
    const createDebtUseCase = container.resolve(CreateDebtUseCase);

    const createdDebt = createDebtUseCase.execute({debtorId, creditorId, totalAmount, installments} as ICreateDebtDTO);
    return res.status(201).json(createdDebt);
  }
}