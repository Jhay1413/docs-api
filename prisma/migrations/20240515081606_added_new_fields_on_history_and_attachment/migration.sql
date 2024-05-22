/*
  Warnings:

  - Added the required column `remarks` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateForwarded` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `DocumentHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attachment" ADD COLUMN     "remarks" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DocumentHistory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dateForwarded" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateReceived" TIMESTAMP(3),
ADD COLUMN     "subject" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
