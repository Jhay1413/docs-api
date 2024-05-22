-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('SUPERADMIN', 'ADMIN', 'USER');

-- CreateTable
CREATE TABLE "UserInfo" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "assignedDivision" TEXT NOT NULL,
    "assignedPosition" TEXT NOT NULL,
    "assignedSection" TEXT NOT NULL,
    "dateStarted" TIMESTAMP(3) NOT NULL,
    "jobStatus" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "UserInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAccounts" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Roles" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAccounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentInfo" (
    "id" SERIAL NOT NULL,
    "documentType" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "specification" TEXT NOT NULL,
    "attachment" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" INTEGER NOT NULL,

    CONSTRAINT "DocumentInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "historyId" INTEGER NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentHistory" (
    "id" SERIAL NOT NULL,
    "forwarededFrom" TEXT NOT NULL,
    "forwardedTo" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "documentId" INTEGER NOT NULL,
    "recievedBy" INTEGER NOT NULL,

    CONSTRAINT "DocumentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_email_key" ON "UserInfo"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_accountId_key" ON "UserInfo"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAccounts_email_key" ON "UserAccounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentInfo_createdBy_key" ON "DocumentInfo"("createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentHistory_recievedBy_key" ON "DocumentHistory"("recievedBy");

-- AddForeignKey
ALTER TABLE "UserInfo" ADD CONSTRAINT "UserInfo_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentInfo" ADD CONSTRAINT "DocumentInfo_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_historyId_fkey" FOREIGN KEY ("historyId") REFERENCES "DocumentHistory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "DocumentInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentHistory" ADD CONSTRAINT "DocumentHistory_recievedBy_fkey" FOREIGN KEY ("recievedBy") REFERENCES "UserAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
