-- AlterTable
ALTER TABLE "TransactionLogs" ALTER COLUMN "receiver" DROP NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;
