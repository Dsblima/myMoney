import { Installment as PrismaInstallment, Prisma } from "@prisma/client";
import { ICreateInstallmentDTO } from "../dtos/ICreateInstallmentDTO";
import { IUpdateInstallmentDTO } from "../dtos/IUpdateInstallmentDTO";
import { Installment } from "../Installment";

export class InstallmentMapper {
  static toDomain(installment: PrismaInstallment): Installment {
    return {
      id: installment.id,
      debtId: installment.debtId,
      baseAmount: installment.baseAmount,
      lateInterestRate: installment.lateInterestRate.toNumber(),
      finePercent: installment.finePercent.toNumber(),
      totalPaid: installment.totalPaid ?? 0,
      dueDate: installment.dueDate,
      status: installment.status,
      ...(installment.paidAt ? { paidAt: installment.paidAt } : {}),
    };
  }

  static toPrismaCreate({
    debtId,
    baseAmount,
    lateInterestRate,
    finePercent,
    dueDate,
  }: ICreateInstallmentDTO): Prisma.InstallmentUncheckedCreateInput {
    return {
      debtId,
      baseAmount,
      lateInterestRate,
      finePercent,
      dueDate,
      totalPaid: 0,
    };
  }

  static toPrismaUpdate({
    totalPaid,
  }: IUpdateInstallmentDTO): Prisma.InstallmentUncheckedUpdateInput {
    return {
      totalPaid,
    };
  }
}
