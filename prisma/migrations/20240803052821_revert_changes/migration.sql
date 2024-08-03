/*
  Warnings:

  - Made the column `receiverId` on table `Transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiver` on table `TransactionLogs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `receiverId` on table `TransactionLogs` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "receiverId" SET NOT NULL;

-- AlterTable
ALTER TABLE "TransactionLogs" ALTER COLUMN "receiver" SET NOT NULL,
ALTER COLUMN "receiverId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
