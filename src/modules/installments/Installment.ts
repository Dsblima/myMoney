import { Status } from "@prisma/client";

export type Installment = {
  id: string;
  debtId: string;
  baseAmount: number;
  lateInterestRate: number;
  finePercent: number;
  totalPaid: number;
  paidAt?: Date;
  dueDate: Date;
  status: Status;
}
