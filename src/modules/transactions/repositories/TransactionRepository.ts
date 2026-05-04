import { prisma } from "../../../shared/infra/prisma/prisma";
import { ICreateTransactionDTO } from "../dtos/ICreateTransactionDTO";
import { Transaction } from "../Transaction";
import { ITransactionRepository } from "./interface/ITransactionRepository";

export class TransactionRepository implements ITransactionRepository {
  async create(TransactionToCreate: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = await prisma.transaction.create({
      data: TransactionToCreate,
    });

    return transaction;
  }
}
