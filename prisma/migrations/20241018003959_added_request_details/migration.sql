/*
  Warnings:

  - You are about to drop the column `requesteeId` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `requestDetails` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ticket" DROP CONSTRAINT "Ticket_requesteeId_fkey";

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "requesteeId",
ADD COLUMN     "requestDetails" TEXT NOT NULL,
ALTER COLUMN "attachments" DROP NOT NULL;
