
import { prisma } from "../../../shared/infra/prisma/prisma";
import { Debt } from "../Debt";
import { ICreateDebtDTO } from "../dtos/ICreateDebtDTO";
import { IDebtRepository } from "./interface/IDebtRepository";

export class DebtRepository implements IDebtRepository {
  async create({debtorId, creditorId, totalAmount, installments}: ICreateDebtDTO): Promise<Debt> {
    const createdDebt = await prisma.debt.create({
      data: {debtorId, creditorId, totalAmount}});
    
    return createdDebt;
  }
  // async update(debtToUpdate: IUpdateDebtDTO): Promise<Debt> {
  //   const updatedDebt = await prisma.debt.update;

  //   return updatedDebt;
  // }
  
}