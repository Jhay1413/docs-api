/*
  Warnings:

  - You are about to drop the column `companyId` on the `ContactPerson` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[contactPersonId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[contactPersonId]` on the table `CompanyProject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ContactPerson" DROP CONSTRAINT "ContactPerson_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPerson" DROP CONSTRAINT "ContactPerson_companyProjectId_fkey";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "contactPersonId" TEXT;

-- AlterTable
ALTER TABLE "CompanyProject" ADD COLUMN     "contactPersonId" TEXT;

-- AlterTable
ALTER TABLE "ContactPerson" DROP COLUMN "companyId";

-- CreateIndex
CREATE UNIQUE INDEX "Company_contactPersonId_key" ON "Company"("contactPersonId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProject_contactPersonId_key" ON "CompanyProject"("contactPersonId");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "ContactPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProject" ADD CONSTRAINT "CompanyProject_contactPersonId_fkey" FOREIGN KEY ("contactPersonId") REFERENCES "ContactPerson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
