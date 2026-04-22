export interface ICreateDebtDTO  {
  debtorId: string;
  creditorId: string;
  totalAmount: number;
  installments?: number;
}