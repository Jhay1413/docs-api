/*
  Warnings:

  - You are about to drop the column `forwardedById` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `forwardedByRole` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `forwardedTo` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `receivedById` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `forwardedBy` on the `TransactionLogs` table. All the data in the column will be lost.
  - You are about to drop the column `forwardedByRole` on the `TransactionLogs` table. All the data in the column will be lost.
  - You are about to drop the column `forwardedTo` on the `TransactionLogs` table. All the data in the column will be lost.
  - Added the required column `forwarderId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `forwarder` to the `TransactionLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiver` to the `TransactionLogs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_forwardedById_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receivedById_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "forwardedById",
DROP COLUMN "forwardedByRole",
DROP COLUMN "forwardedTo",
DROP COLUMN "receivedById",
ADD COLUMN     "forwarderId" TEXT NOT NULL,
ADD COLUMN     "receiverId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TransactionLogs" DROP COLUMN "forwardedBy",
DROP COLUMN "forwardedByRole",
DROP COLUMN "forwardedTo",
ADD COLUMN     "forwarder" TEXT NOT NULL,
ADD COLUMN     "receiver" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_forwarderId_fkey" FOREIGN KEY ("forwarderId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
