import { DebtStatus } from "@prisma/client";

export interface IUpdateDebtDTO  {
  Id: string;
  debtorId: string;
  creditorId: string;
  totalAmount: number;
  debtStatus: DebtStatus;
}