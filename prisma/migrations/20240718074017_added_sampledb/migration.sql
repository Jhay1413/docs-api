-- CreateTable
CREATE TABLE "SampleDB" (
    "id" TEXT NOT NULL,
    "sample" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "transactionId" TEXT,

    CONSTRAINT "SampleDB_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SampleDB" ADD CONSTRAINT "SampleDB_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
