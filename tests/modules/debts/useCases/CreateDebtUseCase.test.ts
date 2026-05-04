import "reflect-metadata";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CreateDebtUseCase } from "../../../../src/modules/debts/useCases/CreateDebtUseCase";
import {
  InMemoryDebtRepository,
  InMemoryInstallmentRepository,
} from "../../../helpers/inMemoryRepositories";

describe("CreateDebtUseCase", () => {
  it("creates only the debt when installments are not provided", async () => {
    const debtsRepository = new InMemoryDebtRepository();
    const installmentsRepository = new InMemoryInstallmentRepository();
    const sut = new CreateDebtUseCase(debtsRepository, installmentsRepository);

    const createdDebt = await sut.execute({
      debtorId: "debtor-1",
      creditorId: "creditor-1",
      totalAmount: 900,
    });

    assert.equal(createdDebt.id, "debt-1");
    assert.equal(debtsRepository.createdPayloads.length, 1);
    assert.equal(installmentsRepository.createdPayloads.length, 0);
  });

  it("creates one installment per requested parcel", async (t) => {
    t.mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-04-24T12:00:00.000Z"),
    });
    t.after(() => {
      t.mock.timers.reset();
    });

    const debtsRepository = new InMemoryDebtRepository();
    const installmentsRepository = new InMemoryInstallmentRepository();
    const sut = new CreateDebtUseCase(debtsRepository, installmentsRepository);

    const createdDebt = await sut.execute({
      debtorId: "debtor-1",
      creditorId: "creditor-1",
      totalAmount: 900,
      installments: 3,
    });

    assert.equal(createdDebt.id, "debt-1");
    assert.equal(installmentsRepository.createdPayloads.length, 3);
    assert.deepEqual(
      installmentsRepository.createdPayloads.map((installment) => ({
        debtId: installment.debtId,
        baseAmount: installment.baseAmount,
        lateInterestRate: installment.lateInterestRate,
        finePercent: installment.finePercent,
        year: installment.dueDate.getFullYear(),
        month: installment.dueDate.getMonth(),
        day: installment.dueDate.getDate(),
      })),
      [
        {
          debtId: "debt-1",
          baseAmount: 300,
          lateInterestRate: 0.02,
          finePercent: 0.1,
          year: 2026,
          month: 4,
          day: 1,
        },
        {
          debtId: "debt-1",
          baseAmount: 300,
          lateInterestRate: 0.02,
          finePercent: 0.1,
          year: 2026,
          month: 5,
          day: 1,
        },
        {
          debtId: "debt-1",
          baseAmount: 300,
          lateInterestRate: 0.02,
          finePercent: 0.1,
          year: 2026,
          month: 6,
          day: 1,
        },
      ],
    );
  });
});
