/*
  Warnings:

  - Added the required column `retainer` to the `CompanyProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyProject" ADD COLUMN     "date_expiry" TIMESTAMP(3),
ADD COLUMN     "retainer" BOOLEAN NOT NULL;
