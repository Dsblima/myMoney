import { Status, TransactionType } from "@prisma/client";
import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../../transactions/repositories/interface/ITransactionRepository";
import { Installment } from "../Installment";
import { IPayInstallmentDTO } from "../dtos/IPayInstallmentDTO";
import { IInstallmentRepository } from "../repositories/interface/IInstallmentRepository";

@injectable()
export class PayInstallmentUseCase {
  constructor(
    @inject("InstallmentRepository")
    private installmentRepository: IInstallmentRepository,
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute({
    installmentId,
    amount,
    paidAt,
  }: IPayInstallmentDTO): Promise<Installment> {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Payment amount must be greater than zero");
    }

    const installment = await this.installmentRepository.findById(installmentId);

    if (!installment) {
      throw new Error("Installment not found");
    }

    if (installment.status === Status.PAID) {
      throw new Error("Installment already paid");
    }

    const totalPaid = installment.totalPaid + amount;
    const isPaid = totalPaid >= installment.baseAmount;

    const updatedInstallment = await this.installmentRepository.update({
      id: installment.id,
      totalPaid,
      ...(isPaid
        ? {
            status: Status.PAID,
            paidAt: paidAt ?? new Date(),
          }
        : {}),
    });

    await this.transactionRepository.create({
      debtId: installment.debtId,
      installmentId: installment.id,
      type: TransactionType.PAYMENT,
    });

    return updatedInstallment;
  }
}
