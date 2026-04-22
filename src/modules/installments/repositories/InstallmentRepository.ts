import { prisma } from "../../../shared/infra/prisma/prisma";
import { ICreateInstallmentDTO } from "../dtos/ICreateInstallmentDTO";
import { IUpdateInstallmentDTO } from "../dtos/IUpdateInstallmentDTO";
import { Installment } from "../Installment";
import { InstallmentMapper } from "../mappers/InstallmentMapper";
import { IInstallmentRepository } from "./interface/IInstallmentRepository";

export class InstallmentRepository implements IInstallmentRepository {
  async create(installmentToCreate: ICreateInstallmentDTO): Promise<Installment> {
    const installmentCreated = await prisma.installment.create({
      data: InstallmentMapper.toPrismaCreate(installmentToCreate),
    });

    return InstallmentMapper.toDomain(installmentCreated);
  }

  async update(installmentToUpdate: IUpdateInstallmentDTO): Promise<Installment> {
    const installmentUpdated = await prisma.installment.update({
      where: { id: installmentToUpdate.id },
      data: InstallmentMapper.toPrismaUpdate(installmentToUpdate),
    });

    return InstallmentMapper.toDomain(installmentUpdated);
  }
}
