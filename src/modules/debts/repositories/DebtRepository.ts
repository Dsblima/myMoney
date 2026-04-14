
import { Debt } from "../Debt";
import { ICreateDebtDTO } from "../dtos/ICreateDebtDTO";
import { IUpdateDebtDTO } from "../dtos/IUpdateDebtDTO";
import { IDebtRepository } from "./interface/IDebtRepository";

export class DebtRepository implements IDebtRepository {
  async create(debtToCreate: ICreateDebtDTO): Promise<Debt> {
    const createdDebt: Debt= {};

    return createdDebt;
  }
  async update(debtToUpdate: IUpdateDebtDTO): Promise<Debt> {
    const updatedDebt: Debt= {};

    return updatedDebt;
  }
  
}