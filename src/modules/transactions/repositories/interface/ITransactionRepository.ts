import { ICreateTransactionDTO } from "../../dtos/ICreateTransactionDTO";
import { Transaction } from "../../Transaction";

export interface ITransactionRepository {
  create(TransactionToCreate: ICreateTransactionDTO): Promise<Transaction>;
}