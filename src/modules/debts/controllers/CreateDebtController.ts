import { Request, Response } from 'express';

export class CreateDebtController{
  async handle(req: Request, res: Response): Promise<Response> {
    return res.status(201);
  }
}