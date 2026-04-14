import { ICreateInstallmentDTO } from "../dtos/ICreateInstallmentDTO";
import { IUpdateInstallmentDTO } from "../dtos/IUpdateInstallmentDTO";
import { Installment } from "../Installment";
import { IInstallmentRepository } from "./interface/IInstallmentRepository";

export class InstallmentRepository implements IInstallmentRepository {
  async create(installmentToCreate: ICreateInstallmentDTO): Promise<Installment> {
    const installmentCreated: Installment = {};
    return installmentCreated;
  }
  async update(installmentToUpdate: IUpdateInstallmentDTO): Promise<Installment> {
    const installmentUpdated: Installment = {};
    return installmentUpdated;
  }

}