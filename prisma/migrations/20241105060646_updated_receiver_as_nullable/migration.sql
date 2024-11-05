-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_receiverId_fkey";

-- AlterTable
ALTER TABLE "Ticket" ALTER COLUMN "receiverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TicketLogs" ALTER COLUMN "receiver" DROP NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "UserAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
