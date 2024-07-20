-- AlterTable
ALTER TABLE "CompleteStaffWork" ADD COLUMN     "transactionId" TEXT;

-- AddForeignKey
ALTER TABLE "CompleteStaffWork" ADD CONSTRAINT "CompleteStaffWork_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
