import { Request, Response } from "express";
import { container } from "tsyringe";
import { PayInstallmentUseCase } from "../useCases/PayInstallmentUseCase";

export class PayInstallmentController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { installmentId } = req.params;
    const { amount, paidAt } = req.body;

    if (typeof installmentId !== "string") {
      return res.status(400).json({ message: "Installment id is required" });
    }

    const payInstallmentUseCase = container.resolve(PayInstallmentUseCase);

    const paidInstallment = await payInstallmentUseCase.execute({
      installmentId,
      amount: Number(amount),
      ...(paidAt ? { paidAt: new Date(paidAt) } : {}),
    });

    return res.status(200).json(paidInstallment);
  }
}
