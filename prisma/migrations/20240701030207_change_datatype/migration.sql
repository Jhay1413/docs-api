/*
  Warnings:

  - The `dateReceived` column on the `TransactionLogs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `dateForwarded` on the `TransactionLogs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TransactionLogs" DROP COLUMN "dateForwarded",
ADD COLUMN     "dateForwarded" TIMESTAMP(3) NOT NULL,
DROP COLUMN "dateReceived",
ADD COLUMN     "dateReceived" TIMESTAMP(3);
