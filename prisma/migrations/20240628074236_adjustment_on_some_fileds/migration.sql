/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `forwardedBy` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receivedBy` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forwardedById` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_forwardedBy_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receivedBy_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "createdBy",
DROP COLUMN "forwardedBy",
DROP COLUMN "receivedBy",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "forwardedById" TEXT NOT NULL,
ADD COLUMN     "receivedById" TEXT;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_forwardedById_fkey" FOREIGN KEY ("forwardedById") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receivedById_fkey" FOREIGN KEY ("receivedById") REFERENCES "UserAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
