/*
  Warnings:

  - You are about to drop the column `debitId` on the `Installment` table. All the data in the column will be lost.
  - You are about to drop the column `debitId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `debtId` to the `Installment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debtId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Installment" DROP CONSTRAINT "Installment_debitId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_debitId_fkey";

-- AlterTable
ALTER TABLE "Installment" DROP COLUMN "debitId",
ADD COLUMN     "debtId" TEXT NOT NULL,
ALTER COLUMN "totalPaid" DROP NOT NULL,
ALTER COLUMN "totalPaid" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "debitId",
ADD COLUMN     "debtId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Installment" ADD CONSTRAINT "Installment_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_debtId_fkey" FOREIGN KEY ("debtId") REFERENCES "Debt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
