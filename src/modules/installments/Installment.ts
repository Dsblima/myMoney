import { Status } from "@prisma/client";

export type Installment = {
  debitId: string;
  baseAmount: number;
  lateInterestRate: number;
  finePercent: number;
  totalPaid: number;
  paidAt: Date;
  dueDate: Date;
  status: Status;
}