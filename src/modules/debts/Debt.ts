import { DebtStatus } from "@prisma/client";

export type Debt = {
  id: string;
  debtorId: string;
  creditorId: string;
  totalAmount: number;
  debtStatus: DebtStatus
}