-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_receiverId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "receiverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TransactionLogs" ALTER COLUMN "receiver" DROP NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "UserAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
