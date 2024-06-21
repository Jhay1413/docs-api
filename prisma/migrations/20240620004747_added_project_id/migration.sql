/*
  Warnings:

  - A unique constraint covering the columns `[companyId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[projectId]` on the table `CompanyProject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `projectId` to the `CompanyProject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyProject" ADD COLUMN     "projectId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_companyId_key" ON "Company"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProject_projectId_key" ON "CompanyProject"("projectId");
