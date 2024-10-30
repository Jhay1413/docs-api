/*
  Warnings:

  - A unique constraint covering the columns `[ticketId,receiverId,senderId,dateForwarded]` on the table `TicketLogs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverId` to the `TicketLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `TicketLogs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TicketLogs" ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "senderId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TicketLogs_ticketId_receiverId_senderId_dateForwarded_key" ON "TicketLogs"("ticketId", "receiverId", "senderId", "dateForwarded");
