/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `ContactPerson` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[companyProjectId]` on the table `ContactPerson` will be added. If there are existing duplicate values, this will fail.
  - Made the column `companyId` on table `ContactPerson` required. This step will fail if there are existing NULL values in that column.
  - Made the column `companyProjectId` on table `ContactPerson` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ContactPerson" ALTER COLUMN "companyId" SET NOT NULL,
ALTER COLUMN "companyProjectId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ContactPerson_companyId_key" ON "ContactPerson"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContactPerson_companyProjectId_key" ON "ContactPerson"("companyProjectId");
