import { DebtStatus, Status, TransactionType } from "@prisma/client";
import { hash } from "bcryptjs";
import { prisma } from "./prisma";

const lateInterestRate = 0.02;
const finePercent = 0.1;
const defaultPassword = "123456";

type InstallmentSeed = {
  id: string;
  baseAmount: number;
  dueDate: Date;
  status: Status;
  totalPaid: number;
  paidAt?: Date;
};

type DebtSeed = {
  id: string;
  debtorId: string;
  creditorId: string;
  totalAmount: number;
  debtStatus: DebtStatus;
  installments: InstallmentSeed[];
};

function dueDate(month: number): Date {
  return new Date(Date.UTC(2026, month - 1, 1, 12));
}

function paidAt(month: number, day: number): Date {
  return new Date(Date.UTC(2026, month - 1, day, 12));
}

function createInstallments(
  debtKey: string,
  baseAmount: number,
  statuses: Array<{
    status: Status;
    totalPaid: number;
    paidAt?: Date;
  }>,
): InstallmentSeed[] {
  return statuses.map((installment, index) => ({
    id: `${debtKey}-installment-${index + 1}`,
    baseAmount,
    dueDate: dueDate(index + 1),
    status: installment.status,
    totalPaid: installment.totalPaid,
    ...(installment.paidAt ? { paidAt: installment.paidAt } : {}),
  }));
}

async function cleanDatabase(): Promise<void> {
  await prisma.transaction.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.debt.deleteMany();
  await prisma.userToken.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers(): Promise<void> {
  const password = await hash(defaultPassword, 8);

  await prisma.user.createMany({
    data: [
      {
        id: "seed-user-ana",
        name: "Ana Credora",
        email: "ana.credora@example.com",
        password,
      },
      {
        id: "seed-user-bruno",
        name: "Bruno Devedor",
        email: "bruno.devedor@example.com",
        password,
      },
      {
        id: "seed-user-carla",
        name: "Carla Devedora",
        email: "carla.devedora@example.com",
        password,
      },
      {
        id: "seed-user-diego",
        name: "Diego Devedor",
        email: "diego.devedor@example.com",
        password,
      },
    ],
  });
}

async function seedDebt(debt: DebtSeed): Promise<void> {
  await prisma.debt.create({
    data: {
      id: debt.id,
      debtorId: debt.debtorId,
      creditorId: debt.creditorId,
      totalAmount: debt.totalAmount,
      debtStatus: debt.debtStatus,
      installments: {
        create: debt.installments.map((installment) => ({
          id: installment.id,
          baseAmount: installment.baseAmount,
          dueDate: installment.dueDate,
          status: installment.status,
          lateInterestRate,
          finePercent,
          totalPaid: installment.totalPaid,
          ...(installment.paidAt ? { paidAt: installment.paidAt } : {}),
        })),
      },
    },
  });

  const paidInstallments = debt.installments.filter(
    (installment) => installment.totalPaid > 0,
  );

  if (paidInstallments.length === 0) {
    return;
  }

  await prisma.transaction.createMany({
    data: paidInstallments.map((installment) => ({
      debtId: debt.id,
      installmentId: installment.id,
      type: TransactionType.PAYMENT,
    })),
  });
}

async function main(): Promise<void> {
  await cleanDatabase();
  await seedUsers();

  const debts: DebtSeed[] = [
    {
      id: "seed-debt-all-paid",
      debtorId: "seed-user-bruno",
      creditorId: "seed-user-ana",
      totalAmount: 900,
      debtStatus: DebtStatus.PAID,
      installments: createInstallments("seed-debt-all-paid", 300, [
        { status: Status.PAID, totalPaid: 300, paidAt: paidAt(1, 5) },
        { status: Status.PAID, totalPaid: 300, paidAt: paidAt(2, 5) },
        { status: Status.PAID, totalPaid: 300, paidAt: paidAt(3, 5) },
      ]),
    },
    {
      id: "seed-debt-some-paid",
      debtorId: "seed-user-carla",
      creditorId: "seed-user-ana",
      totalAmount: 1200,
      debtStatus: DebtStatus.OPEN,
      installments: createInstallments("seed-debt-some-paid", 300, [
        { status: Status.PAID, totalPaid: 300, paidAt: paidAt(1, 8) },
        { status: Status.PAID, totalPaid: 300, paidAt: paidAt(2, 8) },
        { status: Status.PENDING, totalPaid: 0 },
        { status: Status.PENDING, totalPaid: 0 },
      ]),
    },
    {
      id: "seed-debt-none-paid",
      debtorId: "seed-user-diego",
      creditorId: "seed-user-ana",
      totalAmount: 600,
      debtStatus: DebtStatus.OPEN,
      installments: createInstallments("seed-debt-none-paid", 200, [
        { status: Status.PENDING, totalPaid: 0 },
        { status: Status.PENDING, totalPaid: 0 },
        { status: Status.PENDING, totalPaid: 0 },
      ]),
    },
    {
      id: "seed-debt-partially-paid",
      debtorId: "seed-user-bruno",
      creditorId: "seed-user-ana",
      totalAmount: 1000,
      debtStatus: DebtStatus.OPEN,
      installments: createInstallments("seed-debt-partially-paid", 250, [
        { status: Status.PENDING, totalPaid: 100 },
        { status: Status.PENDING, totalPaid: 125 },
        { status: Status.PENDING, totalPaid: 0 },
        { status: Status.PENDING, totalPaid: 0 },
      ]),
    },
  ];

  for (const debt of debts) {
    await seedDebt(debt);
  }

  console.log("Database seeded successfully.");
  console.table(
    debts.map((debt) => ({
      debtId: debt.id,
      status: debt.debtStatus,
      installments: debt.installments.length,
      paidInstallments: debt.installments.filter(
        (installment) => installment.status === Status.PAID,
      ).length,
      partialInstallments: debt.installments.filter(
        (installment) =>
          installment.totalPaid > 0 && installment.status !== Status.PAID,
      ).length,
    })),
  );
}

main()
  .catch((error) => {
    console.error("Database seed failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
