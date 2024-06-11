/*
  Warnings:

  - You are about to drop the column `companId` on the `Company` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "companId",
ADD COLUMN     "companyId" TEXT NOT NULL;
