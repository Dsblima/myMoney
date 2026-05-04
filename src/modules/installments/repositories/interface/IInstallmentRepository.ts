import { ICreateInstallmentDTO } from "../../dtos/ICreateInstallmentDTO";
import { IUpdateInstallmentDTO } from "../../dtos/IUpdateInstallmentDTO";
import { Installment } from "../../Installment";

export interface IInstallmentRepository {
  create(installmentToCreate: ICreateInstallmentDTO): Promise<Installment>;
  findById(id: string): Promise<Installment | null>;
  update(installmentToUpdate: IUpdateInstallmentDTO): Promise<Installment>;
}
