/*
  Warnings:

  - The `attachments` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `attachments` column on the `TicketLogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "attachments",
ADD COLUMN     "attachments" TEXT[];

-- AlterTable
ALTER TABLE "TicketLogs" DROP COLUMN "attachments",
ADD COLUMN     "attachments" TEXT[];
