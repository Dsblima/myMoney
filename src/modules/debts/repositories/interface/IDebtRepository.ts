

import { Debt } from "../../Debt";
import { ICreateDebtDTO } from "../../dtos/ICreateDebtDTO";
import { IUpdateDebtDTO } from "../../dtos/IUpdateDebtDTO";

export interface IDebtRepository {
  create(debtToCreate: ICreateDebtDTO): Promise<Debt>;
  update(debtToUpdate: IUpdateDebtDTO): Promise<Debt>;
}