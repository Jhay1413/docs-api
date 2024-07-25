-- CreateTable
CREATE TABLE "CompleteStaffWork" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "remarks" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,

    CONSTRAINT "CompleteStaffWork_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompleteStaffWork" ADD CONSTRAINT "CompleteStaffWork_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
