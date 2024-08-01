/*
  Warnings:

  - A unique constraint covering the columns `[transactionId,receiverId,dateForwarded]` on the table `TransactionLogs` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TransactionLogs_transactionId_receiverId_dateForwarded_key" ON "TransactionLogs"("transactionId", "receiverId", "dateForwarded");
