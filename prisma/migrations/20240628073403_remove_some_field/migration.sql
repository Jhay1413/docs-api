/*
  Warnings:

  - You are about to drop the column `fromDepartment` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `parentRecordId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toDepartment` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `originDepartment` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetDepartment` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fromDepartment",
DROP COLUMN "parentRecordId",
DROP COLUMN "toDepartment",
ADD COLUMN     "originDepartment" TEXT NOT NULL,
ADD COLUMN     "targetDepartment" TEXT NOT NULL;
