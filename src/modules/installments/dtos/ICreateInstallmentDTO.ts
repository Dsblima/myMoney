export interface ICreateInstallmentDTO {
  debtId: string;
  baseAmount: number;
  lateInterestRate: number;
  finePercent: number;
  dueDate: Date;
}