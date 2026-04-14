import { TransactionType } from "@prisma/client";

export interface ICreateTransactionDTO {
  debtId: string;
  installmentId: string;
  type: TransactionType;
}