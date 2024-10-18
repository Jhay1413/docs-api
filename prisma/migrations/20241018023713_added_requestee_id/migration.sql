/*
  Warnings:

  - Added the required column `division` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesteeId` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "division" TEXT NOT NULL,
ADD COLUMN     "requesteeId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_requesteeId_fkey" FOREIGN KEY ("requesteeId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
