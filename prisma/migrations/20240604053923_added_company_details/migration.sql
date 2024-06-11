-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProject" (
    "id" TEXT NOT NULL,
    "projectName" TEXT NOT NULL,
    "projectAddress" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,

    CONSTRAINT "CompanyProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPerson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "middleName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "contactNumber" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "companyProjectId" TEXT NOT NULL,

    CONSTRAINT "ContactPerson_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompanyProject" ADD CONSTRAINT "CompanyProject_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_companyProjectId_fkey" FOREIGN KEY ("companyProjectId") REFERENCES "CompanyProject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
