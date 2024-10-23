/*
  Warnings:

  - Added the required column `dateForwarded` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "dateForwarded" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateReceived" TIMESTAMP(3),
ALTER COLUMN "requestType" DROP DEFAULT;

-- CreateTable
CREATE TABLE "TicketLogs" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "dateForwarded" TIMESTAMP(3) NOT NULL,
    "dateReceived" TIMESTAMP(3),
    "sender" TEXT NOT NULL,
    "receiver" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attachments" TEXT,

    CONSTRAINT "TicketLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketLogs" ADD CONSTRAINT "TicketLogs_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
