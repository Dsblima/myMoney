import { TransactionType } from "@prisma/client";

export type Transaction = {
  id: string;
  debtId: string;
  installmentId: string;
  type: TransactionType;
  createdAt: Date;
  updatedAt: Date;
}
