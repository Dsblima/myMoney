import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Status, TransactionType } from "@prisma/client";
import { PayInstallmentUseCase } from "../../../../src/modules/installments/useCases/PayInstallmentUseCase";
import {
  InMemoryInstallmentRepository,
  InMemoryTransactionRepository,
} from "../../../helpers/inMemoryRepositories";

describe("PayInstallmentUseCase", () => {
  it("registers a partial payment without closing the installment", async () => {
    const installmentsRepository = new InMemoryInstallmentRepository();
    const transactionsRepository = new InMemoryTransactionRepository();
    const sut = new PayInstallmentUseCase(
      installmentsRepository,
      transactionsRepository,
    );

    installmentsRepository.installments = [
      {
        id: "installment-1",
        debtId: "debt-1",
        baseAmount: 500,
        lateInterestRate: 0.02,
        finePercent: 0.1,
        totalPaid: 100,
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
        status: Status.PENDING,
      },
    ];

    const paidInstallment = await sut.execute({
      installmentId: "installment-1",
      amount: 200,
    });

    assert.equal(paidInstallment.totalPaid, 300);
    assert.equal(paidInstallment.status, Status.PENDING);
    assert.equal(paidInstallment.paidAt, undefined);
    assert.deepEqual(transactionsRepository.createdPayloads, [
      {
        debtId: "debt-1",
        installmentId: "installment-1",
        type: TransactionType.PAYMENT,
      },
    ]);
  });

  it("marks the installment as paid when the payment covers the base amount", async () => {
    const paidAt = new Date("2026-05-04T10:00:00.000Z");
    const installmentsRepository = new InMemoryInstallmentRepository();
    const transactionsRepository = new InMemoryTransactionRepository();
    const sut = new PayInstallmentUseCase(
      installmentsRepository,
      transactionsRepository,
    );

    installmentsRepository.installments = [
      {
        id: "installment-1",
        debtId: "debt-1",
        baseAmount: 500,
        lateInterestRate: 0.02,
        finePercent: 0.1,
        totalPaid: 200,
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
        status: Status.PENDING,
      },
    ];

    const paidInstallment = await sut.execute({
      installmentId: "installment-1",
      amount: 300,
      paidAt,
    });

    assert.equal(paidInstallment.totalPaid, 500);
    assert.equal(paidInstallment.status, Status.PAID);
    assert.equal(paidInstallment.paidAt, paidAt);
    assert.equal(transactionsRepository.createdPayloads.length, 1);
  });

  it("rejects payment for an installment that is already paid", async () => {
    const installmentsRepository = new InMemoryInstallmentRepository();
    const transactionsRepository = new InMemoryTransactionRepository();
    const sut = new PayInstallmentUseCase(
      installmentsRepository,
      transactionsRepository,
    );

    installmentsRepository.installments = [
      {
        id: "installment-1",
        debtId: "debt-1",
        baseAmount: 500,
        lateInterestRate: 0.02,
        finePercent: 0.1,
        totalPaid: 500,
        paidAt: new Date("2026-05-04T10:00:00.000Z"),
        dueDate: new Date("2026-05-01T00:00:00.000Z"),
        status: Status.PAID,
      },
    ];

    await assert.rejects(
      () =>
        sut.execute({
          installmentId: "installment-1",
          amount: 100,
        }),
      /Installment already paid/,
    );
    assert.equal(transactionsRepository.createdPayloads.length, 0);
  });

  it("rejects payment when the amount is invalid", async () => {
    const installmentsRepository = new InMemoryInstallmentRepository();
    const transactionsRepository = new InMemoryTransactionRepository();
    const sut = new PayInstallmentUseCase(
      installmentsRepository,
      transactionsRepository,
    );

    await assert.rejects(
      () =>
        sut.execute({
          installmentId: "installment-1",
          amount: 0,
        }),
      /Payment amount must be greater than zero/,
    );
  });
});
