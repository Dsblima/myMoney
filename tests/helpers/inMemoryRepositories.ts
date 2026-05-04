import { DebtStatus, Status } from "@prisma/client";
import { ICreateUserTokenDTO } from "../../src/modules/auth/dtos/ICreateUserTokenDTO";
import { UserToken } from "../../src/modules/auth/UserToken";
import { IUserTokenRepository } from "../../src/modules/auth/repositories/interface/IUserTokenRepository";
import { Debt } from "../../src/modules/debts/Debt";
import { ICreateDebtDTO } from "../../src/modules/debts/dtos/ICreateDebtDTO";
import { IDebtRepository } from "../../src/modules/debts/repositories/interface/IDebtRepository";
import { ICreateInstallmentDTO } from "../../src/modules/installments/dtos/ICreateInstallmentDTO";
import { IUpdateInstallmentDTO } from "../../src/modules/installments/dtos/IUpdateInstallmentDTO";
import { Installment } from "../../src/modules/installments/Installment";
import { IInstallmentRepository } from "../../src/modules/installments/repositories/interface/IInstallmentRepository";
import { ICreateUserDTO } from "../../src/modules/users/dtos/ICreateUserDTO";
import { IUpdateUserDTO } from "../../src/modules/users/dtos/IUpdateUserDTO";
import { User } from "../../src/modules/users/User";
import { IUserRepository } from "../../src/modules/users/repositories/interfaces/IUserRepository";

export class InMemoryUserRepository implements IUserRepository {
  users: User[] = [];
  createdPayloads: ICreateUserDTO[] = [];
  updatedPayloads: IUpdateUserDTO[] = [];
  deletedIds: string[] = [];

  async create(data: ICreateUserDTO): Promise<User> {
    this.createdPayloads.push({ ...data });

    const createdUser: User = {
      id: `user-${this.users.length + 1}`,
      ...data,
    };

    this.users.push(createdUser);

    return createdUser;
  }

  async update(userToUpdate: IUpdateUserDTO): Promise<User> {
    this.updatedPayloads.push({ ...userToUpdate });

    const userIndex = this.users.findIndex((user) => user.id === userToUpdate.id);

    if (userIndex < 0) {
      throw new Error("User not found");
    }

    const currentUser = this.users[userIndex]!;
    const updatedUser: User = {
      id: currentUser.id,
      name: userToUpdate.name,
      email: userToUpdate.email,
      password: currentUser.password,
    };

    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  async listUsers(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async delete(id: string): Promise<void> {
    this.deletedIds.push(id);
    this.users = this.users.filter((user) => user.id !== id);
  }
}

export class InMemoryUserTokenRepository implements IUserTokenRepository {
  tokens: UserToken[] = [];

  async create({
    userId,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const createdToken: UserToken = {
      id: `token-${this.tokens.length + 1}`,
      userId,
      refresh_token,
      expires_date,
    };

    this.tokens.push(createdToken);

    return createdToken;
  }
}

export class InMemoryDebtRepository implements IDebtRepository {
  debts: Debt[] = [];
  createdPayloads: ICreateDebtDTO[] = [];

  async create({
    debtorId,
    creditorId,
    totalAmount,
  }: ICreateDebtDTO): Promise<Debt> {
    this.createdPayloads.push({ debtorId, creditorId, totalAmount });

    const createdDebt: Debt = {
      id: `debt-${this.debts.length + 1}`,
      debtorId,
      creditorId,
      totalAmount,
      debtStatus: DebtStatus.OPEN,
    };

    this.debts.push(createdDebt);

    return createdDebt;
  }
}

export class InMemoryInstallmentRepository implements IInstallmentRepository {
  installments: Installment[] = [];
  createdPayloads: ICreateInstallmentDTO[] = [];
  updatedPayloads: IUpdateInstallmentDTO[] = [];

  async create({
    debtId,
    baseAmount,
    lateInterestRate,
    finePercent,
    dueDate,
  }: ICreateInstallmentDTO): Promise<Installment> {
    this.createdPayloads.push({
      debtId,
      baseAmount,
      lateInterestRate,
      finePercent,
      dueDate,
    });

    const createdInstallment: Installment = {
      id: `installment-${this.installments.length + 1}`,
      debtId,
      baseAmount,
      lateInterestRate,
      finePercent,
      totalPaid: 0,
      dueDate,
      status: Status.PENDING,
    };

    this.installments.push(createdInstallment);

    return createdInstallment;
  }

  async update({ id, totalPaid }: IUpdateInstallmentDTO): Promise<Installment> {
    this.updatedPayloads.push({ id, totalPaid });

    const installmentIndex = this.installments.findIndex(
      (installment) => installment.id === id,
    );

    if (installmentIndex < 0) {
      throw new Error("Installment not found");
    }

    const currentInstallment = this.installments[installmentIndex]!;
    const updatedInstallment: Installment = {
      id: currentInstallment.id,
      debtId: currentInstallment.debtId,
      baseAmount: currentInstallment.baseAmount,
      lateInterestRate: currentInstallment.lateInterestRate,
      finePercent: currentInstallment.finePercent,
      totalPaid,
      dueDate: currentInstallment.dueDate,
      status: currentInstallment.status,
      ...(currentInstallment.paidAt
        ? { paidAt: currentInstallment.paidAt }
        : {}),
    };

    this.installments[installmentIndex] = updatedInstallment;

    return updatedInstallment;
  }
}
