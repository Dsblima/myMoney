import { ICreateTransactionDTO } from "../dtos/ICreateTransactionDTO";
import { Transaction } from "../Transaction";
import { ITransactionRepository } from "./interface/ITransactionRepository";

export class TransactionRepository implements ITransactionRepository {
  async create(TransactionToCreate: ICreateTransactionDTO): Promise<Transaction> {
    const transaction: Transaction = {};

    return transaction;
  }

}