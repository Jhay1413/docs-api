-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "team" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TransactionLogs" ALTER COLUMN "team" DROP NOT NULL;
