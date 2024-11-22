/*
  Warnings:

  - A unique constraint covering the columns `[ticketId,receiverId,senderId,dateForwarded,status]` on the table `TicketLogs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TicketLogs_ticketId_receiverId_senderId_dateForwarded_key";

-- CreateIndex
CREATE UNIQUE INDEX "TicketLogs_ticketId_receiverId_senderId_dateForwarded_statu_key" ON "TicketLogs"("ticketId", "receiverId", "senderId", "dateForwarded", "status");
