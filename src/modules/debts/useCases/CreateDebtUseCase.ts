import { addMonths, startOfMonth } from "date-fns";
import { inject, injectable } from "tsyringe";
import { ICreateInstallmentDTO } from "../../installments/dtos/ICreateInstallmentDTO";
import { IInstallmentRepository } from "../../installments/repositories/interface/IInstallmentRepository";
import { ICreateDebtDTO } from "../dtos/ICreateDebtDTO";
import { IDebtRepository } from "../repositories/interface/IDebtRepository";

@injectable()
export class CreateDebtUseCase {
  constructor(
    @inject("DebtRepository")
    private debtRepository: IDebtRepository,
    @inject("InstallmentRepository")
    private installmentRepository: IInstallmentRepository
  ){}
  async execute({debtorId, creditorId, totalAmount, installments}: ICreateDebtDTO) {
    const finePercent = 0.1;
    const lateInterestRate = 0.02;
    const createdDebt = await this.debtRepository.create({debtorId, creditorId, totalAmount});
    
    if (installments) {
      const baseAmount = totalAmount / installments;
      const dueDates = this.generateDueDates(installments);
      
      const installmentsData: ICreateInstallmentDTO[] = dueDates.map(date => ({
        dueDate: date,
        debtId: createdDebt.id,
        baseAmount,
        lateInterestRate,
        finePercent,
      }));

      installmentsData.forEach(async installment => {
        await this.installmentRepository.create(installment);
      });
    }
    return createdDebt;
  }

  private generateDueDates(installments: number): Date[] {
    const dates: Date[] = [];
    const today = new Date();

    for (let i = 0; i < installments; i++) {
      const nextMonth = addMonths(today, i + 1);
      const dueDate = startOfMonth(nextMonth);

      dates.push(dueDate);
    }

    return dates;
  }
}