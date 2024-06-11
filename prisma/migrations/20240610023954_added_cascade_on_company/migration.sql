-- DropForeignKey
ALTER TABLE "CompanyProject" DROP CONSTRAINT "CompanyProject_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPerson" DROP CONSTRAINT "ContactPerson_companyId_fkey";

-- DropForeignKey
ALTER TABLE "ContactPerson" DROP CONSTRAINT "ContactPerson_companyProjectId_fkey";

-- AddForeignKey
ALTER TABLE "CompanyProject" ADD CONSTRAINT "CompanyProject_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_companyProjectId_fkey" FOREIGN KEY ("companyProjectId") REFERENCES "CompanyProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
