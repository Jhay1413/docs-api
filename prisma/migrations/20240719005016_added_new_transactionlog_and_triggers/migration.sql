/*
  Warnings:

  - You are about to drop the `SampleDB` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SampleDB" DROP CONSTRAINT "SampleDB_transactionId_fkey";

-- DropTable
DROP TABLE "SampleDB";

-- CreateTable
CREATE TABLE "TransactionLog" (
    "id" SERIAL NOT NULL,
    "old_data" TEXT NOT NULL,
    "new_data" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "TransactionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionLog" ADD CONSTRAINT "TransactionLog_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


---AddSQLFunction
