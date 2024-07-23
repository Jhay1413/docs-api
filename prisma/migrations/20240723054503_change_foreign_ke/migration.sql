-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
