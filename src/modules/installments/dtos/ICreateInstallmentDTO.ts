export interface ICreateInstallmentDTO {
  debitId: string;
  baseAmount: number;
  lateInterestRate: number;
  finePercent: number;
  dueDate: Date;
}